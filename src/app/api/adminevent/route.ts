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

    const events = await prisma.event.findMany({
      where: {
        createdById: Number(userId) // Ensure the userId is a number if necessary
      },
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
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching events' }, { status: 500 });
  }
}
