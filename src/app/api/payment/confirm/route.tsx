// import { NextResponse } from 'next/server';
// import { createClient } from 'redis';
// import { Connection } from '@solana/web3.js';

// const redis = createClient({ url: process.env.REDIS_URL });

// export async function POST(req: Request) {
//   await redis.connect();

//   try {
//     const { transactionId, transactionSignature } = await req.json();
//     console.log('Transaction ID:', transactionId);
//     console.log('Transaction Signature:', transactionSignature);

//     if (!transactionId || !transactionSignature) {
//       return NextResponse.json({ error: 'Missing transaction details' }, { status: 400 });
//     }

//     // Fetch the transaction data from Redis
//     const transactionDataString = await redis.get(transactionId.toString());
//     console.log('Transaction Data:', transactionDataString);
//     if (!transactionDataString) {
//       return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
//     }

//     const transactionData = JSON.parse(transactionDataString);

//     // If the transaction is already completed, return the existing data
//     if (transactionData.status === 'completed') {
//       return NextResponse.json(transactionData, { status: 200 });
//     }

//     const signatureStatus = await connection.getSignatureStatus(transactionSignature);
//     console.log('Signature status:', signatureStatus);

//     if (signatureStatus && signatureStatus.value) {
//       handleValidStatus(signatureStatus.value);
//     } else {
//       const transaction = await connection.getParsedTransaction(transactionSignature, 'confirmed');
//       console.log('Parsed transaction:', transaction);

//       if (transaction) {
//         handleValidStatus(transaction.meta);
//       } else if (checkCount >= MAX_CHECKS) {
//         handleFailure('Transaction not found on the blockchain after multiple attempts');
//       }
//     }
//   } catch (error) {
//     console.error('Error checking transaction status:', error);
//     setErrorMessage(`Error checking transaction status: ${error.message}`);
//   }

//     // // Verify block finalization
//     // const connection = new Connection(process.env.SOLANA_RPC_URL as string, 'confirmed');
//     // const signatureStatus = await connection.getSignatureStatus(transactionSignature);

//     // if (!signatureStatus || !signatureStatus.value || signatureStatus.value.confirmationStatus !== 'finalized') {
//     //   return NextResponse.json({ status: 'pending', message: 'Transaction not yet finalized' }, { status: 200 });
//     // }

//     // Process the payment
//     const apiBaseUrl = process.env.NODE_ENV === 'production'
//       ? 'https://your-production-domain.com'
//       : 'http://localhost:3000';

//     const paymentResponse = await fetch(`${apiBaseUrl}/api/payment`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ transactionId, transactionSignature }),
//     });

//     if (!paymentResponse.ok) {
//       throw new Error(`HTTP error! status: ${paymentResponse.status}`);
//     }

//     const paymentResult = await paymentResponse.json();

//     // Update Redis with the completed status
//     await redis.set(transactionId, JSON.stringify({
//       status: 'completed',
//       ...paymentResult,
//     }), { EX: 3600 }); // Keep for 1 hour after completion

//     return NextResponse.json({
//       status: 'completed',
//       message: 'Transaction finalized and payment processed successfully',
//       ...paymentResult,
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Error checking transaction finalization:', error);
//     return NextResponse.json({ error: 'Failed to check transaction finalization' }, { status: 500 });
//   } finally {
//     await redis.disconnect();
//   }
// }


// import { NextResponse } from 'next/server';
// import { createClient } from 'redis';
// import { Connection } from '@solana/web3.js';


// const redis = createClient({ url: process.env.REDIS_URL });

// export async function POST(req: Request) {
  
//   await redis.connect();

//   try {
//     const connection = new Connection(process.env.SOLANA_RPC_URL as string, 'confirmed');
//     const { transactionId, transactionSignature } = await req.json();
//     console.log('Transaction ID:', transactionId);
//     console.log('Transaction Signature:', transactionSignature);

//     if (!transactionId || !transactionSignature) {
//       return NextResponse.json({ error: 'Missing transaction details' }, { status: 400 });
//     }

//     // Fetch the transaction data from Redis
//     const transactionDataString = await redis.get(transactionId.toString());
//     console.log('Transaction Data:', transactionDataString);
//     if (!transactionDataString) {
//       return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
//     }

//     const transactionData = JSON.parse(transactionDataString);

//     let paymentResult = {};

//     // If the transaction is already completed, return the existing data
//     if (transactionData.status === 'completed') {
//       return NextResponse.json(transactionData, { status: 200 });
//     }

//     // const signatureStatus = await connection.getSignatureStatus(transactionSignature);
//     //         console.log('Signature status:', signatureStatus);
    
//             if (transactionId != null && transactionSignature != null) {
//               paymentResult = handlePayment({ transactionId, transactionSignature ,transactionData?.quantity || 1});
//             } else {
//               const transaction = await connection.getParsedTransaction(transactionSignature, 'confirmed');
//               console.log('Parsed transaction:', transaction);
    
//               if (transaction) {
//                 paymentResult = handlePayment({ transactionId, transactionSignature,transactionDataString });
//               } 
//             }



//     // Verify block finalization
//     // const connection = new Connection(process.env.SOLANA_RPC_URL as string, 'finalized');
//     // const signatureStatus = await connection.getSignatureStatus(transactionSignature);
//     // console.log('Signature status:', signatureStatus);

//     // if (!signatureStatus || !signatureStatus.value || signatureStatus.value.confirmationStatus !== 'finalized') {
//     //   return NextResponse.json({ status: 'pending', message: 'Transaction not yet finalized' }, { status: 200 });
//     // }

//     // Process the payment



//     // Update Redis with the completed status
//     await redis.set(paymentResult?.transactionId, JSON.stringify({
//       status: 'completed',
//       ...paymentResult,
//     }), { EX: 3600 }); // Keep for 1 hour after completion

//     return NextResponse.json({
//       status: 'completed',
//       message: 'Transaction finalized and payment processed successfully',
//       ...paymentResult,
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Error checking transaction finalization:', error);
//     return NextResponse.json({ error: 'Failed to check transaction finalization' }, { status: 500 });
//   } finally {
//     await redis.disconnect();
//   }
// }




// async function handlePayment({ transactionId, transactionSignature } : { transactionId: string, transactionSignature: string, transactionDataString?.quantity: any }) {
//   const apiBaseUrl = process.env.NODE_ENV === 'production'
//   ? 'https://your-production-domain.com'
//   : 'http://localhost:3000';

// const paymentResponse = await fetch(`${apiBaseUrl}/api/payment`, {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ transactionId, transactionSignature ,transactionDataString}),
// });

// if (!paymentResponse.ok) {
//   console.log(`HTTP error! status: ${paymentResponse.status}`);
// }

// const paymentResult = await paymentResponse.json();

// return paymentResult;
// }

import { NextResponse } from 'next/server';
import { createClient } from 'redis';
import { Connection } from '@solana/web3.js';

const redis = createClient({ url: process.env.REDIS_URL });

export async function POST(req: Request) {
  await redis.connect();

  try {
    const connection = new Connection(process.env.SOLANA_RPC_URL as string, 'confirmed');
    const { transactionId, transactionSignature } = await req.json();

    console.log('Transaction ID:', transactionId);
    console.log('Transaction Signature:', transactionSignature);

    // Validate the received transaction data
    if (!transactionId || !transactionSignature) {
      return NextResponse.json({ error: 'Missing transaction details' }, { status: 400 });
    }

    // Fetch the transaction data from Redis
    const transactionDataString = await redis.get(transactionId.toString());
    console.log('Transaction Data:', transactionDataString);

    if (!transactionDataString) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const transactionData = JSON.parse(transactionDataString);
    let paymentResult: any = {};

    // Check if the transaction is already marked as completed
    if (transactionData.status === 'completed') {
      return NextResponse.json(transactionData, { status: 200 });
    }

    // Handling payment and transaction signature
    if (transactionId && transactionSignature) {
      paymentResult = await handlePayment({ 
        transactionId, 
        transactionSignature, 
        quantity: transactionData?.quantity || 1 
      });
    } else {
      const transaction = await connection.getParsedTransaction(transactionSignature, 'confirmed');
      console.log('Parsed transaction:', transaction);

      if (transaction) {
        paymentResult = await handlePayment({ 
          transactionId, 
          transactionSignature, 
          quantity: transactionData?.quantity || 1 
        });
      }
    }

    // Update Redis with the completed status
    await redis.set(transactionId.toString(), JSON.stringify({
      status: 'completed',
      ...paymentResult,
    }), { EX: 3600 }); // Cache for 1 hour after completion

    return NextResponse.json({
      status: 'completed',
      message: 'Transaction finalized and payment processed successfully',
      ...paymentResult,
    }, { status: 200 });

  } catch (error) {
    console.error('Error checking transaction finalization:', error);
    return NextResponse.json({ error: 'Failed to check transaction finalization' }, { status: 500 });
  } finally {
    await redis.disconnect();
  }
}

async function handlePayment({ transactionId, transactionSignature, quantity }: 
  { transactionId: string; transactionSignature: string; quantity: number }) {
  
  const apiBaseUrl = 'http://localhost:3000';

  const paymentResponse = await fetch(`${apiBaseUrl}/api/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionId, transactionSignature, quantity }),
  });

  if (!paymentResponse.ok) {
    console.log(`HTTP error! status: ${paymentResponse.status}`);
  }

  const paymentResult = await paymentResponse.json();
  return paymentResult;
}
