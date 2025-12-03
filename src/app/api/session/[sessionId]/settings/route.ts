import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RouteContext = { params: { sessionId: string } };

type SessionSettings = {
  stoody: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
};

const isValidSettings = (value: unknown): value is SessionSettings => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  const isPositive = (val: unknown) => typeof val === 'number' && Number.isFinite(val) && val > 0;
  return isPositive(obj.stoody) && isPositive(obj.shortBreak) && isPositive(obj.longBreak) && isPositive(obj.cycles);
};

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { sessionId } = params;
  try {
    const body = (await req.json()) as unknown;
    if (!isValidSettings(body)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const updated = await prisma.guestSession.update({
      where: { id: sessionId },
      data: {
        stoody: body.stoody,
        shortBreak: body.shortBreak,
        longBreak: body.longBreak,
        cycles: body.cycles,
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Failed to update session settings', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
