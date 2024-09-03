// pages/register.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  ticketPrice: number;
  registrationLink: string;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  // Fetch event details
  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/events/${eventId}`);
          const data = await res.json();
          setEvent(data.event);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching event:', error);
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [eventId]);

  const handlePayment = async () => {
    if (!publicKey || !event) return;

    try {
      setPaymentStatus('processing');

      // Fetch payment transaction from backend
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          userPublicKey: publicKey.toBase58(),
        }),
      });

      const { transaction } = await res.json();

      const tx = Transaction.from(Buffer.from(transaction, 'base64'));

      const signature = await sendTransaction(tx, connection);

      await connection.confirmTransaction(signature, 'processed');

      await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          userPublicKey: publicKey.toBase58(),
          signature,
        }),
      });

      setPaymentStatus('success');
      alert('Payment successful! You are registered for the event.');
      router.push('/'); // Redirect to homepage or confirmation page
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      alert('Payment failed. Please try again.');
    }
  };

  if (loading || !event) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Price:</strong> {event.ticketPrice} SOL</p>

          {!connected ? (
            <WalletMultiButton className="mt-4" />
          ) : (
            <Button
              onClick={handlePayment}
              disabled={paymentStatus === 'processing'}
            >
              {paymentStatus === 'processing' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                'Pay and Register'
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
