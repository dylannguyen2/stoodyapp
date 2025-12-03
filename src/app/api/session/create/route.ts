import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

type CreateSessionBody = {
  name: string;
  stoody: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
  deviceId?: string;
};

const isPositiveNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0;

const parseCreateSessionBody = (value: unknown): CreateSessionBody | null => {
  if (typeof value !== 'object' || value === null) return null;
  const obj = value as Record<string, unknown>;
  if (!isPositiveNumber(obj.stoody) || !isPositiveNumber(obj.shortBreak) || !isPositiveNumber(obj.longBreak) || !isPositiveNumber(obj.cycles)) {
    return null;
  }
  const rawName = typeof obj.name === 'string' && obj.name.trim().length > 0 ? obj.name.trim() : 'Guest';
  const deviceId = typeof obj.deviceId === 'string' && obj.deviceId.trim().length > 0 ? obj.deviceId.trim() : undefined;
  return {
    name: rawName,
    stoody: obj.stoody,
    shortBreak: obj.shortBreak,
    longBreak: obj.longBreak,
    cycles: obj.cycles,
    deviceId,
  };
};

export async function POST(req: NextRequest) {
  const rawBody = (await req.json()) as unknown;
  const body = parseCreateSessionBody(rawBody);
  if (!body) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { name, stoody, shortBreak, longBreak, cycles, deviceId } = body;

  // Restrict to 3 active sessions per device
  if (deviceId) {
    const activeSessions = await prisma.guestSession.count({
      where: { deviceId }
    });
    if (activeSessions >= 3) {
      return NextResponse.json({ error: 'Session limit reached for this device.' }, { status: 403 });
    }
  }

  // Generate a short 8-character session ID
  const sessionId = uuidv4().replace(/-/g, '').slice(0, 8);

  // Create a new GuestSession in the database
  await prisma.guestSession.create({
    data: {
      id: sessionId,
      guestName: name,
      stoody,
      shortBreak,
      longBreak,
      cycles,
      deviceId,
    },
  });

  // Return the sessionId for routing
  return NextResponse.json({ sessionId });
}
