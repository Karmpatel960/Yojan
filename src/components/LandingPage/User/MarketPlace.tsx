// components/NFTMarketplace.tsx
'use client'
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface NFTTicket {
  id: number
  mintAddress: string
  ownerPublicKey: string
  ownerEmail: string
  metadata: string
}

const NFTMarketplace: React.FC = () => {
  const [nftTickets, setNftTickets] = useState<NFTTicket[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNFTTickets = async () => {
      try {
        const response = await fetch('/api/tickets', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch NFT tickets')
        }
        
        const data = await response.json()
        setNftTickets(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNFTTickets()
  }, [])

  const handleListTicket = async (ticketId: number) => {
    // Handle the logic to list the ticket for sale
    // This can involve making a call to an API to update the ticket's status
    console.log(`Listing ticket ${ticketId} for sale...`)
  }

  if (loading) {
    return <p>Loading your NFT tickets...</p>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your NFT Tickets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nftTickets.length > 0 ? (
          nftTickets.map((ticket) => (
            <div key={ticket.id} className="border p-4 rounded">
              <h3 className="text-lg font-semibold">{ticket.metadata}</h3>
              <Button onClick={() => handleListTicket(ticket.id)}>List for Sale</Button>
            </div>
          ))
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No NFT Tickets</AlertTitle>
            <AlertDescription>You have no NFT tickets to sell.</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

export default NFTMarketplace
