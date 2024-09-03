import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import * as web3 from '@solana/web3.js';

const prisma = new PrismaClient();

// Connect to Solana devnet
const connection = new web3.Connection(web3.clusterApiUrl('devnet'));

export async function POST(req: NextRequest) {
  try {
    const { action, userId, amount, toAddress, eventId, encryptedPrivateKey } = await req.json();

    switch (action) {
      case 'create':
        return await createWallet(userId);
      case 'import':
        return await importWallet(userId, encryptedPrivateKey);
      case 'send':
        return await sendTransaction(userId, amount, toAddress);
      case 'getBalance':
        return await getBalance(userId);
      case 'getTransactions':
        return await getTransactions(userId);
      case 'getWalletDetails':
        return await getWalletDetails(userId);
      case 'requestAirdrop':
        return await requestAirdrop(userId);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function createWallet(userId: number) {
  const existingWallet = await prisma.wallet.findUnique({ where: { userId } });
  if (existingWallet) {
    return NextResponse.json({ error: 'Wallet already exists for this user' }, { status: 400 });
  }

  const wallet = web3.Keypair.generate();
  const address = wallet.publicKey.toString();

  const userWallet = await prisma.wallet.create({
    data: {
      address,
      userId,
      balance: 0,
      privateKey: Buffer.from(wallet.secretKey).toString('hex'), // Store encrypted in production!
    },
  });

  return NextResponse.json({ address: userWallet.address });
}

async function importWallet(userId: number, encryptedPrivateKey: string) {
  const existingWallet = await prisma.wallet.findUnique({ where: { userId } });
  if (existingWallet) {
    return NextResponse.json({ error: 'Wallet already exists for this user' }, { status: 400 });
  }

  try {
    // In a real-world scenario, you would decrypt the private key here
    const privateKey = Buffer.from(encryptedPrivateKey, 'hex');
    const keypair = web3.Keypair.fromSecretKey(new Uint8Array(privateKey));
    const address = keypair.publicKey.toString();

    const balance = await connection.getBalance(keypair.publicKey);

    const userWallet = await prisma.wallet.create({
      data: {
        address,
        userId,
        balance: balance / web3.LAMPORTS_PER_SOL,
        privateKey: encryptedPrivateKey, // Store encrypted in production!
      },
    });

    return NextResponse.json({ address: userWallet.address, balance: userWallet.balance });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid private key' }, { status: 400 });
  }
}

async function sendTransaction(userId: number, amount: number, toAddress: string) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
  }

  const privateKey = Buffer.from(wallet.privateKey, 'hex');
  const fromKeypair = web3.Keypair.fromSecretKey(new Uint8Array(privateKey));
  const toPublicKey = new web3.PublicKey(toAddress);

  try {
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: amount * web3.LAMPORTS_PER_SOL,
      })
    );

    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeypair]
    );

    const newBalance = await connection.getBalance(fromKeypair.publicKey);

    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: newBalance / web3.LAMPORTS_PER_SOL },
    });

    const transactionRecord = await prisma.transaction.create({
      data: {
        amount: -amount,
        description: `Sent ${amount} SOL to ${toAddress}`,
        walletId: wallet.id,
      },
    });

    return NextResponse.json({ signature, wallet: updatedWallet, transaction: transactionRecord });
  } catch (error) {
    return NextResponse.json({ error: 'Transaction failed' }, { status: 500 });
  }
}

async function getBalance(userId: number) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
  }

  const publicKey = new web3.PublicKey(wallet.address);
  const balance = await connection.getBalance(publicKey);

  await prisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: balance / web3.LAMPORTS_PER_SOL },
  });

  return NextResponse.json({ balance: balance / web3.LAMPORTS_PER_SOL });
}

async function getTransactions(userId: number) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json({ transactions });
}

async function getWalletDetails(userId: number) {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: { transactions: { orderBy: { date: 'desc' }, take: 10 } },
  });

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
  }

  const publicKey = new web3.PublicKey(wallet.address);
  const balance = await connection.getBalance(publicKey);

  const updatedWallet = await prisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: balance / web3.LAMPORTS_PER_SOL },
  });

  return NextResponse.json({
    address: updatedWallet.address,
    balance: updatedWallet.balance,
    transactions: wallet.transactions,
  });
}

async function requestAirdrop(userId: number) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
  }

  const publicKey = new web3.PublicKey(wallet.address);
  
  try {
    const airdropSignature = await connection.requestAirdrop(
      publicKey,
      2 * web3.LAMPORTS_PER_SOL // Request 2 SOL
    );

    await connection.confirmTransaction(airdropSignature);

    const newBalance = await connection.getBalance(publicKey);

    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: newBalance / web3.LAMPORTS_PER_SOL },
    });

    const transaction = await prisma.transaction.create({
      data: {
        amount: 2,
        description: 'Received 2 SOL from Devnet airdrop',
        walletId: wallet.id,
      },
    });

    return NextResponse.json({ 
      message: 'Airdrop successful', 
      newBalance: updatedWallet.balance,
      transaction 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Airdrop failed' }, { status: 500 });
  }
}