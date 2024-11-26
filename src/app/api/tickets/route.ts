import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID not provided' }, { status: 400 });
    }

    console.log(`Fetching NFT tickets for user ID: ${userId}...`);

    // Fetch events created by the user and include NFT tickets
    const events = await prisma.event.findMany({
      include: {
        // nftTickets: {
        //   where: { ownerPublicKey: userId }, // Assuming ownerPublicKey relates to the user's public key
        // },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true,
        videos: true,
        gallery: true,
        comments: true,
        transactions: true,
        nftTickets: true,
        city: true,
      },
      where: {
        isCancelled: false, // Fetch only events created by the user
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    console.log(`Found ${events.length} events for user ID: ${userId}`);

    if (events.length === 0) {
      console.log('No events found for this user.');
    }

    const transformedEvents = events.map(event => ({
      ...event,
      date: event.date.toISOString(),
      time: event.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      gallery: [
        ...event.images.map(image => ({ ...image, type: 'IMAGE' as const })),
        ...event.videos.map(video => ({ ...video, type: 'VIDEO' as const })),
        ...event.gallery,
      ],
      comments: event.comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
      })),
      transactions: event.transactions.map(transaction => ({
        ...transaction,
        date: transaction.date.toISOString(),
      })),
      nftTickets: event.nftTickets, // Directly include fetched NFT tickets
    }));

    console.log('Transformed events with NFT tickets:', transformedEvents);

    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
