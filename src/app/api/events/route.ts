// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function GET(request: NextRequest) {
//   try {
//     const events = await prisma.event.findMany({
//       include: {
//         images: true,
//         videos: true,
//         gallery: true,
//         comments: true,
//         nftTickets: true,
//         transactions: true,
//         createdBy: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         city: true,
//       },
//       where: {
//         isCancelled: false,
//         date: {
//           gte: new Date(),
//         },
//       },
//       orderBy: {
//         date: 'asc',
//       },
//     });

//     const transformedEvents = events.map(event => ({
//       ...event,
//       date: event.date.toISOString(),
//       time: event.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
//       createdAt: event.createdAt.toISOString(),
//       updatedAt: event.updatedAt.toISOString(),
//       gallery: [
//         ...event.images.map(image => ({ ...image, type: 'IMAGE' as const })),
//         ...event.videos.map(video => ({ ...video, type: 'VIDEO' as const })),
//         ...event.gallery,
//       ],
//       comments: event.comments.map(comment => ({
//         ...comment,
//         createdAt: comment.createdAt.toISOString(),
//       })),
//       transactions: event.transactions.map(transaction => ({
//         ...transaction,
//         date: transaction.date.toISOString(),
//       })),
//     }));

//     console.log('Fetched events:', transformedEvents);

//     return NextResponse.json(transformedEvents);
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch events' },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching events from database...');
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
        isCancelled: false,
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    console.log(`Found ${events.length} events`);

    if (events.length === 0) {
      console.log('No events found. Checking database for any events...');
      const allEvents = await prisma.event.findMany({
        select: {
          id: true,
          title: true,
          date: true,
          isCancelled: true,
        },
      });
      console.log('All events in database:', allEvents);
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
    }));

    console.log('Transformed events:', transformedEvents);

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