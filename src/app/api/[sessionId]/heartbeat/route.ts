import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await context.params;

  // Update lastActiveAt to now
  await prisma.guestSession.update({
    where: { id: sessionId },
    data: { lastActiveAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
