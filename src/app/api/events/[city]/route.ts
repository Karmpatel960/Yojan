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
      where: { cityId: city.id },
      include: {
        images: true,
        videos: true,
        gallery: true,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}


