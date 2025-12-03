import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RouteContext = {
  params: {
    sessionId: string;
  };
};

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { sessionId } = params;
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
