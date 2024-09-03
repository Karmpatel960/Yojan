import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Wallet, Plus, Link, User, CloudRain } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function WalletMain() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [amount, setAmount] = useState('')
  const [operation, setOperation] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [userDetails, setUserDetails] = useState(null)
  const [privateKey, setPrivateKey] = useState('')
  const [hasWallet, setHasWallet] = useState(false)

  useEffect(() => {
    checkWalletStatus()
  }, [])

  const checkWalletStatus = async () => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getWalletDetails', userId: 1 }) // Assuming userId 1
      })
      if (response.ok) {
        setHasWallet(true)
      }
    } catch (error) {
      console.error('Error checking wallet status:', error)
    }
  }

  const handleOpenWallet = async () => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getWalletDetails', userId: 1 }) // Assuming userId 1
      })
      const data = await response.json()
      if (response.ok) {
        setIsWalletConnected(true)
        setUserDetails(data)
        setBalance(data.balance)
        fetchTransactions()
      } else {
        alert('Failed to open wallet. Please try again.')
      }
    } catch (error) {
      console.error('Error opening wallet:', error)
      alert('Failed to open wallet. Please try again.')
    }
  }

  const handleCreateWallet = async () => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', userId: 1 }) // Assuming userId 1
      })
      const data = await response.json()
      if (response.ok) {
        setIsWalletConnected(true)
        setUserDetails(data)
        setBalance(data.balance)
        setHasWallet(true)
        alert('New wallet created successfully!')
        fetchTransactions()
      } else {
        alert(`Failed to create wallet: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creating wallet:', error)
      alert('Failed to create wallet. Please try again.')
    }
  }

  const handleImportWallet = async () => {
    if (!privateKey) {
      alert('Please enter a private key to import.')
      return
    }
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import',
          userId: 1, // Assuming userId 1
          encryptedPrivateKey: JSON.stringify(Array.from(new TextEncoder().encode(privateKey)))
        })
      })
      const data = await response.json()
      if (response.ok) {
        setIsWalletConnected(true)
        setUserDetails(data)
        setBalance(data.balance)
        setHasWallet(true)
        alert('Wallet imported successfully!')
        fetchTransactions()
      } else {
        alert(`Failed to import wallet: ${data.error}`)
      }
    } catch (error) {
      console.error('Error importing wallet:', error)
      alert('Failed to import wallet. Please try again.')
    }
  }

  const handleRequestAirdrop = async () => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'requestAirdrop', userId: 1 }) // Assuming userId 1
      })
      const data = await response.json()
      if (response.ok) {
        alert(`Airdrop successful! Received 2 SOL.`)
        setBalance(data.newBalance)
        fetchTransactions()
      } else {
        alert(`Airdrop failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Error requesting airdrop:', error)
      alert('Failed to request airdrop. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !operation) return

    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          userId: 1, // Assuming userId 1
          amount: parseFloat(amount),
          toAddress: operation === 'send' ? toAddress : null
        })
      })
      const data = await response.json()
      if (response.ok) {
        alert(`Transaction submitted: ${operation} ${amount} SOL`)
        setBalance(data.wallet.balance)
        fetchTransactions()
      } else {
        alert(`Transaction failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Error submitting transaction:', error)
      alert('Failed to submit transaction. Please try again.')
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getTransactions', userId: 1 }) // Assuming userId 1
      })
      const data = await response.json()
      if (response.ok) {
        setTransactions(data.transactions)
      } else {
        console.error('Failed to fetch transactions:', data.error)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  return (
    <div>
      <TabsContent value="wallet" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Solana Wallet (Devnet)</CardTitle>
            <CardDescription>Manage your Solana transactions on Devnet</CardDescription>
          </CardHeader>
          <CardContent>
            {isWalletConnected ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">{balance} SOL</p>
                    <p className="text-sm text-muted-foreground">≈ ${balance * 10} USD</p>
                  </div>
                  <div className="space-x-2">
                    <Button onClick={handleRequestAirdrop} variant="outline">
                      <CloudRain className="mr-2 h-4 w-4" /> Request Airdrop
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <User className="mr-2 h-4 w-4" /> Account Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Account Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                          <p><strong>Address:</strong> {userDetails?.address}</p>
                          <p><strong>Balance:</strong> {userDetails?.balance} SOL</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (SOL)</Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="amount" 
                        placeholder="0.00" 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <Select onValueChange={setOperation}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select operation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="send">Send</SelectItem>
                          <SelectItem value="receive">Receive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {operation === 'send' && (
                    <div>
                      <Label htmlFor="toAddress">To Address</Label>
                      <Input 
                        id="toAddress" 
                        placeholder="Recipient's Solana address" 
                        value={toAddress}
                        onChange={(e) => setToAddress(e.target.value)}
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full">Submit Transaction</Button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center">
                  {hasWallet 
                    ? "You have an existing wallet. Open it to start transacting." 
                    : "Create or import a wallet to get started"}
                </p>
                <div className="flex justify-center space-x-4">
                  {hasWallet ? (
                    <Button onClick={handleOpenWallet}>
                      <Link className="mr-2 h-4 w-4" /> Open Wallet
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleCreateWallet}>
                        <Plus className="mr-2 h-4 w-4" /> Create Wallet
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Wallet className="mr-2 h-4 w-4" /> Import Wallet
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Import Wallet</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Label htmlFor="privateKey">Private Key</Label>
                            <Input 
                              id="privateKey" 
                              type="password"
                              placeholder="Enter your private key" 
                              value={privateKey}
                              onChange={(e) => setPrivateKey(e.target.value)}
                            />
                            <Button onClick={handleImportWallet} className="w-full">Import</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {isWalletConnected && (
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent Solana transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount (SOL)</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx: any) => (
                      <TableRow key={tx.id}>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell>{tx.amount} SOL</TableCell>
                        <TableCell>{new Date(tx.date).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </div>
  )
}