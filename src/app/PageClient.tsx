'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './_components/Navbar';
import StickyNotes from './_components/inputs/StickyNotes';
import StoodyInput from './_components/inputs/StoodyInput';
import ShortBreakInput from './_components/inputs/ShortBreakInput';
import LongBreakInput from './_components/inputs/LongBreakInput';
import CycleInput from './_components/inputs/CycleInput';
import React from 'react';
import DirectionButton from './_components/inputs/DirectionButton';
import QuickStartButton from './_components/inputs/QuickStartButton';
import TimeButtons from './_components/inputs/TimeButtons';
import { useLocalStorage } from './_components/hooks/useLocalStorage';

export default function PageClient() {
  const router = useRouter();
  const sessionCreationStates = ['name', 'stoody', 'shortBreak', 'longBreak', 'cycles'] as const;
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

  const [sessionCreateState, setSessionCreateState] = useState<SessionCreationState>(sessionCreationStates[0]);
  const [isExiting, setIsExiting] = useState(false);

  // ----------------------
  // Client-side hydration
  // ----------------------
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Generate random name only on client
  useEffect(() => {
    if (!hydrated) return;
    if (!localStorage.getItem('stoody_name')) {
      const gen = generateRandomName();
      setName(gen);
    }
  }, [hydrated, setName]);

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
      router.push(`/session/${data.sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Error creating session: ' + error);
    }
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
            {/* input area: keep individual components inside the same box */}
            {sessionCreateState === "name" && (
              <StickyNotes
                name={name}
                setName={setName}
                nextSessionState={nextSessionState}
                handleStartSession={handleStartSession}
                isExiting={isExiting}
                onExited={handleOnExited}
              />
            )}
            {sessionCreateState === "stoody" && (
              <StoodyInput
                value={stoody}
                onChange={(v) => setStoody(v)}
                maxMinutes={120}
                isExiting={isExiting}
                onExited={handleOnExited}
              />
            )}
            {sessionCreateState === "shortBreak" && (
              <ShortBreakInput
                value={shortBreak}
                onChange={setShortBreak}
                maxMinutes={60}
                isExiting={isExiting}
                onExited={handleOnExited}
              />
            )}
            {sessionCreateState === "longBreak" && (
              <LongBreakInput
                value={longBreak}
                onChange={setLongBreak}
                maxMinutes={120}
                isExiting={isExiting}
                onExited={handleOnExited}
              />
            )}
            {sessionCreateState === "cycles" && (
              <CycleInput
                value={cycles}
                onChange={setCycles}
                isExiting={isExiting}
                onExited={handleOnExited}
              />
            )}
          </div>
          <div className="pt-8 flex justify-center min-h-[90px]">
            {sessionCreateState !== "name" && (
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
          <div>
            <div className="flex justify-center gap-10 relative z-50 pt-8">
              {sessionCreateState === "name" && (
                <>
                <QuickStartButton handleClick={handleStartSession} text="Quick Start" />
                <DirectionButton handleNextClick={handleNextClick} text="Next" />
                </>
              )}
              {sessionCreateState === "cycles" && (
                <>
                <DirectionButton handleNextClick={handlePrevClick} text="Back" />
                <QuickStartButton handleClick={handleStartSession} text="Stoody!" />
                </>
              )}
              {(sessionCreateState !== "name" && sessionCreateState !== "cycles") && (
                <>
                  <DirectionButton handleNextClick={handlePrevClick} text="Back" />
                  <DirectionButton handleNextClick={handleNextClick} text="Next" />
                </>
              )}
            </div>

          </div>
          {sessionCreateState}: {name} {stoody} {shortBreak} {longBreak} {cycles}

        </div>
    </div>
  );
}
