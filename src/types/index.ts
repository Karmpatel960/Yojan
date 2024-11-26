export interface NFTListing {
    id: number
    eventId: number
    marketplaceId: number
    price: number
    status: 'ACTIVE' | 'SOLD' | 'CANCELLED' | 'EXPIRED'
    sellerAddress: string
    buyerAddress?: string
    mintAddress: string
    metadata: any
    createdAt: string
    updatedAt: string
    expiresAt?: string
    royaltyPercentage: number
    event?: Event
    saleHistory?: NFTSaleHistory[]
  }
  
  export interface NFTSaleHistory {
    id: number
    listingId: number
    sellerAddress: string
    buyerAddress: string
    price: number
    transactionHash: string
    saleDate: string
    marketplaceFee: number
    royaltyFee: number
  }
  