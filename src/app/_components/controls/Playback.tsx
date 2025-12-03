 'use client';
import React from 'react';

type PauseProps = {
  onClick?: () => void;
  size?: number;
  ariaLabel?: string;
  sessionState?: string,
  isRunning?: boolean,
};

export default function Playback({ onClick, size = 56, ariaLabel = 'Pause', sessionState = 'longBreak', isRunning = false }: PauseProps) {
  const colour = 
    sessionState === 'stoody' ? 'from-[#C18FFF] to-[#8B5CF6] shadow-[0_4px_0px_#8054c7] hover:shadow-[0_2px_0px_#8054c7] hover:translate-y-[2px] active:shadow-[0_0px_0px_#8054c7]' 
    : sessionState === 'shortBreak' ? 'from-[#2BB5A3] to-[#1E8771] shadow-[0_4px_0px_#1E8771] hover:shadow-[0_2px_0px_#1E8771] hover:translate-y-[2px] active:shadow-[0_0px_0px_#1E8771]'
    : sessionState === "longBreak" ? 'from-[#4CAF50] to-[#3D9440] shadow-[0_4px_0px_#357A38] hover:shadow-[0_2px_0px_#357A38] hover:translate-y-[2px] active:shadow-[0_0px_0px_#357A38]'
    : 'from-[#9CA3AF] to-[#6B7280] shadow-[0_4px_0px_#4B5563] hover:shadow-[0_2px_0px_#4B5563] hover:translate-y-[2px] active:shadow-[0_0px_0px_#4B5563]';

  return (
    <div className="relative z-30" style={{ width: size, height: size }}>
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        title={isRunning ? "Pause" : "Play"}
        className={`w-full h-full rounded-full bg-gradient-to-b ${colour} active:translate-y-[4px] transition-all duration-150 cursor-pointer flex items-center justify-center`}
      >
        {/* simple pause icon */}
        {isRunning && (
          <div style={{ width: '46%', height: '46%', display: 'flex', gap: '14%', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '24%', height: '80%', background: 'white', borderRadius: 3 }} />
            <div style={{ width: '24%', height: '80%', background: 'white', borderRadius: 3 }} />
          </div>
        )}
        {!isRunning && (
          <svg width="64%" height="64%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="7,6 17,12 7,18" fill="#fff" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
        )}
        
      </button>
    </div>
  );
}
