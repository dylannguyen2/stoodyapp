'use client';
import React, { useRef, useState, useEffect } from 'react';

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function CircularSlider({
  size = 340,
  maxMinutes = 120,
  value,
  onChange,
  isExiting = false,
  onExited,
}: {
  size?: number;
  maxMinutes?: number;
  value?: number;
  onChange?: (v: number) => void;
  isExiting?: boolean;
  onExited?: () => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [internalMinutes, setInternalMinutes] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastAngleRef = useRef<number | null>(null);
  const accumulatedAngleRef = useRef<number | null>(null);

  const knobRadius = 0.5 * (0.12 * size);
  const center = size / 2;
  const strokeWidth = 0.075 * size;
  const radius = center - strokeWidth / 2 - knobRadius;
  const step = 5;


  const minutes = typeof value === 'number' ? value : internalMinutes;
  const valueRatio = clamp(minutes / maxMinutes, 0, 1);
  const startAngle = 0;
  const endAngle = startAngle + valueRatio * 360;

  const setFromPointer = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();

    const x = clientX - rect.left - center;
    const y = clientY - rect.top - center;

    let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;

    if (isDragging && lastAngleRef.current !== null) {
      const rawDelta = angle - lastAngleRef.current;
      const signedDelta = ((rawDelta + 540) % 360) - 180;

      if (accumulatedAngleRef.current === null) accumulatedAngleRef.current = lastAngleRef.current;
      let acc = (accumulatedAngleRef.current ?? angle) + signedDelta;
      acc = Math.max(0, Math.min(360, acc));
      accumulatedAngleRef.current = acc;

      let newMinutes = Math.round((acc / 360) * maxMinutes);
      newMinutes = Math.round(newMinutes / step) * step;
      const final = clamp(newMinutes, 0, maxMinutes);
      if (onChange) onChange(final);
      else setInternalMinutes(final);

      lastAngleRef.current = angle;
      return;
    }

    let newMinutes = (angle / 360) * maxMinutes;
    newMinutes = clamp(newMinutes, 0, maxMinutes);
    newMinutes = Math.round(newMinutes / step) * step;
    const final = newMinutes;
    if (onChange) onChange(final);
    else setInternalMinutes(final);
  };

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDragging) return;
      setFromPointer(e.clientX, e.clientY);
    };
    const handleUp = () => {
      setIsDragging(false);
      lastAngleRef.current = null;
      accumulatedAngleRef.current = null;
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (svgRef.current) svgRef.current.setPointerCapture?.(e.pointerId);
    setIsDragging(true);

    const svg = svgRef.current;
    if (svg) {
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left - center;
      const y = e.clientY - rect.top - center;
      let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
      if (angle < 0) angle += 360;
      lastAngleRef.current = angle;
      accumulatedAngleRef.current = angle;
    }

    setFromPointer(e.clientX, e.clientY);
  };

  const knobPos = polarToCartesian(center, center, radius, endAngle);

  const formatLabel = (mins: number) => {
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h}:${String(m).padStart(2, '0')}hr`;
    }
    return `${mins}m`;
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!isExiting || !onExited) return;
    const t = setTimeout(() => onExited(), 200);
    return () => clearTimeout(t);
  }, [isExiting, onExited]);

  // Inner tick radius (slightly smaller than main radius)
  const tickRadius = radius - strokeWidth / 2 - 15;
  const tickLength = 8;

  return (
    <div
      className={`relative gap-4 transform transition-transform transition-opacity duration-200 ease-out  ${
        isExiting
          ? 'opacity-0 scale-95 translate-y-2'
          : mounted
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      {isExiting && onExited ? <ExitCaller onExited={onExited} /> : null}
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={maxMinutes}
        aria-valuenow={minutes}
        tabIndex={0}
        onKeyDown={(e) => {
          const delta = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? step : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -step : 0;
          if (!delta) return;
          const next = clamp((minutes ?? 0) + delta, 0, maxMinutes);
          if (onChange) onChange(next); else setInternalMinutes(next);
        }}
        className="block"
      >
        {/* Base circle track */}
        <circle cx={center} cy={center} r={radius} stroke="#E6E6E6" strokeWidth={strokeWidth} fill="none" />

        {/* Inner ticks */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = i * 45;
          const inner = polarToCartesian(center, center, tickRadius, angle);
          const outer = polarToCartesian(center, center, tickRadius - tickLength, angle);
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#E0E0E0"
              strokeWidth={5}
              strokeLinecap="round"
            />
          );
        })}

        {/* Arc progress */}
        {valueRatio >= 0.999999 || minutes >= maxMinutes ? (
          <circle cx={center} cy={center} r={radius} stroke="#8B5CF6" strokeWidth={strokeWidth} fill="none" />
        ) : (
          <path d={describeArc(center, center, radius, startAngle, endAngle)} stroke="#8B5CF6" strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
        )}

        {/* Knob */}
        <circle
          cx={knobPos.x}
          cy={knobPos.y}
          r={knobRadius}
          fill="#8B5CF6"
          stroke="#6B21A8"
          strokeWidth={3}
          onPointerDown={handlePointerDown}
          style={{ cursor: 'grab', touchAction: 'none' }}
        />
        <circle cx={knobPos.x} cy={knobPos.y} r={knobRadius / 4} fill="#fff" pointerEvents="none" />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="24"
          fontWeight="bold"
          fill="black"
        >
          {formatLabel(minutes)}
        </text>
      </svg>
    </div>
  );
}

function ExitCaller({ onExited }: { onExited: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(() => onExited(), 200);
    return () => clearTimeout(t);
  }, [onExited]);
  return null;
}
