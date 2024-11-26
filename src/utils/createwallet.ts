import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as web3 from '@solana/web3.js';

const prisma = new PrismaClient();

export async function createWallet(userId: number) {
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
  
      return userWallet.address;
    } catch (error) {
      console.error('Error creating wallet:', error);
      return NextResponse.json({ error: 'Failed to create wallet' }, { status: 500 });
    }
  }
  