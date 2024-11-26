// import { Connection, Keypair, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
// import {
//   TOKEN_2022_PROGRAM_ID,
//   getAssociatedTokenAddress,
//   createAssociatedTokenAccountInstruction,
//   createMintToInstruction,
//   createTransferInstruction,
//   createInitializeMintInstruction,
//   getMintLen,
//   ExtensionType,
// } from '@solana/spl-token';
// import { createInitializeInstruction } from '@solana/spl-token-metadata';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function createAndTransferNFT(
//   eventId: number,
//   buyerPublicKey: PublicKey,
//   quantity: number
// ): Promise<string[]> {
//   const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

//   console.log(`Fetching event data for eventId: ${eventId}`);
//   const event = await prisma.event.findUnique({
//     where: { id: eventId },
//     include: { createdBy: { include: { wallet: true } } },
//   });

//   if (!event || !event.createdBy.wallet) {
//     throw new Error('Event or creator wallet not found.');
//   }

//   console.log(`Event found: ${event.title}, Creator's wallet found`);

//   const creatorPrivateKey = event.createdBy.wallet[0].privateKey;
//   const creatorKeypair = Keypair.fromSecretKey(Uint8Array.from(Buffer.from(creatorPrivateKey, 'hex')));
//   const creatorPublicKey = creatorKeypair.publicKey;

//   console.log(`Creator public key: ${creatorPublicKey.toBase58()}`);

//   const mintLen = getMintLen([ExtensionType.MetadataPointer]);
//   const mintRent = await connection.getMinimumBalanceForRentExemption(mintLen);

//   console.log(`Starting NFT creation for quantity: ${quantity}`);

//   const nftMintPublicKeys: string[] = [];

//   for (let i = 0; i < quantity; i++) {
//     const nftMintKeypair = Keypair.generate();
//     console.log(`NFT ${i + 1}: Mint keypair generated, Public Key: ${nftMintKeypair.publicKey.toBase58()}`);

//     const metadata = {
//       name: `Ticket ${i + 1} for ${event.title}`,
//       symbol: event.title.substring(0, 4).toUpperCase(),
//       uri: `https://yojan.vercel.app/metadata/${eventId}/${i + 1}`,
//     };

//     console.log(`NFT ${i + 1}: Metadata created with URI: ${metadata.uri}`);

//     const buyerTokenAccount = await getAssociatedTokenAddress(
//       nftMintKeypair.publicKey,
//       buyerPublicKey,
//       false,
//       TOKEN_2022_PROGRAM_ID
//     );

//     const creatorTokenAccount = await getAssociatedTokenAddress(
//       nftMintKeypair.publicKey,
//       creatorPublicKey,
//       false,
//       TOKEN_2022_PROGRAM_ID
//     );

//     const transaction = new Transaction().add(
//       SystemProgram.createAccount({
//         fromPubkey: creatorPublicKey,
//         newAccountPubkey: nftMintKeypair.publicKey,
//         space: mintLen,
//         lamports: mintRent,
//         programId: TOKEN_2022_PROGRAM_ID,
//       }),
//       createInitializeMintInstruction(
//         nftMintKeypair.publicKey,
//         0,
//         creatorPublicKey,
//         creatorPublicKey,
//         TOKEN_2022_PROGRAM_ID
//       ),
//       createAssociatedTokenAccountInstruction(
//         creatorPublicKey,
//         creatorTokenAccount,
//         creatorPublicKey,
//         nftMintKeypair.publicKey,
//         TOKEN_2022_PROGRAM_ID
//       ),
//       createMintToInstruction(
//         nftMintKeypair.publicKey,
//         creatorTokenAccount,
//         creatorPublicKey,
//         1,
//         [],
//         TOKEN_2022_PROGRAM_ID
//       ),
//       createInitializeInstruction({
//         programId: TOKEN_2022_PROGRAM_ID,
//         metadata: nftMintKeypair.publicKey,
//         updateAuthority: creatorPublicKey,
//         mint: nftMintKeypair.publicKey,
//         mintAuthority: creatorPublicKey,
//         name: metadata.name,
//         symbol: metadata.symbol,
//         uri: metadata.uri,
//       }),
//       createAssociatedTokenAccountInstruction(
//         creatorPublicKey,
//         buyerTokenAccount,
//         buyerPublicKey,
//         nftMintKeypair.publicKey,
//         TOKEN_2022_PROGRAM_ID
//       ),
//       createTransferInstruction(
//         creatorTokenAccount,
//         buyerTokenAccount,
//         creatorPublicKey,
//         1,
//         [],
//         TOKEN_2022_PROGRAM_ID
//       )
//     );

//     console.log(`NFT ${i + 1}: Transaction prepared`);

//     try {
//       const signature = await sendAndConfirmTransaction(connection, transaction, [creatorKeypair, nftMintKeypair]);
//       console.log(`NFT ${i + 1}: Transaction confirmed with signature: ${signature}`);

//       nftMintPublicKeys.push(nftMintKeypair.publicKey.toBase58());
//     } catch (error) {
//       console.error(`Error creating NFT ${i + 1}:`, error);
//       throw error;
//     }
//   }

//   console.log('NFT creation and transfer completed.');
//   return nftMintPublicKeys;
// }

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
} from '@solana/web3.js';
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createTransferInstruction,
  createInitializeMintInstruction,
  getMintLen,
  ExtensionType,
} from '@solana/spl-token';
import { createInitializeInstruction } from '@solana/spl-token-metadata';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createAndTransferNFT(
  eventId: number,
  buyerPublicKey: PublicKey,
  quantity: number
): Promise<{ nftMintPublicKeys: string[] }> {
  try {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

    console.log(`Fetching event data for eventId: ${eventId}`);
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { createdBy: { include: { wallet: true } } },
    });

    if (!event || !event.createdBy.wallet) {
      throw new Error('Event or creator wallet not found.');
    }

    console.log(`Event found: ${event.title}, Creator's wallet found`);

    const creatorPrivateKey = event.createdBy.wallet[0].privateKey;
    const creatorKeypair = Keypair.fromSecretKey(Uint8Array.from(Buffer.from(creatorPrivateKey, 'hex')));
    const creatorPublicKey = creatorKeypair.publicKey;

    console.log(`Creator public key: ${creatorPublicKey.toBase58()}`);

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const mintRent = await connection.getMinimumBalanceForRentExemption(mintLen);

    console.log(`Starting NFT creation for quantity: ${quantity}`);

    const nftMintPublicKeys: string[] = []; // Array to store mint public keys

    for (let i = 0; i < quantity; i++) {
      console.log(`Preparing NFT ${i + 1} creation`);

      const nftMintKeypair = Keypair.generate();
      console.log(`NFT ${i + 1}: Mint keypair generated, Public Key: ${nftMintKeypair.publicKey.toBase58()}`);

      const metadata = {
        name: `Ticket ${i + 1} for ${event.title}`,
        symbol: event.title.substring(0, 4).toUpperCase(),
        uri: `https://yojan.vercel.app/metadata/${eventId}/${i + 1}`,
      };

      console.log(`NFT ${i + 1}: Metadata created with URI: ${metadata.uri}`);

      const buyerTokenAccount = await getAssociatedTokenAddress(
        nftMintKeypair.publicKey,
        buyerPublicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      console.log(`NFT ${i + 1}: Buyer token account: ${buyerTokenAccount.toBase58()}`);

      const creatorTokenAccount = await getAssociatedTokenAddress(
        nftMintKeypair.publicKey,
        creatorPublicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      console.log(`NFT ${i + 1}: Creator token account: ${creatorTokenAccount.toBase58()}`);

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: creatorPublicKey,
          newAccountPubkey: nftMintKeypair.publicKey,
          space: mintLen,
          lamports: mintRent,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          nftMintKeypair.publicKey,
          0,
          creatorPublicKey,
          creatorPublicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createAssociatedTokenAccountInstruction(
          creatorPublicKey,
          creatorTokenAccount,
          creatorPublicKey,
          nftMintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createMintToInstruction(
          nftMintKeypair.publicKey,
          creatorTokenAccount,
          creatorPublicKey,
          1,
          [],
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          metadata: nftMintKeypair.publicKey,
          updateAuthority: creatorPublicKey,
          mint: nftMintKeypair.publicKey,
          mintAuthority: creatorPublicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
        }),
        createAssociatedTokenAccountInstruction(
          creatorPublicKey,
          buyerTokenAccount,
          buyerPublicKey,
          nftMintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createTransferInstruction(
          creatorTokenAccount,
          buyerTokenAccount,
          creatorPublicKey,
          1,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      console.log(`NFT ${i + 1}: Transaction prepared but not signed or sent`);

      nftMintPublicKeys.push(nftMintKeypair.publicKey.toBase58()); // Store the mint public key
    }

    console.log('NFT creation preparation completed.');
    return { nftMintPublicKeys }; // Return the generated mint public keys
  } catch (error) {
    console.error('Error during NFT creation:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
