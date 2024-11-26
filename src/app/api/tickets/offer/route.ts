import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
      const { listingId, buyerAddress, offerPrice, expiresAt } = await request.json()
  
      const offer = await prisma.nFTOffer.create({
        data: {
          listingId,
          buyerAddress,
          offerPrice,
          expiresAt: new Date(expiresAt),
        },
      })
  
      await prisma.nFTActivity.create({
        data: {
          listingId,
          activityType: 'OFFER_MADE',
          fromAddress: buyerAddress,
          price: offerPrice,
        },
      })
  
      return NextResponse.json(offer)
    } catch (error) {
      console.error('Error creating offer:', error)
      return NextResponse.json(
        { error: 'Failed to create offer' },
        { status: 500 }
      )
    }
  }