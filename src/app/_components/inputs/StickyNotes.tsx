"use client";

import React, { useState } from 'react';
import DirectionButton from './DirectionButton';

interface StickyNotesProps {
  name: string;
  setName: (v: string) => void;
  sessionCreateState: string;
  nextSessionState: () => void;
}

export default function StickyNotes({ name, setName, sessionCreateState, nextSessionState }: StickyNotesProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleNextClick = () => {
    if (isExiting) return;
    setIsExiting(true);

    const ANIM_DURATION = 700;
    window.setTimeout(() => {
      nextSessionState();
      setIsExiting(false);
    }, ANIM_DURATION + 50);
  };
  return (
    <div className="relative w-80 h-96 group cursor-pointer mx-auto mt-6">
      {[3, 2, 1].map((num) => {
        // exit transforms per layer to create a scattered animation
        const exitTransforms: Record<number, string> = {
          1: 'translate-x-40 -translate-y-20 rotate-12 opacity-0',
          2: '-translate-x-32 -translate-y-6 -rotate-12 opacity-0',
          3: 'translate-x-56 translate-y-8 rotate-30 opacity-0',
        };

        const baseClasses = `absolute w-full h-full rounded-xl shadow-xl transition-all duration-700 ease-in-out ${
          num === 1
            ? 'bg-[#C18FFF] z-30 hover:scale-105'
            : num === 2
            ? 'bg-[#5EB1FF] top-2 left-2 z-20 -rotate-3 pointer-events-none'
            : 'bg-[#FFC645] z-10 top-4 left-4 -rotate-7 pointer-events-none'
        }`;

        const exitClass = isExiting ? exitTransforms[num] : '';
        const style: React.CSSProperties = isExiting
          ? { transitionDelay: `${(3 - num) * 80}ms` }
          : {};

        return (
          <div
            key={num}
            className={`${baseClasses} ${exitClass}`}
            style={style}
          >
          {/* content only on top layer */}
          {num === 1 && (
            <div className="flex flex-col items-center mt-6 h-full text-black font-bold transition-all duration-300">
              <h1 className="text-3xl gochi-hand-regular">Who's Studying?</h1>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className={
                  "mt-4 w-56 px-3 py-2 rounded-lg bg-white bg-opacity-20 " +
                  "placeholder-white/80 text-black " +
                  "focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-opacity-50 " +
                  "border border-white/30 transition-shadow duration-300 " +
                  "shadow-sm focus:shadow-md"
                }
              />

              <DirectionButton handleNextClick={handleNextClick} sessionCreateState={sessionCreateState} text="Next" />
            </div>
          )}
        </div>
      );
      })}
    </div>
  );
}