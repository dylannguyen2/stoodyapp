'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './../_components/Navbar';

type CreateSessionResponse = {
  sessionId?: string;
};

export default function PageClient() {
  const router = useRouter();

  const [name, setName] = useState(`Guest${Math.floor(Math.random() * 1000)}`);
  const [stoody, setStoody] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [cycles, setCycles] = useState(4);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    const existingId = localStorage.getItem('stoody_device_id');
    const id = existingId ?? `${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36).slice(-4)}`;
    if (!existingId) {
      localStorage.setItem('stoody_device_id', id);
    }
    setDeviceId(id);
  }, []);

  const handleStartSession = async () => {
    try {
      const res = await fetch('/api/session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, stoody, shortBreak, longBreak, cycles, deviceId }),
      });

      const data = (await res.json()) as CreateSessionResponse;
      console.log('Session creation response:', data);

      if (!res.ok || !data.sessionId) {
        alert('Failed to create session. Response: ' + JSON.stringify(data));
        return;
      }

      // Redirect to the session page
      router.push(`/${data.sessionId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Error creating session:', message);
      alert('Error creating session: ' + message);
    }
  };

  return (
    <div>
      <Navbar></Navbar>
        <div className="pt-30">
          <h1 className="font-bold text-6xl flex justify-center">Study. Rest. Repeat.</h1>
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
              <h1 className="text-3xl font-bold mb-6">🧠 Stoody Pomodoro</h1>
              <label className="block font-semibold mb-1">Your Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />

              <label className="block font-semibold mb-1">Stoody Time (minutes):</label>
              <input
                type="number"
                value={stoody}
                onChange={(e) => setStoody(Number(e.target.value))}
                className="w-full p-2 mb-4 border rounded"
              />

              <label className="block font-semibold mb-1">Short Break (minutes):</label>
              <input
                type="number"
                value={shortBreak}
                onChange={(e) => setShortBreak(Number(e.target.value))}
                className="w-full p-2 mb-4 border rounded"
              />

              <label className="block font-semibold mb-1">Long Break (minutes):</label>
              <input
                type="number"
                value={longBreak}
                onChange={(e) => setLongBreak(Number(e.target.value))}
                className="w-full p-2 mb-4 border rounded"
              />

              <label className="block font-semibold mb-1">Cycles:</label>
              <input
                type="number"
                value={cycles}
                onChange={(e) => setCycles(Number(e.target.value))}
                className="w-full p-2 mb-6 border rounded"
              />

              <button
                onClick={handleStartSession}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Start Session
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}
