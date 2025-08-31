import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
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
  const session = await prisma.guestSession.create({
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
