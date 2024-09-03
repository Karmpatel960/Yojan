import { type NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const session = await db.session.findFirst({
      where: {
        refreshToken: token,
      },
      include: {
        user: true,
      },
    });

    if (!session || session.refreshExpiresAt < new Date()) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    console.log('session', session);

    return NextResponse.json({
      user: session.user,
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}




