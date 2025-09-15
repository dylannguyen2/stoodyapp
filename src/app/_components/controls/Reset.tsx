 'use client';
import React from 'react';

type ResetProps = {
  onClick?: () => void;
  size?: number;
  ariaLabel?: string;
};

export default function Reset({ onClick, size = 56, ariaLabel = 'Reset' }: ResetProps) {

  return (
    <div className="relative z-30" style={{ width: size, height: size }}>
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        title="Reset"
        className={`w-full h-full rounded-full bg-gradient-to-b from-[#F87171] to-[#DC2626] shadow-[0_4px_0px_#B91C1C] hover:shadow-[0_2px_0px_#B91C1C] hover:translate-y-[2px] active:shadow-[0_0px_0px_#B91C1C] active:translate-y-[4px] transition-all duration-150 cursor-pointer flex items-center justify-center`}
      >
        {/* wider reset arrow: rounded stroke */}
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12a6 6 0 1 1 4.472 5.78" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M6 7v5h5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>
    </div>
  );
}