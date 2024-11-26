// import React, { useState, useEffect } from 'react';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { Button } from '@/components/ui/button';
// import { LAMPORTS_PER_SOL, Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
// import { TransactionStatusDisplay } from '@/components/LandingPage/tickets/trnsactiondisplay';

// interface PurchaseEventTicketProps {
//   eventId: number;
//   quantity: number;
//   ticketPrice: number;
//   onSuccess: (message: string) => void;
//   onError: (message: string) => void;
// }

// export const PurchaseEventTicket: React.FC<PurchaseEventTicketProps> = ({
//   eventId,
//   quantity,
//   ticketPrice,
//   onSuccess,
//   onError,
// }) => {
//   const { publicKey, signTransaction } = useWallet();
//   const [isPurchasing, setIsPurchasing] = useState(false);
//   const [eventCreatorPublicKey, setEventCreatorPublicKey] = useState<string | null>(null);
//   const [transactionId, setTransactionId] = useState<string | null>(null);
//   const [transactionSignature, setTransactionSignature] = useState<string | null>(null);


//   useEffect(() => {
//     const fetchEventCreatorPublicKey = async () => {
//       try {
//         const response = await fetch(`/api/list/${eventId}`);
//         if (!response.ok) throw new Error('Failed to fetch event details');
//         const eventData = await response.json();
//         setEventCreatorPublicKey(eventData.createdBy.wallet[0].address);
//       } catch (error) {
//         console.error('Error fetching event creator public key:', error);
//         onError('Failed to fetch event details');
//       }
//     };

//     fetchEventCreatorPublicKey();
//   }, [eventId, onError]);

//   const handlePurchase = async () => {
//     const amountInSOL = ticketPrice * quantity;

//     setIsPurchasing(true);

//     try {
//       if (!publicKey || !signTransaction) {
//         throw new Error('Wallet not connected');
//       }

//       if (!eventCreatorPublicKey) {
//         throw new Error('Event creator public key not found');
//       }

//       const recipient = new PublicKey(eventCreatorPublicKey);
//       const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

//       const transaction = new Transaction().add(
//         SystemProgram.transfer({
//           fromPubkey: publicKey,
//           toPubkey: recipient,
//           lamports: amountInSOL * LAMPORTS_PER_SOL,
//         })
//       );

//       const { blockhash  } = await connection.getLatestBlockhash();
//       transaction.recentBlockhash = blockhash;
//       transaction.feePayer = publicKey;

//       const signedTransaction = await signTransaction(transaction);
//       const signature = await connection.sendRawTransaction(signedTransaction.serialize());
//       setTransactionSignature(signature);

//       // Initiate the purchase process on the server
//       const response = await fetch('/api/purchase', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           eventId,
//           buyerPublicKey: publicKey.toBase58(),
//           quantity,
//           transactionSignature: signature,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to initiate purchase on the server');
//       }

//       const { transactionId } = await response.json();
//       setTransactionId(transactionId);

//       // Start checking for block finalization
//       // checkBlockFinalization(connection, signature, transactionId);

//     } catch (error: any) {
//       console.error('Error during purchase:', error);
//       onError(`Purchase failed: ${error.message}`);
//       setIsPurchasing(false);
//     }
//   };

//   // const checkBlockFinalization = async (connection: Connection, signature: string, transactionId: string) => {
//   //   try {
//   //     const latestBlockHash = await connection.getLatestBlockhash();

//   //     console.log('Checking block finalization...');

//   //     const result = await connection.confirmTransaction({
//   //       blockhash: latestBlockHash.blockhash,
//   //       lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
//   //       signature: signature,
//   //     });

//   //     console.log('Block finalization result:', result);


//   //     if (result.value.err) {
//   //       throw new Error('Transaction failed');
//   //     }

//   //     // Transaction is finalized, notify the server
//   //     const response = await fetch('/api/payment/confirm', {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify({
//   //         transactionId,
//   //         transactionSignature: signature,
//   //       }),
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error('Failed to finalize transaction on the server');
//   //     }
//   //   } catch (error: any) {
//   //     console.error('Error during block finalization:', error);
//   //     onError(`Block finalization failed: ${error.message}`);
//   //     setIsPurchasing(false);
//   //   }
//   // };

//   const handleStatusChange = (status: string) => {
//     if (status === 'completed') {
//       onSuccess('Purchase completed successfully!');
//       setIsPurchasing(false);
//     } else if (status === 'failed') {
//       onError('Purchase failed. Please try again.');
//       setIsPurchasing(false);
//     }

//   };

//   return (
//     <div>
//       <Button
//         onClick={handlePurchase}
//         disabled={!publicKey || isPurchasing || !eventCreatorPublicKey}
//         className="w-full"
//       >
//         {isPurchasing ? 'Processing...' : `Purchase Ticket (${ticketPrice} SOL)`}
//       </Button>
//       {transactionId && transactionSignature && (
//         <TransactionStatusDisplay
//         transactionId={transactionId}
//         transactionSignature={transactionSignature}
//         quantity={quantity}
//         onSuccess={handleStatusChange}
//         onError={handleStatusChange}

//       />
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { LAMPORTS_PER_SOL, Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { TransactionStatusDisplay } from '@/components/LandingPage/tickets/trnsactiondisplay';

interface PurchaseEventTicketProps {
  eventId: number;
  quantity: number;
  ticketPrice: number;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const PurchaseEventTicket: React.FC<PurchaseEventTicketProps> = ({
  eventId,
  quantity,
  ticketPrice,
  onSuccess,
  onError,
}) => {
  const { publicKey, signTransaction } = useWallet();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [eventCreatorPublicKey, setEventCreatorPublicKey] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventCreatorPublicKey = async () => {
      try {
        const response = await fetch(`/api/list/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch event details');
        const eventData = await response.json();
        setEventCreatorPublicKey(eventData.createdBy.wallet[0].address);
      } catch (error) {
        console.error('Error fetching event creator public key:', error);
        onError('Failed to fetch event details');
      }
    };

    fetchEventCreatorPublicKey();
  }, [eventId, onError]);

  const handlePurchase = async () => {
    const amountInSOL = ticketPrice * quantity;

    setIsPurchasing(true);

    try {
      if (!publicKey || !signTransaction) {
        throw new Error('Wallet not connected');
      }

      if (!eventCreatorPublicKey) {
        throw new Error('Event creator public key not found');
      }

      const recipient = new PublicKey(eventCreatorPublicKey);
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: amountInSOL * LAMPORTS_PER_SOL,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      setTransactionSignature(signature);

      // Initiate the purchase process on the server
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          buyerPublicKey: publicKey.toBase58(),
          quantity,
          transactionSignature: signature,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate purchase on the server');
      }

      const { transactionId } = await response.json();
      setTransactionId(transactionId);

    } catch (error: any) {
      console.error('Error during purchase:', error);
      onError(`Purchase failed: ${error.message}`);
      setIsPurchasing(false);
    }
  };

  const handleStatusChange = (status: string) => {
    if (status === 'completed') {
      onSuccess('Purchase completed successfully!');
      setIsPurchasing(false);
    } else if (status === 'failed') {
      onError('Purchase failed. Please try again.');
      setIsPurchasing(false);
    }
  };

  const stopPurchasingState = () => {
    setIsPurchasing(false);
  };

  return (
    <div>
      <Button
        onClick={handlePurchase}
        disabled={!publicKey || isPurchasing || !eventCreatorPublicKey}
        className="w-full"
      >
        {isPurchasing ? 'Processing...' : `Purchase Ticket (${ticketPrice} SOL)`}
      </Button>
      {transactionId && transactionSignature && (
        <TransactionStatusDisplay
          transactionId={transactionId}
          transactionSignature={transactionSignature}
          quantity={quantity}
          onSuccess={handleStatusChange}
          onError={handleStatusChange}
          stopPurchasingState={stopPurchasingState}
        />
      )}
    </div>
  );
};