import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { nftTokenId } = await req.json();
    const eventId = parseInt(params.id);

    if (!eventId || !nftTokenId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Update the event with the nftTokenId
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { nftTokenId },
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}
