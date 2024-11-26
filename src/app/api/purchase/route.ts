import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PublicKey } from '@solana/web3.js';
import { createClient } from 'redis';

const prisma = new PrismaClient();
let redis: any;

async function getRedisClient() {
  if (!redis) {
    redis = createClient({ url: process.env.REDIS_URL });
    await redis.connect();
  } else if (!redis.isOpen) {
    await redis.connect();
  }
  return redis;
}

export async function POST(req: Request) {
  try {
    // Get Redis client and ensure it's connected
    const redisClient = await getRedisClient();

    const { eventId, buyerPublicKey, quantity, transactionSignature } = await req.json();

    // Validate input
    if (!eventId || !buyerPublicKey || !quantity || quantity <= 0 || !transactionSignature) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }

    // Check if the event exists and has available seats
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { createdBy: { select: { wallet: true } } },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.availableSeats < quantity) {
      return NextResponse.json({ error: 'Not enough available seats for this event' }, { status: 400 });
    }

    // Validate buyer's public key
    try {
      new PublicKey(buyerPublicKey);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid buyer public key' }, { status: 400 });
    }

    // Store initial transaction data
    const transaction = await prisma.transaction.create({
      data: {
        amount: event.ticketPrice * quantity,
        description: `Purchase of ${quantity} tickets for event: ${event.title}`,
        walletId: event.createdBy.wallet[0].id,
        eventId: event.id,
        buyerPublicKey,
        status: 'pending',
        transactionSignature,
      },
    });

    // Store temporary data in Redis
    await redisClient.set(transaction.id.toString(), JSON.stringify({
      status: 'pending',
      transactionSignature,
      eventId,
      buyerPublicKey,
      quantity,
    }), { EX: 3600 }); // Expire after 1 hour

    return NextResponse.json({
      transactionId: transaction.id,
      amount: event.ticketPrice * quantity,
      message: 'Transaction initiated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error initiating purchase:', error);
    return NextResponse.json({ error: 'Failed to initiate purchase' }, { status: 500 });
  }
}


// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import { PublicKey } from '@solana/web3.js';
// import { createClient } from 'redis';

// const prisma = new PrismaClient();
// const redis = createClient({ url: process.env.REDIS_URL });

// export async function POST(req: Request) {
//   await redis.connect();

//   try {
//     const { eventId, buyerPublicKey, quantity, transactionSignature } = await req.json();

//     // Validate input and check event availability (omitted for brevity)

//         if (!eventId || !buyerPublicKey || !quantity || quantity <= 0 || !transactionSignature) {
//       return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
//     }

//     // Check if the event exists and has available seats
//     const event = await prisma.event.findUnique({
//       where: { id: eventId },
//       include: { createdBy: { select: { wallet: true } } },
//     });

//     if (!event) {
//       return NextResponse.json({ error: 'Event not found' }, { status: 404 });
//     }

//     if (event.availableSeats < quantity) {
//       return NextResponse.json({ error: 'Not enough available seats for this event' }, { status: 400 });
//     }

//     // Validate buyer's public key
//     try {
//       new PublicKey(buyerPublicKey);
//     } catch (error) {
//       return NextResponse.json({ error: 'Invalid buyer public key' }, { status: 400 });
//     }


//     const transaction = await prisma.transaction.create({
//       data: {
//         amount: event.ticketPrice * quantity,
//         description: `Purchase of ${quantity} tickets for event: ${event.title}`,
//         walletId: event.createdBy.wallet[0].id,
//         eventId: event.id,
//         buyerPublicKey,
//         status: 'pending',
//         transactionSignature,
//       },
//     });

//     await redis.set(transaction.id.toString(), JSON.stringify({
//       status: 'pending',
//       transactionSignature,
//       eventId,
//       buyerPublicKey,
//       quantity,
//     }), { EX: 3600 });

//     return NextResponse.json({
//       transactionId: transaction.id,
//       message: 'Transaction initiated successfully'
//     }, { status: 200 });
//   } catch (error) {
//     console.error('Error initiating purchase:', error);
//     return NextResponse.json({ error: 'Failed to initiate purchase' }, { status: 500 });
//   } finally {
//     await redis.disconnect();
//   }
// }