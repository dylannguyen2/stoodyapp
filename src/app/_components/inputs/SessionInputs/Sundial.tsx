import React, { useRef, useState, useEffect } from 'react';

interface StoodyInputProps  {
  size?: number;
  maxMinutes?: number;
  value?: number;
  onChange?: (v: number) => void;
  isExiting?: boolean;
  onExited?: () => void;
}

export default function Sundial({
  size = 330,
  maxMinutes = 90,
  value = 30,
  onChange,
  isExiting = false,
  onExited,
}: StoodyInputProps
) {
  const step = 5;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [internal, setInternal] = useState(Math.round(value / step) * step);
  const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
      const raf = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(raf);
    }, []);

  useEffect(() => setInternal(Math.round((value ?? 0) / step) * step), [value, step]);

  // --- size-driven geometry (everything derived from `size`) ---
  const center = size / 2;
  const stroke = Math.max(6, Math.round(size * 0.075));
  const knobSize = Math.max(28, Math.round(size * 0.2));
  const knobRadius = knobSize / 2;
  const radius = center - stroke / 2 ;

  const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  const minutes = typeof value === 'number' ? value : internal;
  const ratio = clamp(minutes / maxMinutes, 0, 1);
  // horizontal (top) semicircle: 270deg -> 90deg (wraps across 360)
  const startAngle = 270;
  const endAngle = startAngle + ratio * 180;

  function polar(cx: number, cy: number, r: number, angleDeg: number) {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function describeArc(cx: number, cy: number, r: number, startA: number, endA: number) {
    const start = polar(cx, cy, r, endA);
    const end = polar(cx, cy, r, startA);
    const large = endA - startA <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
  }

  const knob = polar(center, center, radius, endAngle);
  const idSuffixRef = useRef(Math.random().toString(36).slice(2, 8));
  const idSuffix = idSuffixRef.current;
  const visibleHeight = size / 2 + knobSize / 2;

  const setFromPointer = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = clientX - rect.left - center;
    const y = clientY - rect.top - center;
    let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;
    // map angle across the wrap [270..360] and [0..90] -> 0..180 sweep (left->right across top)
    let sweep: number;
    if (angle >= 270) {
      sweep = angle - 270; // 0..90
    } else if (angle <= 90) {
      sweep = angle + 90; // 90..180
    } else {
      // outside the top semicircle; snap to nearest end
      if (angle < 180) {
        sweep = 180; // snap to right end
      } else {
        sweep = 0; // snap to left end
      }
    }
  let mins = Math.round((sweep / 180) * maxMinutes);
  // snap to step increments
  mins = Math.round(mins / step) * step;
  mins = Math.max(0, Math.min(maxMinutes, mins));
  if (onChange) onChange(mins); else setInternal(mins);
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!isDragging) return;
      setFromPointer(e.clientX, e.clientY);
    };
    const up = () => setIsDragging(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [isDragging]);

  const handleDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    // prefer capturing on the svg root so move/up always deliver
    svgRef.current?.setPointerCapture?.(e.pointerId);
    setFromPointer(e.clientX, e.clientY);
  };

  const format = (mins: number) => `${mins} mins`;
  const labelText = format(minutes);
  const approxCharWidth = 0.55; // fraction of font size each char typically occupies
  const maxLabelFont = knobSize * 0.28;
  const labelFont = Math.max(10, Math.min(maxLabelFont, (knobSize * 0.8) / (labelText.length * approxCharWidth)));

  return (
   <div
      className={`flex flex-col items-center gap-4 transform transition-transform transition-opacity duration-200 ease-out ${
        isExiting
          ? 'opacity-0 scale-95 translate-y-2'
          : mounted
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      {isExiting && onExited ? <ExitCaller onExited={onExited} /> : null}
      <div style={{ width: size, height: visibleHeight }} className="select-none overflow-visible">
        <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
    {/* background faint arc */}
    <path d={describeArc(center, center, radius, startAngle, startAngle + 180)} stroke="#EDE7FF" strokeWidth={stroke} strokeLinecap="round" fill="none" />
    {/* active purple arc */}
    <path d={describeArc(center, center, radius, startAngle, endAngle)} stroke="#8B5CF6" strokeWidth={stroke} strokeLinecap="round" fill="none" />

        {/* sun knob (using provided SVG) */}
        <g style={{ cursor: 'grab' }} onPointerDown={handleDown}>
          <svg
            x={knob.x - knobSize / 2}
            y={knob.y - knobSize / 2}
            width={knobSize}
            height={knobSize}
            viewBox="0 0 174 174"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M82.6252 7.90577C84.5281 4.46698 89.4719 4.46699 91.3748 7.90577L96.8658 17.8285C98.3638 20.5356 101.936 21.2461 104.356 19.3184L113.226 12.2523C116.3 9.80348 120.868 11.6954 121.31 15.6006L122.586 26.8693C122.934 29.9436 125.962 31.9671 128.935 31.1122L139.835 27.9785C143.612 26.8924 147.108 30.3883 146.022 34.1654L142.888 45.0645C142.033 48.038 144.056 51.0664 147.131 51.4144L158.399 52.6901C162.305 53.1322 164.197 57.6997 161.748 60.7738L154.682 69.644C152.754 72.064 153.464 75.6362 156.172 77.1342L166.094 82.6252C169.533 84.5281 169.533 89.4719 166.094 91.3748L156.172 96.8658C153.464 98.3638 152.754 101.936 154.682 104.356L161.748 113.226C164.197 116.3 162.305 120.868 158.399 121.31L147.131 122.586C144.056 122.934 142.033 125.962 142.888 128.935L146.022 139.835C147.108 143.612 143.612 147.108 139.835 146.022L128.935 142.888C125.962 142.033 122.934 144.056 122.586 147.131L121.31 158.399C120.868 162.305 116.3 164.197 113.226 161.748L104.356 154.682C101.936 152.754 98.3638 153.464 96.8658 156.172L91.3748 166.094C89.4719 169.533 84.5281 169.533 82.6252 166.094L77.1342 156.172C75.6362 153.464 72.064 152.754 69.644 154.682L60.7738 161.748C57.6997 164.197 53.1322 162.305 52.6901 158.399L51.4144 147.131C51.0664 144.056 48.038 142.033 45.0645 142.888L34.1654 146.022C30.3883 147.108 26.8924 143.612 27.9785 139.835L31.1122 128.935C31.9671 125.962 29.9436 122.934 26.8693 122.586L15.6006 121.31C11.6954 120.868 9.80348 116.3 12.2523 113.226L19.3184 104.356C21.2461 101.936 20.5356 98.3638 17.8285 96.8658L7.90577 91.3748C4.46698 89.4719 4.46699 84.5281 7.90577 82.6252L17.8285 77.1342C20.5356 75.6362 21.2461 72.064 19.3184 69.644L12.2523 60.7738C9.80348 57.6997 11.6954 53.1322 15.6006 52.6901L26.8693 51.4144C29.9436 51.0664 31.9671 48.038 31.1122 45.0645L27.9785 34.1654C26.8924 30.3882 30.3883 26.8924 34.1654 27.9785L45.0645 31.1122C48.038 31.9671 51.0664 29.9436 51.4144 26.8693L52.6901 15.6006C53.1322 11.6954 57.6997 9.80348 60.7738 12.2523L69.644 19.3184C72.064 21.2461 75.6362 20.5356 77.1342 17.8285L82.6252 7.90577Z" fill={`url(#sun_grad_${idSuffix})`} />
            <g filter={`url(#sun_filter_${idSuffix})`}>
              <circle cx="87" cy="87" r="64" fill="#FFB347" />
            </g>
            <defs>
              <filter id={`sun_filter_${idSuffix}`} x="19" y="23" width="136" height="136" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
              </filter>
              <linearGradient id={`sun_grad_${idSuffix}`} x1="87" y1="0" x2="87" y2="174" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFB347" />
                <stop offset="1" stopColor="#FFE08C" />
              </linearGradient>
            </defs>
          </svg>

          {/* minutes label centered on knob */}
          <text
            x={knob.x}
            y={knob.y + labelFont * 0.35}
            textAnchor="middle"
            fontWeight={700}
            fill="#fff"
            style={{ fontSize: labelFont }}
          >
            {labelText}
          </text>
        </g>
        </svg>
      </div>
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
