import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export async function POST(request: NextRequest) {
    try {
      const { listingId, buyerAddress } = await request.json()
  
      // Get listing with marketplace fees
      const listing = await prisma.nFTListing.findUnique({
        where: { id: listingId },
        include: {
          marketplace: true,
          event: true,
        },
      })
  
      if (!listing || listing.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'Listing not available' }, { status: 400 })
      }
  
      // Calculate fees
      const marketplaceFee = Number(listing.price) * Number(listing.marketplace.marketFees) / 100
      const royaltyFee = Number(listing.price) * Number(listing.royaltyPercentage) / 100
  
      // Update listing and create records in transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Update listing status
        const updatedListing = await prisma.nFTListing.update({
          where: { id: listingId },
          data: {
            status: 'SOLD',
            buyerAddress,
            updatedAt: new Date(),
          },
        })
  
        // Update NFT ticket ownership
        await prisma.nFTTicket.update({
          where: { mintAddress: listing.mintAddress },
          data: {
            ownerPublicKey: buyerAddress,
          },
        })
  
        // Create sale history
        const saleHistory = await prisma.nFTSaleHistory.create({
          data: {
            listingId,
            sellerAddress: listing.sellerAddress,
            buyerAddress,
            price: listing.price,
            marketplaceFee,
            royaltyFee,
            transactionHash: '', // To be updated after blockchain confirmation
          },
        })
  
        // Record activity
        await prisma.nFTActivity.create({
          data: {
            listingId,
            activityType: 'SALE',
            fromAddress: listing.sellerAddress,
            toAddress: buyerAddress,
            price: listing.price,
          },
        })
  
        return { updatedListing, saleHistory }
      })
  
      return NextResponse.json({
        success: true,
        data: result,
        message: 'Purchase successful',
      })
    } catch (error) {
      console.error('Error processing purchase:', error)
      return NextResponse.json({ error: 'Failed to process purchase' }, { status: 500 })
    }
  }