// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import { Connection, PublicKey } from '@solana/web3.js';
// import { createAndTransferNFT } from '@/utils/serverNFT';

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   try {
//     console.log('Incoming request to process payment...');

//     const {transactionId,transactionSignature } = await req.json();
//     console.log('Parsed request body:', { transactionId, transactionSignature });

//     if (!transactionSignature) {
//       console.error('Missing transactionSignature');
//       return NextResponse.json({ error: 'Missing transaction signature' }, { status: 400 });
//     }

//     // Set up the connection to the Solana blockchain
//     const res = await prisma.transaction.findUnique({
//       where: { id: transactionId },
//     });


//   //   const res: {
//   //     id: number;
//   //     amount: number;
//   //     description: string;
//   //     date: Date;
//   //     walletId: number;
//   //     eventId: number | null;
//   //     buyerPublicKey: string;
//   //     status: string;
//   //     transactionSignature: string | null;
//   // } | null

//     console.log('Parsed request body:', { res.eventId, buyerPublicKey, quantity, transactionSignature });

//     if (!transactionSignature) {
//       console.error('Missing transactionSignature');
//       return NextResponse.json({ error: 'Missing transaction signature' }, { status: 400 });
//     }

//     // Set up the connection to the Solana blockchain
//     const connection = new Connection(process.env.SOLANA_RPC_URL as string);
//     console.log('Established connection to Solana RPC:', process.env.SOLANA_RPC_URL);

//     // Check the transaction signature status first
//     console.log('Checking transaction signature status...');
//     const signatureStatus = await connection.getSignatureStatus(transactionSignature, { searchTransactionHistory: true });
    
//     if (!signatureStatus || !signatureStatus.value || !signatureStatus.value.confirmationStatus) {
//       console.error('Transaction not found or not confirmed:', transactionSignature);
//       return NextResponse.json({ error: 'Transaction not confirmed or not found' }, { status: 400 });
//     }

//     console.log('Transaction signature status:', signatureStatus.value);

//     // Ensure the transaction is finalized
//     if (signatureStatus.value.confirmationStatus !== 'finalized') {
//       console.error('Transaction not finalized:', transactionSignature);
//       return NextResponse.json({ error: 'Transaction not finalized' }, { status: 400 });
//     }

//     // Fetch the confirmed transaction
//     console.log('Fetching confirmed transaction...');
//     const tx = await connection.getTransaction(transactionSignature, { maxSupportedTransactionVersion: 0 });

//     if (!tx || !tx.meta) {
//       console.error('Invalid or unconfirmed transaction:', transactionSignature);
//       return NextResponse.json({ error: 'Invalid or unconfirmed transaction' }, { status: 400 });
//     }
//     console.log('Transaction fetched successfully:', tx);

//     // Fetch event details and proceed with your existing logic
//     console.log('Fetching event details from the database for eventId:', eventId);
//     const event = await prisma.event.findUnique({
//       where: { id: eventId },
//       include: { createdBy: { include: { wallet: true } } },
//     });

//     if (!event) {
//       console.error('Event not found for eventId:', eventId);
//       return NextResponse.json({ error: 'Event not found' }, { status: 404 });
//     }
//     console.log('Event details fetched successfully:', event);


//       // Calculate the expected amount in lamports
//       const expectedAmount = event.ticketPrice * quantity * 1e9; // Convert SOL to lamports

//       // Verify the amount paid by comparing preBalances and postBalances
//       const payerIndex = tx.transaction.message.accountKeys.findIndex(
//         (account) => account.toBase58() === buyerPublicKey
//       );
  
//       if (payerIndex === -1 || !tx.meta.preBalances || !tx.meta.postBalances) {
//         return NextResponse.json({ error: 'Transaction account data missing' }, { status: 400 });
//       }
  
//       const preBalance = tx.meta.preBalances[payerIndex];
//       const postBalance = tx.meta.postBalances[payerIndex];
//       const actualAmount = preBalance - postBalance;
  
//       if (actualAmount < expectedAmount) {
//         return NextResponse.json({ error: 'Insufficient payment amount' }, { status: 400 });
//       }
  
//       // Create and transfer NFTs for the buyer
//       const nftMintAddresses = await createAndTransferNFT(
//         connection,
//         eventId,
//         new PublicKey(buyerPublicKey),
//         quantity
//       );
  
//       // Update the available seats for the event
//       await prisma.event.update({
//         where: { id: eventId },
//         data: {
//           availableSeats: {
//             decrement: quantity, // Reduce available seats by the quantity purchased
//           },
//         },
//       });
  
//       // Create NFT ticket records in the database
//       const nftTickets = await Promise.all(
//         nftMintAddresses.map((mintAddress, index) =>
//           prisma.nFTTicket.create({
//             data: {
//               mintAddress,
//               eventId,
//               ownerPublicKey: buyerPublicKey,
//               ownerEmail: '', // Optional: you can collect email during purchase
//               metadata: JSON.stringify({
//                 name: `Ticket ${index + 1} for ${event.title}`,
//                 description: `Admission to ${event.title} on ${event.date.toISOString()}`,
//               }),
//             },
//           })
//         )
//       );
  
//       // Record the transaction in the Prisma database
//       await prisma.transaction.create({
//         data: {
//           amount: event.ticketPrice * quantity, // Record the amount in SOL (not lamports)
//           description: `Purchase of ${quantity} tickets for event: ${event.title}`,
//           walletId: event.createdBy.wallet[0].id,
//           eventId: event.id,
//           transactionId: transactionSignature,
//           buyerPublicKey,
//           buyerTokenAccount: nftMintAddresses[0], // Record the first NFT mint address
//         },
//       });
  
//       return NextResponse.json(
//         {
//           message: 'Purchase successful',
//           nftMintAddresses,
//           nftTickets,
//         },
//         { status: 200 }
//       );

//   } catch (error) {
//     console.error('Error in payment API:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js';
// import { createClient } from 'redis';
// import { createAndTransferNFT } from '@/utils/serverNFT';

// const prisma = new PrismaClient();
// const redis = createClient({ url: process.env.REDIS_URL });

// export async function POST(req: Request) {
//   await redis.connect();

//   try {
//     const { transactionId, transactionSignature } = await req.json();

//     if (!transactionId || !transactionSignature) {
//       return NextResponse.json({ error: 'Missing transaction details' }, { status: 400 });
//     }

//     // Fetch transaction data from Redis
//     const transactionDataString = await redis.get(transactionId.toString());
//     if (!transactionDataString) {
//       return NextResponse.json({ error: 'Transaction data not found' }, { status: 404 });
//     }

//     const transactionData = JSON.parse(transactionDataString);
//     const { eventId, buyerPublicKey, quantity } = transactionData;

//     // Verify transaction status on Solana
//     const connection = new Connection(process.env.SOLANA_RPC_URL as string, 'finalized');

//     try {
//       const signatureStatus = await connection.getSignatureStatus(transactionSignature as TransactionSignature);

//       console.log('Signature status:', JSON.stringify(signatureStatus, null, 2));

//       if (!signatureStatus || !signatureStatus.value) {
//         throw new Error('Invalid signature status returned from Solana');
//       }

//       if (signatureStatus.value.err) {
//         throw new Error(`Transaction failed on Solana: ${JSON.stringify(signatureStatus.value.err)}`);
//       }

//       if (signatureStatus.value.confirmationStatus !== 'finalized') {
//         return NextResponse.json({ status: 'pending', message: 'Transaction not yet finalized on Solana' }, { status: 202 });
//       }
//     } catch (error) {
//       console.error('Error verifying transaction on Solana:', error);
//       return NextResponse.json({
//         error: 'Failed to verify transaction on Solana',
//         details: error.message
//       }, { status: 400 });
//     }

//     // Create and transfer NFTs
//     let nftMintAddresses;
//     try {
//       nftMintAddresses = await createAndTransferNFT(
//         connection,
//         eventId,
//         new PublicKey(buyerPublicKey),
//         quantity
//       );
//     } catch (error) {
//       console.error('Error creating and transferring NFT:', error);
//       return NextResponse.json({
//         error: 'Failed to create and transfer NFT',
//         details: error.message
//       }, { status: 500 });
//     }

//     // Update event seat count and transaction in the database
//     try {
//       await prisma.$transaction([
//         prisma.event.update({
//           where: { id: eventId },
//           data: { availableSeats: { decrement: quantity } },
//         }),
//         prisma.transaction.update({
//           where: { id: Number(transactionId) },
//           data: {
//             status: 'completed',
//             nftMintAddresses,
//           },
//         }),
//       ]);
//     } catch (error) {
//       console.error('Error updating database:', error);
//       return NextResponse.json({
//         error: 'Failed to update database',
//         details: error.message
//       }, { status: 500 });
//     }

//     // Update Redis transaction status
//     await redis.set(transactionId, JSON.stringify({
//       ...transactionData,
//       status: 'completed',
//       nftMintAddresses,
//     }), { EX: 3600 });

//     return NextResponse.json({
//       status: 'completed',
//       nftMintAddresses,
//       message: 'Payment processed successfully'
//     }, { status: 200 });
//   } catch (error) {
//     console.error('Error processing payment:', error);
//     await redis.set(transactionId, JSON.stringify({
//       status: 'failed',
//       error: error.message,
//     }), { EX: 3600 });
//     return NextResponse.json({
//       error: 'Failed to process payment',
//       details: error.message
//     }, { status: 500 });
//   } finally {
//     await redis.disconnect();
//   }
// }

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Connection, PublicKey } from '@solana/web3.js';
import { createAndTransferNFT } from '@/utils/serverNFT';
import { createClient } from 'redis';

const prisma = new PrismaClient();
const redis = createClient({ url: process.env.REDIS_URL });

export async function POST(req: Request) {
  if (!redis.isOpen) {
    await redis.connect();
  }

  try {
    console.log('Incoming request to process purchase...');

    const { transactionId, transactionSignature, quantity } = await req.json();
    console.log('Parsed request body:', { transactionId, transactionSignature, quantity });

    if (!transactionId || !transactionSignature) {
      console.error('Missing transaction details');
      return NextResponse.json({ error: 'Missing transaction details' }, { status: 400 });
    }

    // Fetch the transaction data from Redis
    const transactionDataString = await redis.get(transactionId.toString());
    console.log('Transaction Data from Redis:', transactionDataString);

    if (!transactionDataString) {
      console.error('Transaction not found in Redis');
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const transactionData = JSON.parse(transactionDataString);

    // Check if the transaction is already marked as completed
    if (transactionData.status === 'completed') {
      console.log('Transaction already completed');
      return NextResponse.json(transactionData, { status: 200 });
    }

    // Fetch transaction from Prisma
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      console.error('Transaction not found in database');
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const { amount, eventId, buyerPublicKey } = transaction;

    console.log('Fetched transaction details:', { eventId, buyerPublicKey, transactionSignature });

    // Establish Solana connection
    const connection = new Connection(process.env.SOLANA_RPC_URL as string);
    console.log('Established connection to Solana RPC:', process.env.SOLANA_RPC_URL);

    // Fetch the confirmed transaction
    console.log('Fetching confirmed transaction...');
    const tx = await connection.getTransaction(transactionSignature, { maxSupportedTransactionVersion: 0 });

    if (!tx || !tx.meta) {
      console.error('Invalid or unconfirmed transaction:', transactionSignature);
      return NextResponse.json({ error: 'Invalid or unconfirmed transaction' }, { status: 400 });
    }
    console.log('Transaction fetched successfully:', tx);

    // Verify the amount paid
    const expectedAmount = amount;
    const payerIndex = tx.transaction.message.accountKeys.findIndex(
      (account) => account.toBase58() === buyerPublicKey
    );

    if (payerIndex === -1 || !tx.meta.preBalances || !tx.meta.postBalances) {
      return NextResponse.json({ error: 'Transaction account data missing' }, { status: 400 });
    }

    const preBalance = tx.meta.preBalances[payerIndex];
    const postBalance = tx.meta.postBalances[payerIndex];
    const actualAmount = preBalance - postBalance;

    if (actualAmount < expectedAmount) {
      return NextResponse.json({ error: 'Insufficient payment amount' }, { status: 400 });
    }

    // Create and transfer NFTs for the buyer
    const  { nftMintPublicKeys } = await createAndTransferNFT(
      eventId as number,
      new PublicKey(buyerPublicKey),
      quantity || 1
    );

    // Update the available seats for the event
    await prisma.event.update({
      where: { id: eventId || 1 },
      data: {
        availableSeats: {
          decrement: quantity || 1,
        },
      },
    });

    // Create NFT ticket records in the database
    const nftTickets = await Promise.all(
      nftMintPublicKeys.map((mintAddress, index) =>
        prisma.nFTTicket.create({
          data: {
            mintAddress,
            eventId: eventId || 1,
            ownerPublicKey: buyerPublicKey,
            ownerEmail: '',
            metadata: JSON.stringify({
              name: `Ticket ${index + 1} for Event`,
              description: `Admission to Event on ${new Date().toISOString()}`,
            }),
          },
        })
      )
    );

    // Update the transaction in the Prisma database
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'completed',
        transactionSignature,
        buyerPublicKey: nftMintPublicKeys[0],
      },
    });

    // Update Redis with the completed status
    const completedTransactionData = {
      status: 'completed',
      message: 'Transaction finalized and payment processed successfully',
      nftMintPublicKeys,
      nftTickets,
    };

    if(!redis.isOpen) {
      await redis.connect();
    }

    await redis.set(transactionId.toString(), JSON.stringify(completedTransactionData), { EX: 3600 });

    console.log('Purchase processed successfully');
    return NextResponse.json(completedTransactionData, { status: 200 });

  } catch (error) {
    console.error('Error in purchase API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await redis.disconnect();
  }
}
