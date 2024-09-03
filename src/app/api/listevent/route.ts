import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Parsed Request Data:', data);

    const {
      title,
      description,
      date,
      time,
      venue,
      category,
      tags,
      images,
      videos,
      organizerName,
      organizerContact,
      organizerEmail,
      ticketPrice,
      availableSeats,
      registrationLink,
      isFeatured,
      isPublic,
      instructions,
      createdById,
      cityId,
    } = data;

    const createdByIdInt = parseInt(createdById, 10);

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(`${date}T${time}`),
        venue,
        category,
        tags,
        organizerName,
        organizerContact,
        organizerEmail,
        ticketPrice,
        availableSeats,
        registrationLink,
        isFeatured,
        isPublic,
        instructions,
        createdById: createdByIdInt,
        cityId: parseInt(cityId, 10),
        images: {
          create: images.map((url: string) => ({ url })),
        },
        videos: {
          create: videos.map((url: string) => ({ url })),
        },
        gallery: {
          create: [
            ...images.map((url: string) => ({ url, type: 'IMAGE' })),
            ...videos.map((url: string) => ({ url, type: 'VIDEO' })),
          ],
        },
      },
      include: {
        images: true,
        videos: true,
        gallery: true,
      },
    });

    console.log('Created event:', event);
    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event', details: error.message }, { status: 500 });
  }
}