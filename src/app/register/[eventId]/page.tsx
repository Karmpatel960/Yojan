"use client";
import { useState, useEffect, use } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Calendar, MapPin, Tag, User, Phone, Mail, Info ,Minus, Plus } from 'lucide-react';
import { PurchaseEventTicket } from '@/components/LandingPage/tickets/Purchase';


interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  tags: string[];
  organizerName: string;
  organizerContact: string;
  organizerEmail: string;
  poster: string | null;
  ticketPrice: number;
  availableSeats: number;
  registrationLink: string;
  paymentOptions: string[];
  instructions: string;
  paymentAddress: string;
  images: { id: number; url: string }[];
}

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  quantity: number;
}

export default function RegisterPage({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const { isAuthenticated, login,verifyToken } = useAuth();
  const { connection } = useConnection();
  const { publicKey, connected, disconnect, connect, signTransaction ,sendTransaction} = useWallet();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    name: '',
    email: '',
    phone: '',
    quantity: 1,
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [balance, setBalance] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1)
  const [authStatus, setAuthStatus] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState(null);

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/list/${params.eventId}`);
        if (!response.ok) throw new Error('Failed to fetch event');
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.eventId]);

  useEffect(() => {
    const getBalance = async () => {
      if (connected && publicKey) {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    getBalance();
  }, [connected, publicKey, connection]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const { success } = await verifyToken();
        setAuthStatus(success);
        isAuthenticated == true;
      } else {
        setAuthStatus(false);
      }
    };

    checkAuthStatus();
  }, [verifyToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
      setAuthStatus(true);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  

  // const handlePurchase = async () => {
  //   if (!publicKey || !signTransaction || !sendTransaction) {
  //     setError('Wallet not connected');
  //     return;
  //   }

  //   setIsPurchasing(true);
  //   setError(null);

  //   try {
  //     const { signature, buyerTokenAccount, nftMintAddresses, updateResponse } = await usebuyEventToken({
  //       eventId: event?.id,
  //       quantity: quantity,
  //     });

  //     if (!updateResponse.ok) {
  //       throw new Error('Failed to update purchase information');
  //     }

  //     alert(`Purchase successful! Transaction ID: ${nftMintAddresses}`);
  //   } catch (error: any) {
  //     console.error('Error during purchase:', error);
  //     setError(`Purchase failed: ${error.message}`);
  //   } finally {
  //     setIsPurchasing(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return <div className="text-center">Event not found</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Event details card */}
      <div className="w-full md:w-2/3 p-4 md:p-8">
      <Card className="w-full h-full overflow-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {event.poster && (
              <div className="w-full h-64 md:h-96 relative rounded-lg overflow-hidden">
                <img src={event.poster} alt="Event Poster" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>{new Date(event.date).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-primary" />
                <span>{event.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-primary" />
                <span>{event.availableSeats} seats available</span>
              </div>
            </div>
            <Separator />
            <div>
              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{event.description}</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-2xl font-semibold mb-2">Organizer Information</h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>{event.organizerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>{event.organizerContact}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>{event.organizerEmail}</span>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
              <p className="text-gray-700">{event.instructions}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase ticket card */}
      <div className="w-full md:w-1/3 p-4 md:p-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{isAuthenticated || authStatus ? 'Purchase Ticket' : 'Login to Purchase'}</CardTitle>
          </CardHeader>
          <CardContent>
            {isAuthenticated || authStatus ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={registrationData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={registrationData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={registrationData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Quantity</h3>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={decrementQuantity}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        defaultValue={registrationData.quantity}
                        className="w-16 text-center"
                        min="1"
                        onChange={handleInputChange}
                        required
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={incrementQuantity}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Wallet Connection</h2>
                  {connected && publicKey ? (
                    <div>
                      <p className="text-green-600">
                        Wallet connected: {publicKey.toBase58().slice(0, 8)}...
                      </p>
                      <p className="text-sm text-gray-600">
                        Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
                      </p>
                      <Button onClick={disconnect} className="mt-2 w-full">
                        Disconnect Wallet
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2">Select and connect your wallet to purchase:</p>
                      <WalletMultiButton className="w-full" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Log In
                </Button>
              </form>
              <div className="text-center">
              <p>Don't have an account?</p>
              <a href="/signup" className="text-primary hover:underline">
                Sign up here
              </a>
            </div>
            </div>
            )}
          </CardContent>
          {authStatus && (
            <CardFooter>
              <PurchaseEventTicket
                eventId={event.id}
                quantity={quantity}
                ticketPrice={event.ticketPrice}
                onSuccess={(message) => alert(message)}
                onError={(message : any) => setError(message)}
              />
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
