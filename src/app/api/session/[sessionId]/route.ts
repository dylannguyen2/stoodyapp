import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  _req: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> }
) {
  const params = await context.params;
  const sessionParam = params?.sessionId;
  const sessionId = typeof sessionParam === 'string' ? sessionParam : undefined;
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }
  console.log('Requested sessionId:', sessionId);

  const session = await prisma.guestSession.findUnique({
    where: { id: sessionId },
  });
  console.log('Query result:', session);

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json(session);
}
