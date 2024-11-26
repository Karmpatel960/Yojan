// import React, { useState, useEffect } from 'react';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// interface TransactionStatusDisplayProps {
//   transactionId: string;
//   transactionSignature: string;
//   onStatusChange?: (status: string) => void;
// }

// export const TransactionStatusDisplay: React.FC<TransactionStatusDisplayProps> = ({ 
//   transactionId, 
//   transactionSignature,
//   onStatusChange 
// }) => {
//   const [status, setStatus] = useState<string>('pending');
//   const [nftMintAddresses, setNftMintAddresses] = useState<string[]>([]);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [checkCount, setCheckCount] = useState(0);

//   useEffect(() => {
//     const MAX_CHECKS = 30; // Stop checking after 30 attempts (2.5 minutes)
    
//     const checkFinalization = async () => {
//       try {
//         setCheckCount(prevCount => prevCount + 1);
        
//         console.log('Checking transaction:', transactionSignature);
        
//         const response = await fetch('/api/payment/confirm', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ transactionId, transactionSignature }),
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log('Transaction status:', data);

//         if (data.status === 'completed') {
//           setStatus('completed');
//           if (data.nftMintAddresses) setNftMintAddresses(data.nftMintAddresses);
//           if (onStatusChange) onStatusChange('completed');
//           clearInterval(pollInterval);
//         } else if (data.status === 'failed') {
//           handleFailure(data.message || 'Transaction failed');
//         } else if (checkCount >= MAX_CHECKS) {
//           handleFailure('Transaction not finalized after multiple attempts');
//         }
//       } catch (error) {
//         console.error('Error checking transaction status:', error);
//         setErrorMessage(`Error checking transaction status: ${error.message}`);
//       }
//     };

//     const handleFailure = (message: string) => {
//       setStatus('failed');
//       setErrorMessage(message);
//       if (onStatusChange) onStatusChange('failed');
//       clearInterval(pollInterval);
//     };

//     const pollInterval = setInterval(checkFinalization, 5000); // Check every 5 seconds
//     checkFinalization(); // Initial check

//     return () => clearInterval(pollInterval);
//   }, [transactionId, transactionSignature, onStatusChange]);

//   const getAlertVariant = () => {
//     switch (status) {
//       case 'completed': return 'success';
//       case 'failed': return 'destructive';
//       default: return 'default';
//     }
//   };

//   return (
//     <Alert variant={getAlertVariant()}>
//       <AlertTitle>Transaction Status: {status}</AlertTitle>
//       <AlertDescription>
//         {status === 'pending' && (
//           <div>
//             <p>
//               Waiting for transaction finalization on the Solana blockchain. This may take a few minutes...
//               {checkCount > 0 && ` (Attempt ${checkCount})`}
//             </p>
//             <p>Transaction Signature: {transactionSignature}</p>
//           </div>
//         )}
//         {status === 'completed' && (
//           <div>
//             <p>Your purchase is complete! Here are your NFT ticket mint addresses:</p>
//             <ul>
//               {nftMintAddresses.map((address, index) => (
//                 <li key={index}>{address}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//         {status === 'failed' && (
//           <div>
//             <p>Your transaction has failed. {errorMessage || 'Please try your purchase again or contact support.'}</p>
//             <p>Transaction Signature: {transactionSignature}</p>
//           </div>
//         )}
//       </AlertDescription>
//     </Alert>
//   );
// };


// import React, { useState, useEffect, useCallback } from 'react';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Connection, TransactionSignature } from '@solana/web3.js';

// interface TransactionStatusDisplayProps {
//   transactionId: string;
//   transactionSignature: TransactionSignature;
//   onStatusChange?: (status: string) => void;
//   connection: Connection;
// }

// const MAX_RETRIES = 10;
// const INITIAL_RETRY_DELAY = 100000; // 1 second
// const MAX_RETRY_DELAY = 10000000; // 10 seconds

// export const TransactionStatusDisplay: React.FC<TransactionStatusDisplayProps> = ({ 
//   transactionId, 
//   transactionSignature,
//   onStatusChange,
//   connection
// }) => {
//   const [status, setStatus] = useState<string>('pending');
//   const [nftMintAddresses, setNftMintAddresses] = useState<string[]>([]);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [retryCount, setRetryCount] = useState(0);

//   const handleFailure = useCallback((message: string) => {
//     setStatus('failed');
//     setErrorMessage(message);
//     if (onStatusChange) onStatusChange('failed');
//   }, [onStatusChange]);

//   const confirmPayment = useCallback(async () => {
//     try {
//       const response = await fetch('/api/payment', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ transactionId, transactionSignature }),
//       });

//       if (!response.ok) throw new Error('Failed to confirm transaction');
//       const data = await response.json();

//       setStatus(data.status);
//       if (data.nftMintAddresses) setNftMintAddresses(data.nftMintAddresses);
//       if (onStatusChange) onStatusChange(data.status);

//       return data.status === 'completed' || data.status === 'failed';
//     } catch (error) {
//       console.error('Error confirming payment:', error);
//       handleFailure(`Failed to confirm payment: ${error.message}`);
//       return true;
//     }
//   }, [transactionId, transactionSignature, onStatusChange, handleFailure]);

//   const checkTransactionStatus = useCallback(async (): Promise<boolean> => {
//     try {
//       // Try getSignatureStatus first
//       const signatureStatus = await connection.getSignatureStatus(transactionSignature);
//       console.log('Signature status:', signatureStatus);

//       if (signatureStatus && signatureStatus.value) {
//         if (signatureStatus.value.err) {
//           handleFailure('Transaction failed on the blockchain');
//           return true;
//         }
//         if (signatureStatus.value.confirmationStatus === 'finalized') {
//           return await confirmPayment();
//         }
//       }

//       // If getSignatureStatus doesn't provide conclusive results, try getParsedTransaction
//       const parsedTransaction = await connection.getParsedTransaction(transactionSignature, 'confirmed');
//       console.log('Parsed transaction:', parsedTransaction);

//       if (parsedTransaction) {
//         if (parsedTransaction.meta && parsedTransaction.meta.err) {
//           handleFailure('Transaction failed on the blockchain');
//           return true;
//         }
//         if (parsedTransaction.meta && parsedTransaction.meta.confirmations === 0) {
//           return await confirmPayment();
//         }
//       }

//       // If we still don't have conclusive results, we'll retry
//       return false;
//     } catch (error) {
//       console.error('Error checking transaction status:', error);
//       // Don't set error message here, we'll retry instead
//       return false;
//     }
//   }, [connection, transactionSignature, confirmPayment, handleFailure]);

//   const retryWithExponentialBackoff = useCallback(async () => {
//     let delay = INITIAL_RETRY_DELAY;

//     for (let i = 0; i < MAX_RETRIES; i++) {
//       setRetryCount(i + 1);
//       const shouldStop = await checkTransactionStatus();
      
//       if (shouldStop) {
//         return;
//       }

//       // Exponential backoff
//       await new Promise(resolve => setTimeout(resolve, delay));
//       delay = Math.min(delay * 1.5, MAX_RETRY_DELAY);
//     }

//     handleFailure('Transaction status could not be determined after multiple attempts');
//   }, [checkTransactionStatus, handleFailure]);

//   useEffect(() => {
//     retryWithExponentialBackoff();
//   }, [retryWithExponentialBackoff]);

//   const getAlertVariant = () => {
//     switch (status) {
//       case 'completed': return 'success';
//       case 'failed': return 'destructive';
//       default: return 'default';
//     }
//   };

//   return (
//     <Alert variant={getAlertVariant()}>
//       <AlertTitle>Transaction Status: {status}</AlertTitle>
//       <AlertDescription>
//         {status === 'pending' && (
//           <div>
//             <p>
//               Verifying transaction on the Solana blockchain. This may take a few minutes...
//               {retryCount > 0 && ` (Attempt ${retryCount})`}
//             </p>
//             <p>Transaction Signature: {transactionSignature}</p>
//           </div>
//         )}
//         {status === 'completed' && (
//           <div>
//             <p>Your purchase is complete! Here are your NFT ticket mint addresses:</p>
//             <ul>
//               {nftMintAddresses.map((address, index) => (
//                 <li key={index}>{address}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//         {status === 'failed' && (
//           <div>
//             <p>Your transaction has failed. {errorMessage || 'Please try your purchase again or contact support.'}</p>
//             <p>Transaction Signature: {transactionSignature}</p>
//           </div>
//         )}
//       </AlertDescription>
//     </Alert>
//   );
// };
import React, { useEffect, useState } from 'react';
import { Connection } from '@solana/web3.js';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

interface TransactionStatusDisplayProps {
  transactionId: string;
  transactionSignature: string;
  quantity: number;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  stopPurchasingState: () => void;
}

const SOLANA_RPC_URL = 'https://api.devnet.solana.com';
const ATTEMPT_DURATION = 180000; 
const API_RETRY_INTERVAL = 5000; 

export const TransactionStatusDisplay: React.FC<TransactionStatusDisplayProps> = ({
  transactionId,
  transactionSignature,
  quantity,
  onSuccess,
  onError,
  stopPurchasingState,
}) => {
  const [status, setStatus] = useState<'attempting' | 'pending' | 'confirmed' | 'failed'>('attempting');
  const [nftMintAddresses, setNftMintAddresses] = useState<string[]>([]);
  const [attemptStartTime, setAttemptStartTime] = useState(Date.now());
  const [apiCallMade, setApiCallMade] = useState(false);
  const route = useRouter();

  useEffect(() => {
    const checkTransactionStatus = async () => {
      const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
      try {
        const signatureStatus = await connection.getSignatureStatus(transactionSignature);
        console.log('Signature status:', signatureStatus);

        if (signatureStatus.value) {
          console.log('Signature status:', signatureStatus.value);
          if (signatureStatus.value.err) {
            setStatus('failed');
            onError('Transaction failed on the blockchain');
            stopPurchasingState();
            return;
          } else if (signatureStatus.value.confirmationStatus === 'finalized' || signatureStatus.value.confirmationStatus === 'confirmed') {
            setStatus('pending');
            if (!apiCallMade) {
              await checkApiStatus();
            }
          }
        }

        // Check if we've been attempting for too long
        if (Date.now() - attemptStartTime > ATTEMPT_DURATION) {
          setStatus('failed');
          onError('Transaction verification timed out. Please check your wallet for confirmation.');
          stopPurchasingState();
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
        if (Date.now() - attemptStartTime > ATTEMPT_DURATION) {
          setStatus('failed');
          onError('Failed to verify transaction status');
          stopPurchasingState();
        }
      }
    };

const checkApiStatus = async () => {
  if (apiCallMade) return false;

  let retryCount = 0;

  const makeApiCall = async () => {
    try {
      setApiCallMade(true);
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, transactionSignature, quantity }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'completed') {
          setStatus('confirmed');
          setNftMintAddresses(data.nftMintPublicKeys);
          onSuccess('Purchase completed successfully!');
          stopPurchasingState();
          setTimeout(() => {
            route.push('/console');
          }, 5000); // Redirect after 5 seconds
          return true;
        }
      } else {
        console.error('API error:', response.status);
      }
    } catch (error) {
      console.error('Error checking API status:', error);
    }
    
    // If the response is not successful, retry after the interval
    retryCount++;
    if (retryCount * API_RETRY_INTERVAL < ATTEMPT_DURATION) {
      console.log(`Retrying API call... attempt ${retryCount}`);
      setTimeout(makeApiCall, API_RETRY_INTERVAL); // Retry after the interval
    } else {
      setStatus('failed');
      onError('Transaction verification timed out. Please check your wallet for confirmation.');
      stopPurchasingState();
    }
    
    return false;
  };

  return await makeApiCall();
};


    const interval = setInterval(async () => {
      if (status === 'attempting') {
        await checkTransactionStatus();
      } else if (status === 'pending' && !apiCallMade) {
        const isCompleted = await checkApiStatus();
        if (isCompleted) {
          clearInterval(interval);
        }
      }
    }, API_RETRY_INTERVAL);

    return () => clearInterval(interval);
  }, [transactionSignature, quantity, onSuccess, onError, attemptStartTime, transactionId, status, stopPurchasingState, route, apiCallMade]);

  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'failed':
        return 'bg-red-100 border-red-400 text-red-700';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  return (
    <Alert className={`${getStatusColor()} border px-4 py-3 rounded relative`} role="alert">
      <AlertTitle className="font-bold">Transaction Status: {status}</AlertTitle>
      <AlertDescription>
        {status === 'attempting' && (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Attempting to verify the transaction on the Solana blockchain...
          </div>
        )}
        {status === 'pending' && (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Transaction confirmed. Waiting for NFT minting to complete...
          </div>
        )}
        {status === 'confirmed' && (
          <div>
            <p>Your purchase of {quantity} ticket(s) is complete! Here are your NFT ticket mint addresses:</p>
            <ul className="list-disc pl-5 mt-2">
              {nftMintAddresses.map((address, index) => (
                <li key={index} className="text-sm">{address}</li>
              ))}
            </ul>
            <p className="mt-2">Redirecting to console in 5 seconds...</p>
          </div>
        )}
        {status === 'failed' && 'Transaction failed or timed out. Please check your wallet and try again if necessary.'}
      </AlertDescription>
    </Alert>
  );
};

export default TransactionStatusDisplay;