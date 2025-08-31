'use client';

import { useEffect, useRef, useState } from 'react';
import Timer from '../_components/Timer';
import { useSearchParams, useParams } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SessionData {
  id?: string;
  guestName?: string;
  stoody?: number;
  shortBreak?: number;
  longBreak?: number;
  cycles?: number;
  error?: string;
}

const SessionPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const sessionId = params.sessionId;
  const guestNameFromUrl = searchParams.get('name') || 'Guest';

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/${sessionId}/heartbeat`, { method: 'POST' });
    }, 30000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/session/${sessionId}`);
        const data = await res.json();
        setSession(data);
      } catch (err) {
        console.error('Failed to load session', err);
        setSession({ error: 'Failed to load session' });
      }
    };

    fetchSession();
  }, [sessionId]);

  if (!session) return <p>Loading session...</p>;
  if (session.error) return <p>Session not found.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">
        🧠 {session.guestName || guestNameFromUrl}'s Pomodoro
      </h1>
      <Timer
        stoody={session.stoody ?? 25}
        shortBreak={session.shortBreak ?? 5}
        longBreak={session.longBreak ?? 15}
        cycles={session.cycles ?? 4}
      />
    </div>
  );
};

export default SessionPage;
