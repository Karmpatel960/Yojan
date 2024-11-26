import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { eventId, sellerAddress, price, mintAddress, metadata } = await request.json()

    // Verify the event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Create new NFT listing
    const listing = await prisma.nFTListing.create({
      data: {
        eventId,
        marketplaceId: 1, // Assuming default marketplace
        price,
        sellerAddress,
        mintAddress,
        metadata,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
      },
    })

    // Record activity
    await prisma.nFTActivity.create({
      data: {
        listingId: listing.id,
        activityType: 'LISTED',
        fromAddress: sellerAddress,
        price,
      },
    })

    return NextResponse.json(listing)
  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const seller = searchParams.get('seller')

    const listings = await prisma.nFTListing.findMany({
      where: {
        status: status as ListingStatus || 'ACTIVE',
        sellerAddress: seller || undefined,
      },
      include: {
        event: {
          include: {
            images: true,
          },
        },
        saleHistory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}