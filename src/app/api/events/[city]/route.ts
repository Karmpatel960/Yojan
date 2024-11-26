import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { city: string } }) {
  try {
    const cityName = params.city;

    // Fetch city by name to get cityId
    const city = await prisma.city.findUnique({
      where: { name: cityName },
    });

    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    const events = await prisma.event.findMany({
      include: {
        images: true,
        videos: true,
        gallery: true,
        comments: true,
        nftTickets: true,
        transactions: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        city: true,
      },
      where: {
        cityId: city.id,
        isCancelled: false,
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

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
    }));

    console.log('Fetched events:', transformedEvents);

    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

