'use client';
import React from 'react';

interface RulerSliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  sliderWidth: number;
}

export default function RulerSlider({
  value,
  onChange,
  min = 0,
  max = 120,
  step = 5,
  sliderWidth = 480,
}: RulerSliderProps) {
  // height always 8% of width
  const sliderHeight = 0.08 * sliderWidth;

  const outerPaddingY = Math.max(1, Math.round(0.08 * sliderHeight));
  const outerRectHeight = Math.max(6, Math.round(0.84 * sliderHeight));
  const outerRx = Math.max(4, Math.round(outerRectHeight * 0.25));

  const trackY = Math.round(0.42 * sliderHeight);
  const trackHeight = Math.max(4, Math.round(0.25 * sliderHeight));
  const knobRadius = Math.max(6, Math.round(0.35 * sliderHeight));
  const knobInnerRadius = Math.max(3, Math.round(0.1 * sliderHeight));

  const percent = ((value - min) / (max - min));
  const knobX = percent * (sliderWidth - 24) + 12;
  const knobCenterY = trackY + trackHeight / 2;

  // tick label font scales with sliderHeight
  const tickFontSize = Math.max(10, Math.round(sliderHeight * 0.22));

  return (
    <div className="flex flex-col items-center select-none" style={{ width: sliderWidth }}>
      <div className="relative">
        <svg width={sliderWidth} height={sliderHeight} style={{ overflow: 'visible', display: 'block' }}>
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
              <feDropShadow dx="0" dy={Math.max(2, Math.round(sliderHeight * 0.15))} stdDeviation={Math.max(2, Math.round(sliderHeight * 0.2))} floodColor="#000" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Base translucent ruler (background) */}
          <g filter="url(#ruler-shadow)">
            <rect
              x={0}
              y={outerPaddingY}
              width={sliderWidth}
              height={outerRectHeight}
              rx={outerRx}
              fill="url(#plastic-grad)"
            />
            <rect
              x={Math.round(0.0125 * sliderWidth)}
              y={outerPaddingY + Math.round(0.1 * outerRectHeight)}
              width={Math.max(0, sliderWidth - Math.round(0.025 * sliderWidth))}
              height={Math.max(0, Math.round(0.72 * outerRectHeight))}
              rx={Math.max(4, Math.round(outerRectHeight * 0.18))}
              fill="rgba(255,255,255,0.04)"
            />
          </g>

          {/* Sheen highlight */}
          <rect
            x={Math.round(0.008 * sliderWidth)}
            y={outerPaddingY}
            width={Math.max(0, sliderWidth - Math.round(0.016 * sliderWidth))}
            height={Math.max(2, Math.round(0.26 * outerRectHeight))}
            rx={Math.max(2, Math.round(outerRectHeight * 0.12))}
            fill="url(#plastic-sheen)"
            opacity={0.9}
          />

          {/* Track groove and filled portion */}
          <rect
            x={12}
            y={trackY}
            width={Math.max(8, sliderWidth - 24)}
            height={trackHeight}
            rx={Math.max(2, Math.round(trackHeight * 0.5))}
            fill="rgba(0,0,0,0.08)"
          />
          <rect
            x={12}
            y={trackY}
            width={Math.max(8, knobX - 12 + knobRadius)}
            height={trackHeight}
            rx={Math.max(2, Math.round(trackHeight * 0.5))}
            fill="#6b21a8"
            opacity={0.22}
          />

          {/* Tick marks and numeric labels (scaled positions) */}
          {(() => {
            const tickCount = Math.floor((max - min));
            const ticks = Array.from({ length: tickCount + 1 }, (_, i) => i);
            return ticks.map((i) => {
              const x = (i / tickCount) * (sliderWidth - 24) + 12;
              const isLong = i % 10 === 0;
              const isMedium = !isLong && i % 5 === 0;
              const isStart = i === 0;
              const isEnd = i === tickCount;
              const tickH = isLong ? Math.max(10, Math.round(sliderHeight * 0.48)) : isMedium ? Math.max(6, Math.round(sliderHeight * 0.32)) : Math.max(4, Math.round(sliderHeight * 0.2));
              const y1 = Math.max(2, Math.round(trackY - tickH / 2));
              const y2 = Math.min(Math.round(trackY + tickH / 2 + Math.round(sliderHeight * 0.06)), Math.round(sliderHeight));
              return (
                <g key={i}>
                  <line x1={x} x2={x} y1={y1} y2={y1 + tickH} stroke="#2b1450" strokeWidth={(isStart || isEnd) ? 2.5 : isLong ? 1.6 : 1} strokeOpacity={0.95} />
                  {(isLong) && (
                    <text x={x} y={y1 + tickH + Math.round(sliderHeight * 0.28)} fontSize={tickFontSize} textAnchor="middle" fill="#2b1450">{min + i * 1}m</text>
                  )}
                </g>
              );
            });
          })()}

          {/* Knob */}
          <g transform={`translate(${knobX},${knobCenterY})`} style={{ cursor: 'grab' }}>
            <circle r={knobRadius - 2} fill="rgba(124,58,237,0.95)" stroke="rgba(0,0,0,0.18)" strokeWidth={Math.max(0.5, Math.round(sliderHeight * 0.03))} />
            <circle r={knobInnerRadius} fill="#fff" opacity={0.9} />
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
            height: sliderHeight,
            opacity: 0,
            cursor: 'grab',
            appearance: 'none',
          }}
        />
      </div>
    </div>
  );
}
