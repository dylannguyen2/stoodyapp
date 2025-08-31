'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './_components/Navbar';
import StickyNotes from './_components/inputs/StickyNotes';
import StoodyInput from './_components/inputs/StoodyInput';
import Notepad from './_components/timer/Notepad';

export default function PageClient() {
  const router = useRouter();
  const sessionCreationStates = ['name', 'stoody', 'shortBreak', 'longBreak', 'cycles'] as const;
  const options = [30,45,60,90];
  const [selected, setSelected] = useState(25);
  type SessionCreationState = (typeof sessionCreationStates)[number];

  const [name, setName] = useState(`Guest${Math.floor(Math.random() * 1000)}`);
  const [stoody, setStoody] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [cycles, setCycles] = useState(4);
  const [deviceId, setDeviceId] = useState('');

  type SessionCreateState = (typeof sessionCreationStates)[number];
  const [sessionCreateState, setSessionCreateState] = useState<SessionCreateState>(sessionCreationStates[0]);
  const [state, setState] = useState<SessionCreationState>(sessionCreationStates[0]);

  const prevSessionState = () => {
  setSessionCreateState((prev) => {
    const i = sessionCreationStates.indexOf(prev);
    const prevIndex = i > 0 ? i - 1 : 0;
    return sessionCreationStates[prevIndex] as SessionCreationState;
  });
};

  useEffect(() => {
    let id = localStorage.getItem('stoody_device_id');
    if (!id) {
      id = Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-4);
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

      const data = await res.json();
      console.log('Session creation response:', data);

      if (!res.ok || !data.sessionId) {
        alert('Failed to create session. Response: ' + JSON.stringify(data));
        return;
      }

      router.push(`/${data.sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Error creating session: ' + error);
    }
  };

  const nextSessionState = () => {
    setSessionCreateState((prev) => {
      const i = sessionCreationStates.indexOf(prev);
      const nextIndex = i >= 0 && i < sessionCreationStates.length - 1 ? i + 1 : sessionCreationStates.length - 1;
      return sessionCreationStates[nextIndex] as SessionCreationState;
    });
  };

  return (
    <div>
      <Notepad></Notepad>
      <Navbar></Navbar>
        <div className="pt-30">
          <h1 className="font-bold text-6xl flex justify-center">Study. Rest. Repeat.</h1>

          <div className="mt-8">
            {sessionCreateState === "name" && (
              <StickyNotes
                name={name}
                setName={setName}
                sessionCreateState={sessionCreateState}
                nextSessionState={nextSessionState}
              />
            )}
            {sessionCreateState === "stoody" && (
              <>
                <StoodyInput
                  value={stoody}
                  onChange={(v) => setStoody(v)}
                  options={options}
                  maxMinutes={120}
                  sessionCreateState={sessionCreateState}
                  nextSessionState={nextSessionState}
                  prevSessionState={prevSessionState}
                />
              </>
            )}
          </div>

        </div>
    </div>
  );
}
