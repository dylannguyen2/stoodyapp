'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './_components/Navbar';
import React from 'react';
import TimeButtons from './_components/inputs/TimeButtons';
import { useLocalStorage } from './_components/hooks/useLocalStorage';
import LastPresetCard from './_components/cards/LastPresetCard';
import FreshStartCard from './_components/cards/FreshStartCard';
import SessionInput from './_components/inputs/SessionInput';
import StateButtons from './_components/inputs/StateButtons';

export default function PageClient() {
  const router = useRouter();
  const sessionCreationStates = ['cached','name', 'stoody', 'shortBreak', 'longBreak', 'cycles'] as const;
  type SessionCreationState = (typeof sessionCreationStates)[number];

  // ----------------------
  // Local storage state
  // ----------------------
  const [name, setName] = useLocalStorage<string>('stoody_name', 'Guest');
  const [stoody, setStoody] = useLocalStorage<number>('stoody_stoody', 25);
  const [shortBreak, setShortBreak] = useLocalStorage<number>('stoody_shortBreak', 15);
  const [longBreak, setLongBreak] = useLocalStorage<number>('stoody_longBreak', 30);
  const [cycles, setCycles] = useLocalStorage<number>('stoody_cycles', 2);
  const [deviceId, setDeviceId] = useLocalStorage<string>('stoody_device_id', '');

  const [sessionCreateState, setSessionCreateState] = useState<SessionCreationState>(sessionCreationStates[1]);
  const [isExiting, setIsExiting] = useState(false);
  const [hasCachedPreset, setHasCachedPreset] = useState<boolean>(false);

  // ----------------------
  // Client-side hydration
  // ----------------------
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const cached = localStorage.getItem('stoody_session_cached');
      if (cached) {
        const obj = JSON.parse(cached);
        if (obj.name) setName(obj.name);
        if (typeof obj.stoody === 'number') setStoody(obj.stoody);
        if (typeof obj.shortBreak === 'number') setShortBreak(obj.shortBreak);
        if (typeof obj.longBreak === 'number') setLongBreak(obj.longBreak);
        if (typeof obj.cycles === 'number') setCycles(obj.cycles);
        setHasCachedPreset(true);
        setSessionCreateState('cached');
        return;
      }
    } catch (e) {
    }

    setHasCachedPreset(false);
    if (!localStorage.getItem('stoody_name')) {
      const gen = generateRandomName();
      setName(gen);
    }
  }, [hydrated]);

  // Generate deviceId only on client
  useEffect(() => {
    if (!hydrated) return;
    if (!deviceId) {
      const id = Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-4);
      setDeviceId(id);
    }
  }, [hydrated, deviceId, setDeviceId]);

  function generateRandomName() {
    const ADJ = ['Sunny','Brave','Calm','Mighty','Quiet','Breezy','Clever','Lucky'];
    const NOUN = ['Fox','Otter','Dolphin','Falcon','Panda','Hawk','Koala','Badger'];
    const a = ADJ[Math.floor(Math.random() * ADJ.length)];
    const n = NOUN[Math.floor(Math.random() * NOUN.length)];
    const num = Math.floor(Math.random() * 900) + 100;
    return `${a}${n}${num}`;
  }

  // ----------------------
  // Session navigation
  // ----------------------
  const prevSessionState = () => {
    setSessionCreateState((prev) => {
      const i = sessionCreationStates.indexOf(prev);
      const prevIndex = i > 0 ? i - 1 : 0;
      return sessionCreationStates[prevIndex] as SessionCreationState;
    });
};

  const nextSessionState = () => {
    setSessionCreateState((prev) => {
      const i = sessionCreationStates.indexOf(prev);
      const nextIndex = i >= 0 && i < sessionCreationStates.length - 1 ? i + 1 : sessionCreationStates.length - 1;
      return sessionCreationStates[nextIndex] as SessionCreationState;
    });
  };

  const exitedRef = React.useRef(false);
  const dirRef = React.useRef<'next' | 'prev'>('next');
  const handleOnExited = () => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    setIsExiting(false);
    dirRef.current === 'next' ? nextSessionState() : prevSessionState();
  };

  const handleNextClick = () => {
    if (isExiting) return;
    dirRef.current = 'next';
    exitedRef.current = false;
    setIsExiting(true);
  };
  const handlePrevClick = () => {
    if (isExiting) return;
    dirRef.current = 'prev';
    exitedRef.current = false;
    setIsExiting(true);
  };

  // ----------------------
  // Start session
  // ----------------------
  const handleStartSession = async () => {
    try {
      const res = await fetch('/api/session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, stoody, shortBreak, longBreak, cycles, deviceId }),
      });
      const data = await res.json();
      if (!res.ok || !data.sessionId) {
        alert('Failed to create session. Response: ' + JSON.stringify(data));
        return;
      }
      try {
        const payload = { name, stoody, shortBreak, longBreak, cycles, cachedAt: Date.now() };
        localStorage.setItem('stoody_session_cached', JSON.stringify(payload));
      } catch (e) {
      }
      router.push(`/session/${data.sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Error creating session: ' + error);
    }
  };

  const applyDefaultPreset = () => {
    setStoody(25);
    setShortBreak(15);
    setLongBreak(30);
    setCycles(2);
    setSessionCreateState('name');
  };

  return (
    <div className="min-h-screen flex flex-col pt-[80px]">
      <Navbar />
      {/* Headings take up half the space above input */}
      <div className="flex items-center justify-center text-center mt-12 border border-red-500">
        <div>
          <h1 className="font-bold text-6xl">Study. Rest. Repeat.</h1>
          <h1 className="font-bold text-3xl gochi-hand-regular mt-2">
            {sessionCreateState === "name"
              ? "What shall I call you?"
              : sessionCreateState === "stoody"
              ? "How long do you want to stoody?"
              : sessionCreateState === "shortBreak"
              ? "How long do you want to short break for?"
              : sessionCreateState === "longBreak"
              ? "How long do you want to long break for?"
              : "How many cycles do you want to complete?"}
          </h1>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center border border-red-500">
        {/* Fixed-size input area so the time buttons sit in a consistent spot */}
          <div className="w-full h-[360px] flex items-center justify-center border border-green-200">
            {sessionCreateState === 'cached' && (
              <div className="flex flex-col items-center gap-4 w-full">
                <LastPresetCard
                  name={name}
                  stoody={stoody}
                  shortBreak={shortBreak}
                  longBreak={longBreak}
                  cycles={cycles}
                  onClick={handleStartSession}
                />
                <FreshStartCard
                  onClick={() => {applyDefaultPreset();}}
                />
              </div>
            )}
            <SessionInput
              sessionCreateState={sessionCreateState}
              name={name}
              stoody={stoody}
              shortBreak={shortBreak}
              longBreak={longBreak}
              cycles={cycles}
              isExiting={isExiting}
              setName={setName}
              setStoody={setStoody}
              setShortBreak={setShortBreak}
              setLongBreak={setLongBreak}
              setCycles={setCycles}
              nextSessionState={nextSessionState}
              handleStartSession={handleStartSession}
              handleOnExited={handleOnExited}
            />
          </div>
          <div className="pt-8 flex justify-center min-h-[90px]">
            {(sessionCreateState !== "name" && sessionCreateState !== "cached") && (
                <TimeButtons
                  options={
                    sessionCreateState === "stoody"
                      ? [25, 30, 45, 60]
                      : sessionCreateState === "shortBreak"
                      ? [5, 10, 15, 30]
                      : sessionCreateState === "longBreak"
                      ? [15, 30, 45, 60]
                      : [1, 2, 3, 4]
                  }
                  value={
                    sessionCreateState === "stoody"
                      ? stoody
                      : sessionCreateState === "shortBreak"
                      ? shortBreak
                      : sessionCreateState === "longBreak"
                      ? longBreak
                      : cycles
                  }
                  onChange={(v: number) =>
                    sessionCreateState === "stoody"
                      ? setStoody(v)
                      : sessionCreateState === "shortBreak"
                      ? setShortBreak(v)
                      : sessionCreateState === "longBreak"
                      ? setLongBreak(v)
                      : setCycles(v)
                  }
                  isExiting={isExiting}
                  onExited={handleOnExited}
                  sessionCreateState={sessionCreateState}
                />

            )}
          </div>
          <div className="flex justify-center gap-10 relative z-50 pt-8">
              <StateButtons
                sessionCreateState={sessionCreateState}
                hasCachedPreset={hasCachedPreset}
                handlePrevClick={handlePrevClick}
                handleNextClick={handleNextClick}
                handleStartSession={handleStartSession}
              />
          </div>

          {sessionCreateState}: {name} {stoody} {shortBreak} {longBreak} {cycles} cached:{hasCachedPreset.toString()}

        </div>
    </div>
  );
}
