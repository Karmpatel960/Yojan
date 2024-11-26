'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Ticket, Search, Tag, Loader2 } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { toast } from 'sonner'

interface Event {
  id: number
  title: string
  description: string
  ticketPrice: number
  availableSeats: number
  nftTickets: NFTTicket[]
  images: Image[]
  date: string
  venue: string
}

interface NFTTicket {
  id: number
  mintAddress: string
  eventId: number
  ownerPublicKey: string
  ownerEmail: string
  metadata: string
}

interface Image {
  id: number
  url: string
  eventId: number
}

interface NFTListing {
  id: number
  ticketId: number
  sellerAddress: string
  price: number
  status: 'ACTIVE' | 'SOLD' | 'CANCELLED'
  createdAt: string
  updatedAt: string
  ticket: NFTTicket
}

export default function NFTTicketMarketplace() {
  const [listings, setListings] = useState<NFTListing[]>([])
  const [userListings, setUserListings] = useState<NFTListing[]>([])
  const [selectedListing, setSelectedListing] = useState<NFTListing | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(false)
  const [resalePrice, setResalePrice] = useState<string>('')
  const [events, setEvents] = useState<Event[]>([])
  const [userTickets, setUserTickets] = useState<NFTTicket[]>([])
  const { publicKey, connected, disconnect, signTransaction } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const connection = new Connection('https://api.devnet.solana.com')

  useEffect(() => {
    fetchEvents()
    fetchListings()
    if (connected && publicKey) {
      fetchUserListings()
      fetchUserTickets()
      updateBalance()
    }
  }, [connected, publicKey])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to fetch events')
    }
  }

  const fetchUserTickets = async () => {
    if (!publicKey) return
    try {
      const response = await fetch(`/api/tickets?owner=${publicKey.toString()}`)
      const data = await response.json()
      setUserTickets(data)
    } catch (error) {
      console.error('Error fetching user tickets:', error)
      toast.error('Failed to fetch your tickets')
    }
  }

  const updateBalance = async () => {
    if (publicKey) {
      try {
        const balance = await connection.getBalance(publicKey)
        setBalance(balance / LAMPORTS_PER_SOL)
      } catch (error) {
        console.error('Error fetching balance:', error)
        toast.error('Failed to fetch wallet balance')
      }
    }
  }

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/tickets/resell?status=ACTIVE')
      const data = await response.json()
      setListings(data)
    } catch (error) {
      console.error('Error fetching listings:', error)
      toast.error('Failed to fetch available listings')
    }
  }

  const fetchUserListings = async () => {
    if (!publicKey) return
    try {
      const response = await fetch(`/api/tickets/resell?seller=${publicKey.toString()}`)
      const data = await response.json()
      setUserListings(data)
    } catch (error) {
      console.error('Error fetching user listings:', error)
      toast.error('Failed to fetch your listings')
    }
  }

  const buyTicket = async (event: Event) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/tickets/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          buyerAddress: publicKey.toString(),
        }),
      })

      if (!response.ok) throw new Error('Purchase failed')
      
      toast.success('Ticket purchased successfully!')
      fetchUserTickets()
      updateBalance()
    } catch (error) {
      console.error('Error buying ticket:', error)
      toast.error('Failed to purchase ticket')
    } finally {
      setLoading(false)
    }
  }

  const listTicketForResale = async (ticket: NFTTicket) => {
    if (!connected || !publicKey || !resalePrice) {
      toast.error('Please connect your wallet and set a price')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/tickets/resell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId: ticket.id,
          sellerAddress: publicKey.toString(),
          price: parseFloat(resalePrice),
        }),
      })

      if (!response.ok) throw new Error('Listing failed')
      
      toast.success('Ticket listed for resale!')
      setResalePrice('')
      fetchUserListings()
    } catch (error) {
      console.error('Error listing ticket:', error)
      toast.error('Failed to list ticket')
    } finally {
      setLoading(false)
    }
  }

  const purchaseTicket = async (listing: NFTListing) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing.id,
          buyerAddress: publicKey.toString(),
        }),
      })

      if (!response.ok) throw new Error('Purchase failed')
      
      toast.success('Ticket purchased successfully!')
      fetchListings()
      fetchUserListings()
      updateBalance()
    } catch (error) {
      console.error('Error buying ticket:', error)
      toast.error('Failed to purchase ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 bg-background border-b">
        <h1 className="text-2xl font-bold">NFT Ticket Marketplace</h1>
        <div className="flex items-center space-x-4">
          {connected && publicKey ? (
            <div>
              <p className="text-green-600">
                Connected: {publicKey.toBase58().slice(0, 8)}...
              </p>
              <p className="text-sm text-gray-600">
                Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
              </p>
              <Button onClick={disconnect} className="mt-2 w-full">
                Disconnect
              </Button>
            </div>
          ) : (
            <div>
              <p className="mb-2">Connect wallet to purchase:</p>
              <WalletMultiButton className="w-full" />
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow p-6">
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy Tickets</TabsTrigger>
            <TabsTrigger value="sell">Your Tickets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy">
            <h2 className="text-3xl font-bold mb-4">Available Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      {new Date(event.date).toLocaleDateString()}
                      <br />
                      {event.venue}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {event.images[0] ? (
                      <img 
                        src={event.images[0].url} 
                        alt={event.title} 
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                        <Ticket className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Price: {event.ticketPrice} SOL</p>
                      <p className="text-sm text-gray-600">Available: {event.availableSeats}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full" 
                          disabled={!connected || loading}
                          onClick={() => setSelectedEvent(event)}
                        >
                          {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            'Buy Ticket'
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Purchase</DialogTitle>
                          <DialogDescription>
                            Review the details of your ticket purchase:
                          </DialogDescription>
                        </DialogHeader>
                        {selectedEvent && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Event</Label>
                              <div className="col-span-3">{selectedEvent.title}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Date</Label>
                              <div className="col-span-3">
                                {new Date(selectedEvent.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Price</Label>
                              <div className="col-span-3">{selectedEvent.ticketPrice} SOL</div>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button 
                            onClick={() => selectedEvent && buyTicket(selectedEvent)}
                            disabled={loading}
                          >
                            {loading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              'Confirm Purchase'
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sell">
            <h2 className="text-3xl font-bold mb-4">Your NFT Tickets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userTickets.map((ticket) => {
                const event = events.find(e => e.id === ticket.eventId)
                return (
                  <Card key={ticket.id}>
                    <CardHeader>
                      <CardTitle>{event?.title || 'Unknown Event'}</CardTitle>
                      <CardDescription>
                        Mint Address: {ticket.mintAddress.slice(0, 8)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {event?.images[0] ? (
                        <img 
                          src={event.images[0].url} 
                          alt={event.title} 
                          className="w-full h-32 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                          <Ticket className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full">
                            <Tag className="mr-2 h-4 w-4" />
                            List for Resale
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>List Ticket for Resale</DialogTitle>
                            <DialogDescription>
                              Set your asking price for this ticket
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="price" className="text-right">
                                Price (SOL)
                              </Label>
                              <Input
                                id="price"
                                type="number"
                                step="0.1"
                                min="0"
                                className="col-span-3"
                                value={resalePrice}
                                onChange={(e) => setResalePrice(e.target.value)}
                              />
                            </div>
                          </div><DialogFooter>
                            <Button
                              onClick={() => listTicketForResale(ticket)}
                              disabled={loading}
                            >
                              {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                'List Ticket'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Your Active Listings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {userListings.map((listing) => {
                  const event = events.find(e => e.id === listing.ticket.eventId)
                  return (
                    <Card key={listing.id}>
                      <CardHeader>
                        <CardTitle>{event?.title || 'Unknown Event'}</CardTitle>
                        <CardDescription>
                          Listed Price: {listing.price} SOL
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {event?.images[0] ? (
                          <img 
                            src={event.images[0].url} 
                            alt={event.title} 
                            className="w-full h-32 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                            <Ticket className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">
                            Listed: {new Date(listing.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {listing.status}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => cancelListing(listing.id)}
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            'Cancel Listing'
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="market">
            <h2 className="text-3xl font-bold mb-4">Secondary Market</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listings.map((listing) => {
                const event = events.find(e => e.id === listing.ticket.eventId)
                return (
                  <Card key={listing.id}>
                    <CardHeader>
                      <CardTitle>{event?.title || 'Unknown Event'}</CardTitle>
                      <CardDescription>
                        Resale Price: {listing.price} SOL
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {event?.images[0] ? (
                        <img 
                          src={event.images[0].url} 
                          alt={event.title} 
                          className="w-full h-32 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                          <Ticket className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          Event Date: {event ? new Date(event.date).toLocaleDateString() : 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Seller: {listing.sellerAddress.slice(0, 8)}...
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full"
                            disabled={!connected || loading || listing.sellerAddress === publicKey?.toString()}
                          >
                            {loading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              'Purchase Ticket'
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Purchase</DialogTitle>
                            <DialogDescription>
                              Review the details of your ticket purchase:
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Event</Label>
                              <div className="col-span-3">{event?.title}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Price</Label>
                              <div className="col-span-3">{listing.price} SOL</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Seller</Label>
                              <div className="col-span-3">{listing.sellerAddress.slice(0, 8)}...</div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() => purchaseTicket(listing)}
                              disabled={loading}
                            >
                              {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                'Confirm Purchase'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="p-4 border-t text-center text-sm text-muted-foreground">
        © 2024 NFT Ticket Marketplace. All rights reserved.
      </footer>
    </div>
  )
}
                            