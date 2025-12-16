import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  _req: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> }
) {
  const params = await context.params;
  const sessionParam = params?.sessionId;
  const sessionId = typeof sessionParam === 'string' ? sessionParam : undefined;
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

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
