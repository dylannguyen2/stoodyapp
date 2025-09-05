'use client';
import React from 'react';

interface RulerSliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function RulerSlider({
  value,
  onChange,
  min = 0,
  max = 120,
  step = 5,
}: RulerSliderProps) {
  const sliderWidth = 480;
  const knobRadius = 12;

  // Calculate knob position
  const percent = ((value - min) / (max - min));
  const knobX = percent * (sliderWidth - 24) + 12; // account for padding in ruler groove

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative">
        <svg width={sliderWidth} height={96} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="plastic-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.28" />
              <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.18" />
            </linearGradient>
            <linearGradient id="plastic-sheen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <filter id="ruler-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Base translucent ruler */}
          <g filter="url(#ruler-shadow)">
            <rect x={0} y={18} width={sliderWidth} height={40} rx={8} fill="url(#plastic-grad)" />
            <rect x={6} y={22} width={sliderWidth - 12} height={32} rx={6} fill="rgba(255,255,255,0.04)" />
          </g>

          {/* Sheen highlight */}
          <rect x={4} y={18} width={sliderWidth - 8} height={10} rx={6} fill="url(#plastic-sheen)" opacity={0.9} />

          {/* Track groove */}
          <rect x={12} y={34} width={sliderWidth - 24} height={8} rx={4} fill="rgba(0,0,0,0.08)" />
          <rect x={12} y={34} width={Math.max(8, knobX - 12 + knobRadius)} height={8} rx={4} fill="#6b21a8" opacity={0.22} />

          {/* Tick marks and numeric labels */}
          {(() => {
            const tickCount = Math.floor((max - min));
            const ticks = Array.from({ length: tickCount + 1 }, (_, i) => i);
            return ticks.map((i) => {
              const x = (i / tickCount) * (sliderWidth - 24) + 12;
              const isLong = i % 10 === 0;
              const isMedium = !isLong && i % 5 === 0;
              const isStart = i === 0;
              const isEnd = i === tickCount;
              const tickH = isLong ? 18 : isMedium ? 12 : 8;
              const y1 = 34 - tickH / 2;
              const y2 = 34 + tickH / 2 + 2;
              return (
                <g key={i}>
                  <line x1={x} x2={x} y1={y1} y2={y2} stroke="#2b1450" strokeWidth={(isStart || isEnd) ? 2.5 :isLong ? 1.6 : 1} strokeOpacity={0.95} />
                  {(isLong) && (
                    <text x={x} y={y2 + 12} fontSize={10} textAnchor="middle" fill="#2b1450">{min + i * 1}m</text>
                  )}
                </g>
              );
            });
          })()}

          {/* Knob */}
          <g transform={`translate(${knobX},${34})`} style={{ cursor: 'grab' }}>
            <circle r={knobRadius - 2} fill="rgba(124,58,237,0.95)" stroke="rgba(0,0,0,0.18)" strokeWidth={1} />
            <circle r={4} fill="#fff" opacity={0.9} />
          </g>
        </svg>

        {/* Hidden input for interaction */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: sliderWidth,
            height: 96,
            opacity: 0,
            cursor: 'grab',
            appearance: 'none',
          }}
        />
      </div>
    </div>
  );
}
