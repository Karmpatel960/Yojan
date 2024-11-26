import { Keypair, SystemProgram, Transaction, PublicKey, Connection } from "@solana/web3.js";
import * as web3 from '@solana/web3.js';
import { 
  TOKEN_2022_PROGRAM_ID, 
  getMintLen, 
  createInitializeMetadataPointerInstruction, 
  createInitializeMintInstruction, 
  ExtensionType, 
  createMintToInstruction, 
  createAssociatedTokenAccountInstruction, 
  getAssociatedTokenAddressSync ,
  createTransferInstruction
} from "@solana/spl-token";
import { 
  createInitializeInstruction, 
  pack,
  TokenMetadata
} from '@solana/spl-token-metadata';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Replace this with your actual RPC URL
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';

export async function createEventToken({
  eventId,
  totalSupply,
  creatorAddress,
}: {
  eventId: number;
  totalSupply: number;
  creatorAddress: string;
}) {
  const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

  try {
    // Fetch event and wallet details from the database
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        createdBy: {
          include: { wallet: true }
        }
      }
    });

    if (!event || !event.createdBy.wallet) {
      throw new Error('Event or creator wallet not found.');
    }

    // Check if private key is valid
    const privateKey = event.createdBy.wallet.privateKey || creatorAddress;
    if (!privateKey || privateKey.length !== 128) {
      throw new Error('Invalid or missing private key.');
    }

    // Generate Keypair for the payer
    const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(Buffer.from(privateKey, 'hex')));
    console.log('Payer Public Key:', payerKeypair.publicKey.toBase58());

    // Generate a new Keypair for the mint account
    const mintKeypair = Keypair.generate();
    console.log('Mint Public Key:', mintKeypair.publicKey.toBase58());

    // Generate token metadata
    const metadata: TokenMetadata = {
      name: `${event.title} Token`,
      symbol: event.title.substring(0, 4).toUpperCase(),
      uri: `https://example.com/metadata/${eventId}`, // Replace with actual metadata URI
      updateAuthority: payerKeypair.publicKey,
      mint: mintKeypair.publicKey,
      additionalMetadata: []
    };

    // Calculate rent exemption
    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    console.log('Mint Length:', mintLen);
    const metadataLen = pack(metadata).length;
    console.log('Metadata Length:', metadataLen);
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen + 100);
    console.log('Rent Exemption:', lamports);

    // Create and send the transaction for the mint
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payerKeypair.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMetadataPointerInstruction(
        mintKeypair.publicKey,
        payerKeypair.publicKey,
        payerKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9,
        payerKeypair.publicKey,
        payerKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        metadata: mintKeypair.publicKey,
        updateAuthority: payerKeypair.publicKey,
        mint: mintKeypair.publicKey,
        mintAuthority: payerKeypair.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
      })
    );

    transaction.feePayer = payerKeypair.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const txSignature = await web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair, mintKeypair]);
    console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}, transaction: ${txSignature}`);

    const associatedToken = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      payerKeypair.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    console.log(`Associated Token Account: ${associatedToken.toBase58()}`);

    const transaction2 = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        payerKeypair.publicKey,
        associatedToken,
        payerKeypair.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );

    const tx2Signature = await web3.sendAndConfirmTransaction(connection, transaction2, [payerKeypair]);
    console.log(`Associated Token Account created, transaction: ${tx2Signature}`);

    const transaction3 = new Transaction().add(
      createMintToInstruction(
        mintKeypair.publicKey,
        associatedToken,
        payerKeypair.publicKey,
        BigInt(totalSupply * Math.pow(10, 9)),
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );

    const tx3Signature = await web3.sendAndConfirmTransaction(connection, transaction3, [payerKeypair]);
    console.log(`Tokens minted to Associated Token Account, transaction: ${tx3Signature}`);

    await prisma.event.update({
      where: { id: eventId },
      data: {
        paymentAddress: mintKeypair.publicKey.toBase58(),
        availableSeats: totalSupply,
      },
    });

    return mintKeypair.publicKey.toBase58();
  } catch (error) {
    console.error('Error creating event token:', error);
    throw new Error('Failed to create event token');
  }
}


// export async function buyEventToken({
//   eventId,
//   buyerPublicKey,
//   quantity,
// }: {
//   eventId: number;
//   buyerPublicKey: string;
//   quantity: number;
// }) {
//   const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
//   console.log(`Buying ${quantity} tickets for event ${eventId}`);

//   try {
//     const event = await prisma.event.findUnique({
//       where: { id: eventId },
//       include: {
//         createdBy: { include: { wallet: true } },
//       },
//     });

//     if (!event || !event.createdBy.wallet || !event.paymentAddress) {
//       throw new Error('Event, event creator wallet, or payment address not found');
//     }

//     const creatorKeypair = Keypair.fromSecretKey(
//       Uint8Array.from(Buffer.from(event.createdBy.wallet.privateKey, 'hex'))
//     );

//     const mint = new PublicKey(event.paymentAddress);

//     // Get or create the buyer's token account
//     const buyerTokenAccount = getAssociatedTokenAddressSync(
//       mint,
//       new PublicKey(buyerPublicKey),
//       false,
//       TOKEN_2022_PROGRAM_ID
//     );

//     console.log(`Buyer Token Account: ${buyerTokenAccount.toBase58()}`);

//     // Create a transaction to create the buyer's token account if it doesn't exist
//     const transaction = new Transaction().add(
//       createAssociatedTokenAccountInstruction(
//         creatorKeypair.publicKey,
//         buyerTokenAccount,
//         new PublicKey(buyerPublicKey),
//         mint,
//         TOKEN_2022_PROGRAM_ID
//       )
//     );

//     console.log('Buyer token account created');

//     // Add instruction to transfer tokens from the creator to the buyer
//     transaction.add(
//       createTransferInstruction(
//         getAssociatedTokenAddressSync(mint, creatorKeypair.publicKey, false, TOKEN_2022_PROGRAM_ID),
//         buyerTokenAccount,
//         creatorKeypair.publicKey,
//         BigInt(quantity * Math.pow(10, 9)), // Multiply by 10^9 for 9 decimal places
//         [],
//         TOKEN_2022_PROGRAM_ID
//       )
//     );

//     console.log('Tokens transferred to buyer');

//     // Send and confirm the transaction
//     const transferSignature = await web3.sendAndConfirmTransaction(connection, transaction, [creatorKeypair]);
//     console.log(`Tokens transferred to buyer, transaction: ${transferSignature}`);

//     // Update the event's available seats
//     await prisma.event.update({
//       where: { id: eventId },
//       data: {
//         availableSeats: {
//           decrement: quantity
//         }
//       }
//     });

//     console.log('Event seats updated');

//     // Create a transaction record
//     await prisma.transaction.create({
//       data: {
//         amount: event.ticketPrice * quantity,
//         description: `Purchase of ${quantity} tickets for event: ${event.title}`,
//         walletId: event.createdBy.wallet.id,
//         eventId: event.id,
//       },
//     });

//     console.log('Transaction record created');


//     // Create NFT tickets
//     const nftTickets = await Promise.all(Array(quantity).fill(null).map(async (_, index) => {
//       // Generate a new Keypair for each NFT ticket
//       const nftMintKeypair = Keypair.generate();

//       // Calculate rent for the NFT mint account
//       const mintLen = getMintLen([ExtensionType.MetadataPointer]);
//       const mintRent = await connection.getMinimumBalanceForRentExemption(mintLen);

//       // Generate token metadata for the NFT
//       const metadata: TokenMetadata = {
//         name: `Ticket ${index + 1} for ${event.title}`,
//         symbol: event.title.substring(0, 4).toUpperCase(),
//         uri: `https://yojan.vercel.app/metadata/${eventId}/${index + 1}`, // Replace with actual metadata URI
//         updateAuthority: creatorKeypair.publicKey,
//         mint: nftMintKeypair.publicKey,
//         additionalMetadata: []
//       };

//       const metadataLen = pack(metadata).length;
//       const metadataRent = await connection.getMinimumBalanceForRentExemption(metadataLen);

//       // Create a transaction for minting the NFT
//       const nftTransaction = new Transaction().add(
//         web3.SystemProgram.createAccount({
//           fromPubkey: creatorKeypair.publicKey,
//           newAccountPubkey: nftMintKeypair.publicKey,
//           space: mintLen,
//           lamports: mintRent,
//           programId: TOKEN_2022_PROGRAM_ID,
//         }),
//         createInitializeMetadataPointerInstruction(
//           nftMintKeypair.publicKey,
//           creatorKeypair.publicKey,
//           creatorKeypair.publicKey,
//           TOKEN_2022_PROGRAM_ID
//         ),
//         createInitializeMintInstruction(
//           nftMintKeypair.publicKey,
//           0, // 0 decimals for NFT
//           creatorKeypair.publicKey,
//           creatorKeypair.publicKey,
//           TOKEN_2022_PROGRAM_ID
//         ),
//         createInitializeInstruction({
//           programId: TOKEN_2022_PROGRAM_ID,
//           metadata: nftMintKeypair.publicKey,
//           updateAuthority: creatorKeypair.publicKey,
//           mint: nftMintKeypair.publicKey,
//           mintAuthority: creatorKeypair.publicKey,
//           name: metadata.name,
//           symbol: metadata.symbol,
//           uri: metadata.uri,
//         })
//       );

//       // Add instruction to mint 1 NFT to the buyer
//       const buyerNftAccount = getAssociatedTokenAddressSync(
//         nftMintKeypair.publicKey,
//         new PublicKey(buyerPublicKey),
//         false,
//         TOKEN_2022_PROGRAM_ID
//       );

//       nftTransaction.add(
//         createAssociatedTokenAccountInstruction(
//           creatorKeypair.publicKey,
//           buyerNftAccount,
//           new PublicKey(buyerPublicKey),
//           nftMintKeypair.publicKey,
//           TOKEN_2022_PROGRAM_ID
//         ),
//         createMintToInstruction(
//           nftMintKeypair.publicKey,
//           buyerNftAccount,
//           creatorKeypair.publicKey,
//           1, // Mint 1 NFT
//           [],
//           TOKEN_2022_PROGRAM_ID
//         )
//       );

//       console.log(`Minting NFT ticket ${index + 1} for ${event.title}`);

//       // Send and confirm the NFT minting transaction
//       const nftSignature = await web3.sendAndConfirmTransaction(connection, nftTransaction, [creatorKeypair, nftMintKeypair]);
//       console.log(`NFT ticket minted, transaction: ${nftSignature}`);

//       // Create NFT ticket record in database
//       return prisma.nFTTicket.create({
//         data: {
//           mintAddress: nftMintKeypair.publicKey.toBase58(),
//           eventId: event.id,
//           ownerPublicKey: buyerPublicKey,
//           ownerEmail: '', // You might want to collect this information
//           metadata: JSON.stringify({
//             name: `Ticket ${index + 1} for ${event.title}`,
//             description: `Admission to ${event.title} on ${event.date.toISOString()}`,
//             // Add more metadata as needed
//           }),
//         },
//       });
//     }));

//     return {
//       tokenAccount: buyerTokenAccount.toBase58(),
//       nftTickets: nftTickets.map(ticket => ticket.mintAddress),
//     };
//   } catch (error) {
//     console.error('Error buying event token:', error);
//     throw new Error('Failed to buy event token');
//   }
// }
