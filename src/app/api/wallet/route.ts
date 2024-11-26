import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import * as web3 from '@solana/web3.js';
import { z } from 'zod';

const prisma = new PrismaClient();
const connection = new web3.Connection(web3.clusterApiUrl('devnet'));

const CreateWalletSchema = z.object({
  action: z.literal('create'),
  userId: z.number().int().positive(),
});

const ImportWalletSchema = z.object({
  action: z.literal('import'),
  userId: z.number().int().positive(),
  encryptedPrivateKey: z.string(),
});

const SendTransactionSchema = z.object({
  action: z.literal('send'),
  userId: z.number().int().positive(),
  amount: z.number().positive(),
  toAddress: z.string(),
});

const GetBalanceSchema = z.object({
  action: z.literal('getBalance'),
  userId: z.number().int().positive(),
});

const GetTransactionsSchema = z.object({
  action: z.literal('getTransactions'),
  userId: z.number().int().positive(),
});

const GetWalletDetailsSchema = z.object({
  action: z.literal('getWalletDetails'),
  userId: z.number().int().positive(),
});

const RequestAirdropSchema = z.object({
  action: z.literal('requestAirdrop'),
  userId: z.number().int().positive(),
});

const ActionSchema = z.discriminatedUnion('action', [
  CreateWalletSchema,
  ImportWalletSchema,
  SendTransactionSchema,
  GetBalanceSchema,
  GetTransactionsSchema,
  GetWalletDetailsSchema,
  RequestAirdropSchema,
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = ActionSchema.parse(body);

    switch (validatedBody.action) {
      case 'create':
        return await createWallet(validatedBody.userId);
      case 'import':
        return await importWallet(validatedBody.userId, validatedBody.encryptedPrivateKey);
      case 'send':
        return await sendTransaction(validatedBody.userId, validatedBody.amount, validatedBody.toAddress);
      case 'getBalance':
        return await getBalance(validatedBody.userId);
      case 'getTransactions':
        return await getTransactions(validatedBody.userId);
      case 'getWalletDetails':
        return await getWalletDetails(validatedBody.userId);
      case 'requestAirdrop':
        return await requestAirdrop(validatedBody.userId);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

const UpdatePaymentAddressSchema = z.object({
  userId: z.number().int().positive(),
  newPaymentAddress: z.string(),
});

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { userId, newPaymentAddress } = UpdatePaymentAddressSchema.parse(body);
    return updatePaymentAddressForUserEvents(userId, newPaymentAddress);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

async function createWallet(userId: number) {
  const existingWallet = await prisma.wallet.findFirst({ where: { userId } });
  if (existingWallet) {
    return NextResponse.json({ error: 'Wallet already exists for this user' }, { status: 400 });
  }

  const wallet = web3.Keypair.generate();
  const address = wallet.publicKey.toString();

  try {
    const userWallet = await prisma.wallet.create({
      data: {
        address,
        userId,
        balance: 0,
        privateKey: Buffer.from(wallet.secretKey).toString('hex'),
      },
    });

    await updatePaymentAddressForUserEvents(userId, address);

    return NextResponse.json({ address: userWallet.address, balance: userWallet.balance });
  } catch (error) {
    console.error('Error creating wallet:', error);
    return NextResponse.json({ error: 'Failed to create wallet' }, { status: 500 });
  }
}

async function importWallet(userId: number, encryptedPrivateKey: string) {
  const existingWallet = await prisma.wallet.findFirst({ where: { userId } });
  if (existingWallet) {
    return NextResponse.json({ error: 'Wallet already exists for this user' }, { status: 400 });
  }

  try {
    const decodedPrivateKey = Uint8Array.from(JSON.parse(encryptedPrivateKey));
    const keypair = web3.Keypair.fromSecretKey(decodedPrivateKey);
    const address = keypair.publicKey.toString();

    const balance = await connection.getBalance(keypair.publicKey);

    const userWallet = await prisma.wallet.create({
      data: {
        address,
        userId,
        balance: balance / web3.LAMPORTS_PER_SOL,
        privateKey: Buffer.from(keypair.secretKey).toString('hex'),
      },
    });

    await updatePaymentAddressForUserEvents(userId, address);

    return NextResponse.json({ address: userWallet.address, balance: userWallet.balance });
  } catch (error) {
    console.error('Error importing wallet:', error);
    return NextResponse.json({ error: 'Invalid private key or import failed' }, { status: 400 });
  }
}

async function updatePaymentAddressForUserEvents(userId: number, newPaymentAddress: string) {
  try {
    const updatedEvents = await prisma.event.updateMany({
      where: {
        createdById: userId,
        isPublic: true,
      },
      data: { paymentAddress: newPaymentAddress },
    });

    console.log(`Updated ${updatedEvents.count} events with new payment address`);
  } catch (error) {
    console.error('Error updating payment address for events:', error);
  }
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
    privateKey: updatedWallet.privateKey || "Private key not available",
  });
}

async function sendTransaction(userId: number, amount: number, toAddress: string) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
  }

  const privateKey = Buffer.from(wallet.privateKey || '', 'hex');
  const fromKeypair = web3.Keypair.fromSecretKey(new Uint8Array(privateKey));
  const toPublicKey = new web3.PublicKey(toAddress);

  try {
    const balance = await connection.getBalance(fromKeypair.publicKey);

    if (balance < amount * web3.LAMPORTS_PER_SOL) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: amount * web3.LAMPORTS_PER_SOL,
      })
    );

    const signature = await web3.sendAndConfirmTransaction(connection, transaction, [fromKeypair]);

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
    console.error('Transaction error:', error);
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