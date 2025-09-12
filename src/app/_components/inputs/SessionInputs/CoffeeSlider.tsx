import React from 'react';
import FlatSlider from './FlatSlider';

interface CoffeeSliderProps {
  maxMinutes?: number;
  value?: number;
  onChange?: (v: number) => void;
  isExiting?: boolean;
  onExited?: () => void;
}

export default function CoffeeSlider({
  value = 15,
  onChange,
  maxMinutes = 60,
  isExiting = false,
  onExited,
}: CoffeeSliderProps) {
  const cupWidth = 194.36;
  const cupHeight = 277.21;
  const cupX = 35.76;
  const cupY = 0.25;
  const waveHeight = 12;

  const fillScale = Math.max(0, Math.min(1, value / maxMinutes));
  const waveTop = value === 0 ? 0 : waveHeight;

  const mugCenterY = cupY + cupHeight / 2;

  const fillHeight = fillScale * cupHeight;
  const fillY = cupY + cupHeight - fillHeight;
  const isLabelCovered = fillY <= mugCenterY;

  const min = 0;
  const step = 5;

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`flex flex-col items-center gap-2 transform transition-transform transition-opacity duration-200 ease-out ${
        isExiting
          ? 'opacity-0 scale-95 translate-y-2'
          : mounted
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      {isExiting && onExited ? <ExitCaller onExited={onExited} /> : null}

      <div className="relative w-[386px] h-[319px] flex justify-center">
        <svg width="386" height="319" viewBox="-120 0 506 319" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="handle-shade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E0E0E0" />
              <stop offset="100%" stopColor="#B0B0B0" />
            </linearGradient>

            <linearGradient id="cup-body-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0F0F0" />
              <stop offset="70%" stopColor="#D9D9D9" />
              <stop offset="100%" stopColor="#C4C4C4" />
            </linearGradient>

            <linearGradient id="coffee-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A9745B" />
              <stop offset="100%" stopColor="#4B2E2B" />
            </linearGradient>

            <clipPath id="coffee-clip">
              <rect x={cupX} y={cupY} width={cupWidth} height={cupHeight} rx={8} />
            </clipPath>
          </defs>

          {/* Cup handles */}
          <path
            d="M266 281C297.826 281 328.348 268.463 350.853 246.146C373.357 223.829 386 193.561 386 162C386 130.439 373.357 100.171 350.853 77.8543C328.348 55.5375 297.826 43 266 43L266 83.1107C287.099 83.1107 307.333 91.4223 322.252 106.217C337.171 121.011 345.552 141.077 345.552 162C345.552 182.923 337.171 202.989 322.252 217.783C307.333 232.578 287.099 240.889 266 240.889L266 281Z"
            fill="url(#handle-shade)"
          />
          <g transform="translate(265,0) scale(-1,1)">
            <path
              d="M266 281C297.826 281 328.348 268.463 350.853 246.146C373.357 223.829 386 193.561 386 162C386 130.439 373.357 100.171 350.853 77.8543C328.348 55.5375 297.826 43 266 43L266 83.1107C287.099 83.1107 307.333 91.4223 322.252 106.217C337.171 121.011 345.552 141.077 345.552 162C345.552 182.923 337.171 202.989 322.252 217.783C307.333 232.578 287.099 240.889 266 240.889L266 281Z"
              fill="transparent"
            />
          </g>

          {/* Cup body with shading */}
          <path
            d="M0 0.25061H265.884V304C265.884 312.284 259.168 319 250.884 319H15C6.71572 319 0 312.284 0 304V0.25061Z"
            fill="url(#cup-body-grad)"
          />

          {/* Cup inner highlight */}
          <path
            d="M35.7621 0.25061H230.122V277.46C230.122 280.222 227.883 282.46 225.122 282.46H40.7621C38.0007 282.46 35.7621 280.222 35.7621 277.46V0.25061Z"
            fill="white"
            fillOpacity="0.25"
          />

          {/* Animated coffee fill using a group scaled from the bottom */}
          {/* Coffee fill */}
          <clipPath id="coffee-clip">
            <rect x={cupX} y={cupY} width={cupWidth} height={cupHeight} rx={8} />
          </clipPath>

          <g clipPath="url(#coffee-clip)">
            {/* Rect below wave */}
            <rect
              x={cupX}
              y={fillY}
              width={cupWidth}
              height={cupY + cupHeight - fillY}
              fill="url(#coffee-gradient)"
              style={{ transition: "height 0.5s, y 0.5s" }}
            />

            {/* Wavy top */}
            <path
              d={`
                M${cupX},${fillY}
                C${cupX + cupWidth * 0.25},${fillY - waveTop}
                ${cupX + cupWidth * 0.75},${fillY + waveTop}
                ${cupX + cupWidth},${fillY}
                L${cupX + cupWidth},${cupY + cupHeight}
                L${cupX},${cupY + cupHeight}
                Z
              `}
              fill="url(#coffee-gradient)"
              style={{ transition: "d 0.5s" }}
            />
          </g>
        </svg>

        {/* centered white text over the mug */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className={`${isLabelCovered ? 'text-white' : 'text-black'} font-extrabold text-2xl`}>{value}m</h1>
        </div>
      </div>

      <div className="w-full flex justify-center -mt-4">
        <FlatSlider value={value} onChange={onChange ?? (() => {})} min={min} max={maxMinutes} step={step} />
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
