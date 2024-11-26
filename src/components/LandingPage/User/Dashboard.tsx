'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Ticket, Plus, Calendar } from 'lucide-react'
import EventPage from '@/components/LandingPage/User/Event'
import Tickets from './Tickets'
import NFTTicketMarketplace from '@/components/MarketPlace/marketplace'
import { useRouter } from 'next/navigation'



// Simulated wallet connection function
const connectWallet = async (type: string) => {
  // In a real application, this would interact with the Solana wallet adapter
  console.log(`Connecting ${type} wallet...`)
  return { address: '7fUAJdStEuGbc3sM84cKRL6yYaaSstyLSU', balance: 5.23 }
}

const tickets = [
  { id: 1, eventName: 'Summer Music Festival', date: '2023-07-15', price: 0.5 },
  { id: 2, eventName: 'Tech Conference 2023', date: '2023-08-22', price: 0.75 },
  { id: 3, eventName: 'Blockchain Summit', date: '2023-09-10', price: 1 },
]

const suggestedEvents = [
  { id: 4, eventName: 'AI Symposium', date: '2023-10-05', price: 0.8 },
  { id: 5, eventName: 'Crypto Art Exhibition', date: '2023-10-20', price: 0.3 },
  { id: 6, eventName: 'DeFi Workshop', date: '2023-11-15', price: 0.6 },
]

export default function UserDashboard() {
  const [wallet, setWallet] = useState<{ address: string; balance: number } | null>(null)
  const [activeTab, setActiveTab] = useState('suggested')
  const router = useRouter();



  // useEffect(() => {
  //   // Attempt to reconnect wallet on component mount
  //   const savedWallet = localStorage.getItem('wallet')
  //   if (savedWallet) {
  //     setWallet(JSON.parse(savedWallet))
  //   }
  // }, [])

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
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"> */}
        {/* <h1 className="text-3xl font-bold mb-4 md:mb-0">Welcome to Your Dashboard</h1>
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
        </div> */}
{/* 
      //   <NavUser/> */}
      {/* // </div> */}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="suggested">Suggested Events</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="wallet">MarketPlace</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets" className="space-y-4">
          <Tickets/>
        </TabsContent>
        <TabsContent value="suggested" className="space-y-4">
        <EventPage/>
        </TabsContent>
        <TabsContent value="wallet">
          <Card>
            <CardContent className="space-y-4">
              <NFTTicketMarketplace/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {activeTab === 'tickets' && (
        <div className="mt-8">
          <Button onClick={()=>{router.push('/events')}}>
            <Plus className="mr-2 h-4 w-4" /> Buy New Ticket
          </Button>
        </div>
      )}
    </div>
  )
}