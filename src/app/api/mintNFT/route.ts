import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createEventToken } from '@/utils/nftMint';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { eventId, totalSupply } = await req.json();

    console.log(`Received request to create token for event ${eventId} with total supply ${totalSupply}`);

    // Fetch event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { 
        createdBy: { 
          include: { 
            wallet: true 
          } 
        } 
      },
    });

    if (!event) {
      console.error(`Event with id ${eventId} not found`);
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (!event.createdBy.wallet || event.createdBy.wallet.length === 0) {
      console.error(`Wallet not found for event creator (User ID: ${event.createdBy.id})`);
      return NextResponse.json({ error: 'Creator wallet not found' }, { status: 404 });
    }

    const creatorWallet = event.createdBy.wallet[0]; // Get the first wallet

    if (!creatorWallet.privateKey) {
      console.error(`Private key not found in wallet (Wallet ID: ${creatorWallet.id})`);
      return NextResponse.json({ error: 'Creator wallet private key not found' }, { status: 400 });
    }

    console.log('Event and wallet details fetched successfully');

    // Create the event token
    const tokenMintAddress = await createEventToken({
      eventId: event.id,
      totalSupply,
      creatorAddress: creatorWallet.privateKey,
    });

    console.log(`Event token created successfully. Mint address: ${tokenMintAddress}`);

    // Update the event with the token mint address
    await prisma.event.update({
      where: { id: eventId },
      data: {
        paymentAddress: tokenMintAddress,
        availableSeats: totalSupply,
      },
    });


    console.log('Event updated with token mint address and available seats');

    return NextResponse.json({ tokenMintAddress }, { status: 201 });
  } catch (error) {
    console.error('Error creating event token:', error);
    return NextResponse.json({ error: 'Failed to create event token', details: error.message }, { status: 500 });
  }
}