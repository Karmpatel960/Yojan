import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    
  try {
    const events = await prisma.event.findMany({
      include: {
        images: true,
        videos: true,
        gallery: true,
      },
    });
    console.log('Fetched events:', events); 
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error); 
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
