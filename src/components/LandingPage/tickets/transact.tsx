import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TransactionStatusDisplay } from './trnsactiondisplay';

export const UserTransactionsDisplay: React.FC = () => {
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserTransactions = async () => {
      if (!publicKey) return;

      try {
        const response = await fetch(`/api/purchase/${publicKey.toBase58()}`);
        if (!response.ok) throw new Error('Failed to fetch user transactions');
        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error('Error fetching user transactions:', error);
      }
    };

    fetchUserTransactions();
  }, [publicKey]);

  if (!publicKey) {
    return <p>Please connect your wallet to view transactions.</p>;
  }

  return (
    <div>
      <h2>Your Transactions</h2>
      {/* {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        transactions.map((transactionId) => (
          <TransactionStatusDisplay key={transactionId} transactionSignature={}transactionId={transactionId} />
        ))
      )} */}
    </div>
  );
};