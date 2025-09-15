'use client';

import React, { useEffect, useState } from 'react';

interface StickyNotesProps {
  name: string;
  setName: (v: string) => void;
  nextSessionState: () => void;
  handleStartSession: () => void;
  isExiting?: boolean;
  onExited?: () => void;
  size: number;
}

export default function StickyNotes({ name, setName, nextSessionState, handleStartSession, isExiting: parentExiting = false, onExited, size }: StickyNotesProps) {
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

  // size-driven geometry
  const s = Math.max(120, Math.round(size));
  const noteWidth = s;
  const noteHeight = s;
  const offsetSmall = Math.round(s * 0.06);
  const offsetMedium = Math.round(s * 0.12);
  const shadowBlur = Math.round(s * 0.04);
  const titleFont = Math.max(14, Math.round(s * 0.095));
  const inputWidth = Math.max(80, Math.round(s * 0.62));
  const inputPaddingY = Math.max(8, Math.round(s * 0.04));
  const inputPaddingX = Math.max(10, Math.round(s * 0.05));
  const inputFont = Math.max(14, Math.round(s * 0.07));
  const noteRadius = Math.max(10, Math.round(s * 0.04));

  // layering/transforms for three notes
  const notesConfig: {
    num: number;
    bg: string;
    style: React.CSSProperties;
    pointerEvents?: string;
  }[] = [
    {
      num: 3,
      bg: '#FFC645',
      style: {
        top: offsetMedium,
        left: offsetMedium,
        zIndex: 10,
        transform: `rotate(-7deg)`,
      },
      pointerEvents: 'none',
    },
    {
      num: 2,
      bg: '#5EB1FF',
      style: {
        top: offsetSmall,
        left: offsetSmall,
        zIndex: 20,
        transform: `rotate(-3deg)`,
      },
      pointerEvents: 'none',
    },
    {
      num: 1,
      bg: '#C18FFF',
      style: {
        top: 0,
        left: 0,
        zIndex: 30,
        transform: `rotate(0deg)`,
      },
    },
  ];

  const mountClass = mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none';
  const exitTransforms: Record<number, string> = {
    1: `translateX(${Math.round(s * 0.12)}px) translateY(-${Math.round(s * 0.06)}px) rotate(12deg) opacity-25`,
    2: `translateX(-${Math.round(s * 0.12)}px) translateY(-${Math.round(s * 0.06)}px) rotate(-12deg) opacity-25`,
    3: `translateY(${Math.round(s * 0.18)}px) rotate(0deg) opacity-25`,
  };

  return (
    <div
      style={{ width: noteWidth, height: noteHeight, position: 'relative', margin: '0 auto', cursor: 'pointer' }}
      className="group"
    >
      {notesConfig.map(({ num, bg, style, pointerEvents }) => {
        const baseStyle: React.CSSProperties = {
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: noteRadius,
          boxShadow: `0 ${Math.round(shadowBlur / 2)}px ${shadowBlur}px rgba(0,0,0,0.18)`,
          transition: 'transform 200ms ease-in-out, opacity 200ms ease-in-out',
          background: bg,
          ...style,
          pointerEvents: pointerEvents as any,
        };

        const exitClass = isExiting ? exitTransforms[num] : '';
        const styleWithExit = isExiting ? { ...baseStyle } : baseStyle;
        if (isExiting) {
          // apply transform string as inline transform if exiting
          styleWithExit.transform = exitClass || baseStyle.transform;
        }

        return (
          <div key={num} style={styleWithExit} className={mountClass}>
            {num === 1 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: Math.round(s * 0.08),
                  height: '100%',
                  color: 'black',
                  fontWeight: 700,
                }}
              >
                <h1
                  style={{
                    fontSize: titleFont,
                    margin: 0,
                    fontFamily: 'Gochi Hand, sans-serif',
                  }}
                >
                  Who's Studying?
                </h1>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={name}
                  style={{
                    marginTop: Math.round(s * 0.04),
                    width: inputWidth,
                    paddingTop: inputPaddingY,
                    paddingBottom: inputPaddingY,
                    paddingLeft: inputPaddingX,
                    paddingRight: inputPaddingX,
                    borderRadius: Math.max(6, Math.round(s * 0.02)),
                    background: '#C18FFF',
                    color: 'black',
                    fontWeight: 700,
                    fontFamily: 'Gochi Hand, monospace',
                    fontSize: inputFont,
                    boxShadow: `2px 4px ${Math.round(shadowBlur / 2)}px rgba(0,0,0,0.2)`,
                    border: `1px solid rgba(164,108,219,0.9)`,
                    transform: 'rotate(-1deg)',
                    outline: 'none',
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
