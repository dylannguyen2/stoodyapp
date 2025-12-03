import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(_req: NextRequest, context: { params: { sessionId: string } }) {
  const { params } = context;
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
