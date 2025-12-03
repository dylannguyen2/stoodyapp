'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import TimeButtons from './_components/inputs/SessionInputs/TimeButtons';
import { useLocalStorage } from './_components/hooks/useLocalStorage';
import LastPresetCard from './_components/cards/LastPresetCard';
import FreshStartCard from './_components/cards/FreshStartCard';
import SessionInput from './_components/inputs/SessionInputs/SessionInput';
import LeftButton from './_components/inputs/SessionInputs/LeftButton';
import RightButton from './_components/inputs/SessionInputs/RightButton';
import EditUI from './_components/inputs/EditUI';
import { AnimatePresence, motion } from 'framer-motion';

const DESKTOP_ARROW_SIZE = 64;
const DESKTOP_ARROW_ICON = 30;
const MOBILE_ARROW_SIZE = 56;
const MOBILE_ARROW_ICON = 26;

type StoredSession = {
  name?: string;
  stoody?: number;
  shortBreak?: number;
  longBreak?: number;
  cycles?: number;
  cachedAt?: number;
};

const isStoredSession = (value: unknown): value is StoredSession => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  const isOptionalNumber = (val: unknown) => typeof val === 'number' || typeof val === 'undefined';
  return (
    (typeof obj.name === 'string' || typeof obj.name === 'undefined') &&
    isOptionalNumber(obj.stoody) &&
    isOptionalNumber(obj.shortBreak) &&
    isOptionalNumber(obj.longBreak) &&
    isOptionalNumber(obj.cycles)
  );
};

type CreateSessionResponse = { sessionId: string };

const isCreateSessionResponse = (value: unknown): value is CreateSessionResponse => {
  return typeof value === 'object' && value !== null && typeof (value as { sessionId?: unknown }).sessionId === 'string';
};

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
  const [editOpen, setEditOpen] = useState(false);
  const [hasCachedPreset, setHasCachedPreset] = useState<boolean>(false);
  // helper open/close for EditUI
  const openEdit = () => setEditOpen(true);
  const closeEdit = () => setEditOpen(false);

  const handleEditSave = async (vals: { stoody: number; shortBreak: number; longBreak: number; cycles: number; name?: string }) => {
    // persist into local storage-backed state so PageClient + LastPresetCard reflect changes
    if (typeof vals.name === 'string') setName(vals.name);
    setStoody(vals.stoody);
    setShortBreak(vals.shortBreak);
    setLongBreak(vals.longBreak);
    setCycles(vals.cycles);

    // update cached preset payload if present
    try {
      const payload: StoredSession = { name: vals.name ?? name, stoody: vals.stoody, shortBreak: vals.shortBreak, longBreak: vals.longBreak, cycles: vals.cycles, cachedAt: Date.now() };
      localStorage.setItem('stoody_session_cached', JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to cache preset', error);
    }

    setEditOpen(false);
  };

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
        const parsed = JSON.parse(cached) as unknown;
        if (isStoredSession(parsed)) {
          if (typeof parsed.name === 'string') setName(parsed.name);
          if (typeof parsed.stoody === 'number') setStoody(parsed.stoody);
          if (typeof parsed.shortBreak === 'number') setShortBreak(parsed.shortBreak);
          if (typeof parsed.longBreak === 'number') setLongBreak(parsed.longBreak);
          if (typeof parsed.cycles === 'number') setCycles(parsed.cycles);
          setHasCachedPreset(true);
          setSessionCreateState('cached');
          return;
        }
      }
    } catch (error) {
      console.error('Failed to read cached preset', error);
    }

    setHasCachedPreset(false);
    const storedName = localStorage.getItem('stoody_name');
    if (!storedName) {
      const gen = generateRandomName();
      setName(gen);
    } else {
      setName(storedName);
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
      return sessionCreationStates[prevIndex]!;
    });
  };

  const nextSessionState = () => {
    setSessionCreateState((prev) => {
      const i = sessionCreationStates.indexOf(prev);
      const nextIndex = i >= 0 && i < sessionCreationStates.length - 1 ? i + 1 : sessionCreationStates.length - 1;
      return sessionCreationStates[nextIndex]!;
    });
  };

  const exitedRef = React.useRef(false);
  const dirRef = React.useRef<'next' | 'prev'>('next');
  const handleOnExited = () => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    setIsExiting(false);
    if (dirRef.current === 'next') {
      nextSessionState();
    } else {
      prevSessionState();
    }
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

  useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        if (target) {
          const editable =
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target.isContentEditable;
          if (editable) return;
        }
  
        if (e.key === 'ArrowLeft' && sessionCreateState !== 'cached' && !(sessionCreateState === 'name' && !hasCachedPreset)) {
          e.preventDefault();
          handlePrevClick();
        } else if (e.key === 'ArrowRight' && sessionCreateState !== 'cached') {
          e.preventDefault();
          handleNextClick();
        }
      };
  
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, [handlePrevClick, handleNextClick]);

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
      const data: unknown = await res.json();
      if (!res.ok || !isCreateSessionResponse(data)) {
        alert('Failed to create session. Response: ' + JSON.stringify(data));
        return;
      }
      try {
        const payload: StoredSession = { name, stoody, shortBreak, longBreak, cycles, cachedAt: Date.now() };
        localStorage.setItem('stoody_session_cached', JSON.stringify(payload));
      } catch (error) {
        console.error('Failed to persist cached session', error);
      }
      router.push(`/session/${data.sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert(`Error creating session: ${String(error)}`);
    }
  };

  const applyDefaultPreset = () => {
    setStoody(25);
    setShortBreak(15);
    setLongBreak(30);
    setCycles(2);
    setSessionCreateState('name');
  };

  if (!hydrated) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden text-[#150a2f]">
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          backgroundColor: '#ffffff',
          backgroundImage:
            'linear-gradient(0deg, rgba(177,168,229,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(177,168,229,0.28) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[#f8f5ff]" />
      <AnimatePresence>
        {editOpen && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={closeEdit}
            />
            <motion.div
              className="relative z-10 mx-auto w-full max-w-md"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <EditUI
                initial={{
                  stoody: stoody ?? 25,
                  shortBreak: shortBreak ?? 5,
                  longBreak: longBreak ?? 15,
                  cycles: cycles ?? 4,
                  name: name,
                }}
                onSave={handleEditSave}
                onCancel={closeEdit}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-12 pt-8 sm:px-6 lg:px-12">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">Study. Rest. Repeat.</h1>
          <h2 className="gochi-hand-regular mt-3 text-2xl font-bold text-[#6b3cff] sm:text-3xl">
            {sessionCreateState === 'name'
              ? 'What shall I call you?'
              : sessionCreateState === 'stoody'
              ? 'How long do you want to stoody?'
              : sessionCreateState === 'shortBreak'
              ? 'How long do you want to short break for?'
              : sessionCreateState === 'longBreak'
              ? 'How long do you want to long break for?'
              : sessionCreateState === 'cycles'
              ? 'How many cycles do you want to complete?'
              : ''}
          </h2>
        </div>

        <div className="mt-10 flex flex-1 w-full flex-col items-center gap-10">
          {sessionCreateState === 'cached' ? (
            <div className="grid w-full gap-6 md:grid-cols-2">
              <LastPresetCard
                name={name}
                stoody={stoody}
                shortBreak={shortBreak}
                longBreak={longBreak}
                cycles={cycles}
                onClick={handleStartSession}
                onEdit={openEdit}
              />
              <FreshStartCard
                onClick={() => {
                  applyDefaultPreset();
                }}
              />
            </div>
          ) : (
            <div className="flex w-full flex-col gap-8">
              <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
                <div className="hidden h-[320px] shrink-0 items-center justify-center sm:flex sm:h-[360px]">
                  <LeftButton
                    sessionCreateState={sessionCreateState}
                    hasCachedPreset={hasCachedPreset}
                    handlePrevClick={handlePrevClick}
                    handleStartSession={handleStartSession}
                    size={DESKTOP_ARROW_SIZE}
                    arrowIconSize={DESKTOP_ARROW_ICON}
                  />
                </div>

                <div className="flex h-[320px] w-full flex-1 items-center justify-center sm:h-[360px]">
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

                <div className="hidden h-[320px] shrink-0 items-center justify-center sm:flex sm:h-[360px]">
                  <RightButton
                    sessionCreateState={sessionCreateState}
                    handleNextClick={handleNextClick}
                    handleStartSession={handleStartSession}
                    size={DESKTOP_ARROW_SIZE}
                    arrowIconSize={DESKTOP_ARROW_ICON}
                  />
                </div>
              </div>

              <div className="flex w-full items-center justify-between gap-4 sm:hidden">
                <div className="flex h-[92px] flex-1 items-center justify-center">
                  <LeftButton
                    sessionCreateState={sessionCreateState}
                    hasCachedPreset={hasCachedPreset}
                    handlePrevClick={handlePrevClick}
                    handleStartSession={handleStartSession}
                    size={MOBILE_ARROW_SIZE}
                    arrowIconSize={MOBILE_ARROW_ICON}
                  />
                </div>
                <div className="flex h-[92px] flex-1 items-center justify-center">
                  <RightButton
                    sessionCreateState={sessionCreateState}
                    handleNextClick={handleNextClick}
                    handleStartSession={handleStartSession}
                    size={MOBILE_ARROW_SIZE}
                    arrowIconSize={MOBILE_ARROW_ICON}
                  />
                </div>
              </div>

              {sessionCreateState !== 'name' && (
                <div className="w-full pt-2">
                  <div className="flex min-h-[120px] w-full items-center justify-center">
                    <TimeButtons
                      sessionCreateState={sessionCreateState}
                      value={
                        sessionCreateState === 'stoody'
                          ? stoody
                          : sessionCreateState === 'shortBreak'
                          ? shortBreak
                          : sessionCreateState === 'longBreak'
                          ? longBreak
                          : cycles
                      }
                      onChange={(v: number) =>
                        sessionCreateState === 'stoody'
                          ? setStoody(v)
                          : sessionCreateState === 'shortBreak'
                          ? setShortBreak(v)
                          : sessionCreateState === 'longBreak'
                          ? setLongBreak(v)
                          : setCycles(v)
                      }
                      isExiting={isExiting}
                      onExited={handleOnExited}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
