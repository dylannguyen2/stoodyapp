'use client';

import React, { useEffect, useState } from 'react';

interface StickyNotesProps {
  name: string;
  setName: (v: string) => void;
  nextSessionState: () => void;
  handleStartSession: () => void;
  isExiting?: boolean;
  onExited?: () => void;
}

export default function StickyNotes({ name, setName, nextSessionState, handleStartSession, isExiting: parentExiting = false, onExited, }: StickyNotesProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!parentExiting) return;
    setIsExiting(true);
    const ANIM_DURATION = 200;
    const t = window.setTimeout(() => {
      setIsExiting(false);
      console.debug('[StickyNotes] parent-triggered exit completed — calling onExited');
      onExited?.();
    }, ANIM_DURATION + 50);
    return () => window.clearTimeout(t);
  }, [parentExiting, onExited]);

  useEffect(() => {
    setMounted(false);
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleNextClick = () => {
    if (isExiting) return;
    if (onExited) {
      setIsExiting(true);
      const ANIM_DURATION = 200;
      window.setTimeout(() => {
        setIsExiting(false);
        onExited();
      }, ANIM_DURATION + 50);
      return;
    }

    setIsExiting(true);
    const ANIM_DURATION = 200;
    window.setTimeout(() => {
      nextSessionState();
      setIsExiting(false);
    }, ANIM_DURATION + 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNextClick();
    }
  };

  return (
    <div className="relative w-84 h-84 group cursor-pointer mx-auto">
      {[3, 2, 1].map((num) => {
        const exitTransforms: Record<number, string> = {
          // fade to a slightly visible state instead of fully transparent
          1: 'translate-x-40 -translate-y-20 rotate-12 opacity-25',
          2: '-translate-x-40 -translate-y-20 -rotate-12 opacity-25',
          3: 'translate-y-32 rotate-0 opacity-25',
        };

  const baseClasses = `absolute w-full h-full rounded-xl shadow-xl transition-transform transition-opacity duration-200 ease-in-out ${
          num === 1
            ? 'bg-[#C18FFF] z-30 hover:scale-105'
            : num === 2
            ? 'bg-[#5EB1FF] top-2 left-2 z-20 -rotate-3 pointer-events-none group-hover:rotate-3'
            : 'bg-[#FFC645] z-10 top-4 left-4 -rotate-7 pointer-events-none group-hover:rotate-3'
        }`;

        const exitClass = isExiting ? exitTransforms[num] : '';

  const mountClass = mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none';
        const style: React.CSSProperties = isExiting
          ? { transitionDelay: `${(3 - num) * 80}ms` }
          : {};

        return (
            <div
              key={num}
              className={`${baseClasses} ${mountClass} ${exitClass}`}
              style={style}
            >
        {num === 1 && (
          <div className="flex flex-col items-center mt-6 h-full text-black font-bold transition-all duration-200">
                <h1 className="text-3xl gochi-hand-regular">Who's Studying?</h1>

                {/* Sticky note styled input */}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={name}
                  className="
                    mt-4 w-56 px-4 py-3
                    rounded-sm
                    bg-[#C18FFF] text-black placeholder-black/40
                    font-semibold gochi-hand-regular
                    shadow-[2px_4px_8px_rgba(0,0,0,0.2)]
                    border border-[#A46CDB]
                    focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/60
                    transform -rotate-1
                  "
                />

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
