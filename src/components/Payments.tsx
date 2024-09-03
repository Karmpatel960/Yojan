'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Wallet } from 'lucide-react'

export default function Component() {
  const [walletAddress, setWalletAddress] = useState('')
  const [balance, setBalance] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    // Simulating login process
    setIsLoggedIn(true)
    setBalance(10) // Mock initial balance
  }

  const handleCreateWallet = () => {
    // Simulating wallet creation
    const newAddress = 'Sol' + Math.random().toString(36).substring(2, 15)
    setWalletAddress(newAddress)
  }

  const handleImportWallet = (address: string) => {
    // Simulating wallet import
    setWalletAddress(address)
  }

  const handleTransaction = (amount: number) => {
    // Simulating transaction
    if (balance >= amount) {
      setBalance(prevBalance => prevBalance - amount)
      alert('Transaction successful!')
    } else {
      alert('Insufficient funds!')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Solana Payments Workshop</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>Date:</strong> June 15, 2023</p>
            <p><strong>Time:</strong> 2:00 PM - 5:00 PM</p>
            <p><strong>Location:</strong> Virtual</p>
            <p><strong>SOL Required:</strong> 5 SOL</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleTransaction(5)} disabled={!isLoggedIn || balance < 5}>
              Pay 5 SOL to Attend
            </Button>
          </CardFooter>
        </Card>

        {/* Wallet Section */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet</CardTitle>
            <CardDescription>Manage your Solana wallet</CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoggedIn ? (
              <Button onClick={handleLogin} className="w-full">Login to Access Wallet</Button>
            ) : (
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">Create Wallet</TabsTrigger>
                  <TabsTrigger value="import">Import Wallet</TabsTrigger>
                </TabsList>
                <TabsContent value="create">
                  <div className="space-y-4">
                    <Button onClick={handleCreateWallet} className="w-full">Create New Wallet</Button>
                    {walletAddress && (
                      <div className="p-4 border rounded-md">
                        <p className="font-semibold">Wallet Address:</p>
                        <p className="break-all">{walletAddress}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="import">
                  <div className="space-y-4">
                    <Label htmlFor="importAddress">Import Existing Wallet</Label>
                    <Input
                      id="importAddress"
                      placeholder="Enter wallet address"
                      onChange={(e) => handleImportWallet(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          {isLoggedIn && (
            <CardFooter className="flex flex-col items-start space-y-4">
              <div className="flex items-center space-x-2">
                <Wallet className="h-4 w-4" />
                <span>Balance: {balance} SOL</span>
              </div>
              {balance < 5 && (
                <div className="flex items-center space-x-2 text-yellow-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>Insufficient balance for the event</span>
                </div>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}