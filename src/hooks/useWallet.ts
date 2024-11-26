import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { useWallet as usePhantomWallet } from "@solana/wallet-adapter-react";

// Zod schemas (unchanged)
const transactionSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount").transform(parseFloat),
  operation: z.enum(['send', 'receive']),
  toAddress: z.string(),
});

const importWalletSchema = z.object({
  privateKey: z.string().min(1, "Private key is required"),
});

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
}

interface UserDetails {
  address: string;
  balance: number;
  privateKey: string;
}

export function useWallet() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [hasWallet, setHasWallet] = useState<boolean>(false);
  const [isPhantomWallet, setIsPhantomWallet] = useState<boolean>(false);
  
  const phantomWallet = usePhantomWallet();

  useEffect(() => {
    checkWalletStatus();
  }, []);

  useEffect(() => {
    if (phantomWallet.connected) {
      setIsWalletConnected(true);
      setIsPhantomWallet(true);
    }
  }, [phantomWallet.connected]);

  const checkWalletStatus = async () => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getWalletDetails', userId: Number(localStorage.getItem('userId')) })
      });
      if (response.ok) {
        setHasWallet(true);
      }
    } catch (error) {
      console.error('Error checking wallet status:', error);
    }
  };


  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getTransactions', userId: Number(localStorage.getItem('userId')) })
      });
      const data = await response.json();
      if (response.ok) {
        setTransactions(data.transactions);
      } else {
        console.error('Failed to fetch transactions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleOpenWallet = async () => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getWalletDetails', userId: Number(localStorage.getItem('userId')) })
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setIsWalletConnected(true);
        setUserDetails(data);
        setBalance(data.balance);
        fetchTransactions();
      } else {
        alert('Failed to open wallet. Please try again.');
      }
    } catch (error) {
      console.error('Error opening wallet:', error);
      alert('Failed to open wallet. Please try again.');
    }
  };


  const handleCreateWallet = async () => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', userId: Number(localStorage.getItem('userId')) })
      });
      const data = await response.json();
      if (response.ok) {
        setIsWalletConnected(true);
        setUserDetails(data);
        setBalance(data.balance);
        setHasWallet(true);
        alert('New wallet created successfully!');
        await updatePaymentAddress(data.address);
        fetchTransactions();
      } else {
        alert(`Failed to create wallet: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      alert('Failed to create wallet. Please try again.');
    }
  };

  const handleImportWallet = async (privateKey: string) => {
    try {
      importWalletSchema.parse({ privateKey });
      const encryptedPrivateKey = JSON.stringify(Array.from(new TextEncoder().encode(privateKey)));

      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import',
          userId: Number(localStorage.getItem('userId')),
          encryptedPrivateKey
        })
      });
      const data = await response.json();
      if (response.ok) {
        setIsWalletConnected(true);
        setUserDetails(data);
        setBalance(data.balance);
        setHasWallet(true);
        alert('Wallet imported successfully!');
        await updatePaymentAddress(data.address);
        fetchTransactions();
      } else {
        alert(`Failed to import wallet: ${data.error}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.errors.map(err => err.message).join(", "));
      } else {
        console.error('Error importing wallet:', error);
        alert('Failed to import wallet. Please try again.');
      }
    }
  };

  const updatePaymentAddress = async (address: string) => {
    try {
      await fetch('/api/wallet', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(localStorage.getItem('userId')),
          newPaymentAddress: address
        })
      });
    } catch (error) {
      console.error('Error updating payment address:', error);
    }
  };

  const handleSubmitTransaction = async (amount: string, operation: string, toAddress: string) => {
    try {
      transactionSchema.parse({ amount, operation, toAddress });

      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          userId: Number(localStorage.getItem('userId')),
          amount: parseFloat(amount),
          toAddress: operation === 'send' ? toAddress : null
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Transaction submitted: ${operation} ${amount} SOL`);
        setBalance(data.wallet.balance);
        fetchTransactions();
      } else {
        alert(`Transaction failed: ${data.error}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.errors.map(err => err.message).join(", "));
      } else {
        console.error('Error submitting transaction:', error);
        alert('Failed to submit transaction. Please try again.');
      }
    }
  };

  const handleRequestAirdrop = async () => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'requestAirdrop', userId: Number(localStorage.getItem('userId')) })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Airdrop successful! Received 2 SOL.');
        setBalance(data.newBalance);
        fetchTransactions();
      } else {
        alert(`Airdrop failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error requesting airdrop:', error);
      alert('Failed to request airdrop. Please try again.');
    }
  };


  // Modified and new functions to handle both built-in and Phantom wallets
  const connectWallet = useCallback(async () => {
    if (phantomWallet.wallet) {
      try {
        await phantomWallet.connect();
        console.log('Phantom wallet connected:', phantomWallet.publicKey?.toBase58());
        setIsWalletConnected(true);
        setIsPhantomWallet(true);
        // You might want to fetch balance and transactions for Phantom wallet here
      } catch (error) {
        console.error('Failed to connect Phantom wallet:', error);
      }
    } else {
      // Fallback to built-in wallet connection
      try {
        const response = await fetch('/api/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getWalletDetails', userId: Number(localStorage.getItem('userId')) })
        });
        const data = await response.json();
        if (response.ok) {
          setIsWalletConnected(true);
          setIsPhantomWallet(false);
          setUserDetails(data);
          setBalance(data.balance);
          fetchTransactions();
        } else {
          alert('Failed to connect built-in wallet. Please try again.');
        }
      } catch (error) {
        console.error('Error connecting built-in wallet:', error);
        alert('Failed to connect built-in wallet. Please try again.');
      }
    }
  }, [phantomWallet]);

  const disconnectWallet = useCallback(() => {
    if (isPhantomWallet) {
      try {
        phantomWallet.disconnect();
        console.log('Phantom wallet disconnected');
      } catch (error) {
        console.error('Failed to disconnect Phantom wallet:', error);
      }
    }
    setIsWalletConnected(false);
    setIsPhantomWallet(false);
    setUserDetails(null);
    setBalance(0);
    setTransactions([]);
  }, [phantomWallet, isPhantomWallet]);

  return {
    balance,
    transactions,
    userDetails,
    isWalletConnected,
    hasWallet,
    isPhantomWallet,
    checkWalletStatus,
    handleOpenWallet,
    handleCreateWallet,
    handleImportWallet,
    handleSubmitTransaction,
    handleRequestAirdrop,
    publicKey: isPhantomWallet ? phantomWallet.publicKey : userDetails?.address,
    connectWallet,
    disconnectWallet,
  };
}
