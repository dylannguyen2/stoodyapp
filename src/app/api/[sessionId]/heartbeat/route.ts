import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, context: any) {
  const { sessionId } = context.params; // Next.js guarantees this exists

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
