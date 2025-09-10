import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await context.params;
  try {
    const body = await req.json();
    const { stoody, shortBreak, longBreak, cycles } = body ?? {};

    if (
      typeof stoody !== 'number' || stoody < 1 ||
      typeof shortBreak !== 'number' || shortBreak < 1 ||
      typeof longBreak !== 'number' || longBreak < 1 ||
      typeof cycles !== 'number' || cycles < 1
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const updated = await prisma.guestSession.update({
      where: { id: sessionId },
      data: {
        stoody,
        shortBreak,
        longBreak,
        cycles,
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Failed to update session settings', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
