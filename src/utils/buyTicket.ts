'use client';

import { PublicKey, Transaction, SystemProgram,Keypair } from '@solana/web3.js';
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createInitializeInstruction,
  createMintToInstruction,
  getMintLen,
  ExtensionType,
} from '@solana/spl-token';
import { TokenMetadata, pack } from '@solana/spl-token-metadata';
// import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export async function usebuyEventToken({
  eventId,
  quantity,
  connection,
  wallet: { publicKey },
}: {
  eventId: number;
  quantity: number;
  connection: any;
  wallet: any;
}) {
    // const connection = useConnection();
    const buyerPublicKey  = new PublicKey(publicKey);

//   const { publicKey: buyerPublicKey, sendTransaction } = wallet();

  if (!buyerPublicKey) {
    throw new Error('Wallet not connected');
  }

  console.log(`Buying ${quantity} tickets for event ${eventId}`);

  try {
    const eventResponse = await fetch(`/api/list/${eventId}`);
    if (!eventResponse.ok) {
      throw new Error(`Failed to fetch event details: ${eventResponse.statusText}`);
    }
    const event = await eventResponse.json();

    console.log('Event details:', event);

    if (!event || !event.createdBy?.wallet[0]?.privateKey || !event.paymentAddress) {
      throw new Error('Event, event creator wallet, or payment address not found');
    }

    

    const privateKey = event.createdBy.wallet[0].privateKey;

    const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(Buffer.from(privateKey, 'hex')));
    console.log('Payer Public Key:', payerKeypair.publicKey.toBase58());

    console.log('Event details:', event);

    const creatorPublicKey = new PublicKey(payerKeypair.publicKey);
    const mint = new PublicKey(event.paymentAddress);

    // Get or create the buyer's token account
    const buyerTokenAccount = getAssociatedTokenAddressSync(
      mint,
      buyerPublicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    console.log(`Buyer Token Account: ${buyerTokenAccount.toBase58()}`);

    // Create a transaction to create the buyer's token account if it doesn't exist
    const transaction = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        buyerPublicKey,
        buyerTokenAccount,
        buyerPublicKey,
        mint,
        TOKEN_2022_PROGRAM_ID
      )
    );

    console.log('Buyer token account created');

    // Add instruction to transfer tokens from the creator to the buyer
    transaction.add(
      createTransferInstruction(
        getAssociatedTokenAddressSync(mint, creatorPublicKey, false, TOKEN_2022_PROGRAM_ID),
        buyerTokenAccount,
        creatorPublicKey,
        BigInt(quantity * Math.pow(10, 9)), // Multiply by 10^9 for 9 decimal places
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );

    console.log('Tokens transferred to buyer');

    // NFT creation
    const transactions = [];
    const nftMintKeypairs = [];
    for (let i = 0; i < quantity; i++) {
      const transaction = new Transaction();
      transaction.feePayer = publicKey;
      const nftMintKeypair = Keypair.generate();
      nftMintKeypairs.push(nftMintKeypair);

      // Calculate rent for the NFT mint account
      const mintLen = getMintLen([ExtensionType.MetadataPointer]) + 100; // Add 1 for padding
      const mintRent = await connection.getMinimumBalanceForRentExemption(mintLen);

      // Generate token metadata for the NFT
      const metadata: TokenMetadata = {
        name: `Ticket ${i + 1} for ${event.title}`,
        symbol: event.title.substring(0, 4).toUpperCase(),
        uri: `https://yojan.vercel.app/metadata/${eventId}/${i + 1}`, // Replace with actual metadata URI
        updateAuthority: creatorPublicKey,
        mint: nftMintKeypair.publicKey,
        additionalMetadata: []
      };

      const metadataLen = pack(metadata).length + 100; // Add 1 for padding
      // const metadataRent = await connection.getMinimumBalanceForRentExemption(metadataLen);
      const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen + 100);

      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: buyerPublicKey,
          newAccountPubkey: nftMintKeypair.publicKey,
          space: mintLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        SystemProgram.createAccount({
          fromPubkey: buyerPublicKey,
          newAccountPubkey: nftMintKeypair.publicKey,
          space: metadataLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
          nftMintKeypair.publicKey,
          buyerPublicKey,
          buyerPublicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
          nftMintKeypair.publicKey,
          0, // 0 decimals for NFT
          buyerPublicKey,
          buyerPublicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          metadata: nftMintKeypair.publicKey,
          updateAuthority: buyerPublicKey,
          mint: nftMintKeypair.publicKey,
          mintAuthority: buyerPublicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
        })
      );

      // Add instruction to mint 1 NFT to the buyer
      const buyerNftAccount = getAssociatedTokenAddressSync(
        nftMintKeypair.publicKey,
        buyerPublicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      transaction.add(
        createAssociatedTokenAccountInstruction(
          buyerPublicKey,
          buyerNftAccount,
          buyerPublicKey,
          nftMintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createMintToInstruction(
          nftMintKeypair.publicKey,
          buyerNftAccount,
          buyerPublicKey,
          1, // Mint 1 NFT
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      transactions.push(transaction);

      console.log(`NFT ticket ${i + 1} minting instructions added`);
    }

    // let retries = 3;
    // let signature;
    // while (retries > 0) {
    //   try {
    //     signature = await sendTransaction(transaction, connection);
    //     await connection.confirmTransaction(signature, 'confirmed');
    //     break;
    //   } catch (error) {
    //     console.error('Transaction failed, retrying...', error);
    //     retries--;
    //     if (retries === 0) throw error;
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //   }
    // }
    // await connection.confirmTransaction(signature, 'confirmed');

    // console.log('Transaction confirmed. Signature:', signature);

    const updateResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          buyerPublicKey: buyerPublicKey.toBase58(),
          quantity: quantity,
          transactionId: buyerTokenAccount.toBase58(),
          buyerTokenAccount: buyerTokenAccount,
          nftMintAddresses: nftMintKeypairs.map(kp => kp.publicKey.toBase58()),
        }),
      });

    return {
      transactions,
      buyerTokenAccount: buyerTokenAccount.toBase58(),
      nftMintAddresses: nftMintKeypairs.map(kp => kp.publicKey.toBase58()),
      updateResponse,
    };

  } catch (error : any) {
    console.error('Error in buyEventToken:', error);
    throw new Error(`Failed to buy event token: ${error.message}`);
  }
}