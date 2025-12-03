import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RouteContext = { params: { sessionId: string } };

export async function POST(_req: NextRequest, { params }: RouteContext) {
  const { sessionId } = params;

  // Update lastActiveAt if session exists
  const result = await prisma.guestSession.updateMany({
    where: { id: sessionId },
    data: { lastActiveAt: new Date() },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
