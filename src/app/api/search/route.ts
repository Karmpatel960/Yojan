import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { search } = Object.fromEntries(new URL(request.url).searchParams);

    let events;
    if (search) {
      events = await prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { city: { name: { contains: search, mode: 'insensitive' } } },
          ],
        },
        include: {
          images: true,
          videos: true,
          gallery: true,
          city: true,
        },
      });
    } else {
      events = await prisma.event.findMany({
        include: {
          images: true,
          videos: true,
          gallery: true,
          city: true,
        },
      });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
