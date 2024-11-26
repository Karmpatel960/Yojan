import React, { useState, useEffect } from 'react'
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
import { useWallet } from "@/hooks/useWallet";

export default function WalletMain() {
  const [amount, setAmount] = useState<string>('');
  const [operation, setOperation] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const { 
    balance, 
    transactions, 
    isWalletConnected, 
    hasWallet, 
    userDetails,
    handleOpenWallet, 
    handleCreateWallet, 
    handleImportWallet, 
    handleSubmitTransaction, 
    handleRequestAirdrop 
  } = useWallet();

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
                          <p><strong>Address:</strong> {userDetails?.address || 'null'}</p>
                          <p><strong>Balance:</strong> {userDetails?.balance || 'null'} SOL</p>
                          <p><strong>Private Key:</strong> {userDetails?.privateKey || 'null'}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <form onSubmit={handleSubmitTransaction} className="space-y-4">
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
                    {transactions.map((tx: Transaction) => (
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