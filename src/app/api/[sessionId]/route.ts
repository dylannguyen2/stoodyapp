import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, context: { params: { sessionId: string } }) {
  const sessionId = context.params.sessionId;
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
