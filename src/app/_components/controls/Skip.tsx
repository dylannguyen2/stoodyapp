 'use client';
import React from 'react';

type SkipProps = {
  onClick?: () => void;
  size?: number;
  ariaLabel?: string;
};

export default function Skip({ onClick, size = 56, ariaLabel = 'Skip' }: SkipProps) {
  // Skip color palette and depth variants
  const base = '#3B82F6';
  const hover = '#60A5FA';

  return (
    <div className="relative z-30" style={{ width: size, height: size }}>
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        title="Skip"
        className={`w-full h-full rounded-full shadow-[0_6px_0px_rgba(59,130,246)] hover:shadow-[0_3px_0px_rgba(59,130,246)] hover:translate-y-[2px] active:shadow-[0_0px_0px_rgba(59,130,246)] active:translate-y-[4px] transition-all duration-150 cursor-pointer flex items-center justify-center`}
        style={{ background: `linear-gradient(to bottom, ${base}, ${hover})` }}
      >
        {/* skip icon: two triangles / chevrons */}
        <svg width="80%" height="80%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.5 20.5v23l11-11.5-11-11.5z" fill="#fff" />
          <path d="M36.5 20.5v23l11-11.5-11-11.5z" fill="#fff" />
        </svg>
      </button>
    </div>
  );
}