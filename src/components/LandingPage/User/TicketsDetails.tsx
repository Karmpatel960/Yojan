import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Ticket } from "lucide-react"

interface EventBoxProps {
  event: {
    id: number
    title: string
    nftTickets: NFTTicket[]
  }
}

interface NFTTicket {
  id: number
  mintAddress: string
  ownerPublicKey: string
  ownerEmail: string
  metadata: string
}

export default function EventBox({ event }: EventBoxProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-6 w-6" />
          {event.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">NFT Tickets</h3>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          {event.nftTickets.map((ticket) => (
            <Card key={ticket.id} className="mb-4 last:mb-0">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Mint Address:</span>
                    <Badge variant="outline">{ticket.mintAddress}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Owner:</span>
                    <span className="text-sm">{ticket.ownerEmail || ticket.ownerPublicKey}</span>
                  </div>
                  <div>
                    <span className="font-medium">Metadata:</span>
                    <p className="text-sm mt-1 text-muted-foreground">{ticket.metadata}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}