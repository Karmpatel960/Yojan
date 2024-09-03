'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Wallet, Ticket, Plus } from 'lucide-react'

// Simulated wallet connection function
const connectWallet = async (type: string) => {
  // In a real application, this would interact with the Solana wallet adapter
  console.log(`Connecting ${type} wallet...`)
  return { address: '7fUAJdStEuGbc3sM84cKRL6yYaaSstyLSU', balance: 5.23 }
}

// Simulated ticket data
const tickets = [
  { id: 1, eventName: 'Summer Music Festival', date: '2023-07-15', price: 0.5 },
  { id: 2, eventName: 'Tech Conference 2023', date: '2023-08-22', price: 0.75 },
  { id: 3, eventName: 'Blockchain Summit', date: '2023-09-10', price: 1 },
]

export default function UserDashboard() {
  const [wallet, setWallet] = useState<{ address: string; balance: number } | null>(null)
  const [activeTab, setActiveTab] = useState('tickets')

  useEffect(() => {
    // Attempt to reconnect wallet on component mount
    const savedWallet = localStorage.getItem('wallet')
    if (savedWallet) {
      setWallet(JSON.parse(savedWallet))
    }
  }, [])

  const handleConnectWallet = async (type: string) => {
    try {
      const connectedWallet = await connectWallet(type)
      setWallet(connectedWallet)
      localStorage.setItem('wallet', JSON.stringify(connectedWallet))
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const handleDisconnectWallet = () => {
    setWallet(null)
    localStorage.removeItem('wallet')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Welcome to Your Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          {wallet ? (
            <div className="text-sm">
              <p className="font-medium">{wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}</p>
              <p className="text-muted-foreground">{wallet.balance} SOL</p>
            </div>
          ) : (
            <Button onClick={() => handleConnectWallet('phantom')}>Connect Wallet</Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets" className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader>
                <CardTitle>{ticket.eventName}</CardTitle>
                <CardDescription>{ticket.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{ticket.price} SOL</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Details</CardTitle>
              <CardDescription>Manage your Solana wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {wallet ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Address:</span>
                    <span className="text-muted-foreground">{wallet.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Balance:</span>
                    <span className="text-2xl font-bold">{wallet.balance} SOL</span>
                  </div>
                  <Button onClick={handleDisconnectWallet} variant="destructive" className="w-full">
                    Disconnect Wallet
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Button onClick={() => handleConnectWallet('phantom')} className="w-full">
                    <Wallet className="mr-2 h-4 w-4" /> Connect Phantom Wallet
                  </Button>
                  <Button onClick={() => handleConnectWallet('solflare')} className="w-full">
                    <Wallet className="mr-2 h-4 w-4" /> Connect Solflare Wallet
                  </Button>
                  <Button onClick={() => handleConnectWallet('sollet')} className="w-full">
                    <Wallet className="mr-2 h-4 w-4" /> Connect Sollet Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {activeTab === 'tickets' && (
        <div className="mt-8">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Buy New Ticket
          </Button>
        </div>
      )}
    </div>
  )
}