import React from 'react';
import FlatSlider from './FlatSlider';

interface CoffeeSliderProps {
  maxMinutes?: number;
  value?: number;
  onChange?: (v: number) => void;
  isExiting?: boolean;
  onExited?: () => void;
  size: number;
}

export default function CoffeeSlider({
  value = 15,
  onChange,
  maxMinutes = 60,
  isExiting = false,
  onExited,
  size
}: CoffeeSliderProps) {
  // Base SVG coordinate system (keeps original drawing coordinates)
  const BASE_W = 386;
  const BASE_H = 319;

  // clamp requested size to sensible range
  const svgHeight = Math.max(48, Math.round(size));
  const svgWidth = Math.max(48, Math.round((BASE_W / BASE_H) * svgHeight));

  // base cup geometry (original coordinates) — calculations remain in base coords
  const cupWidth = 194.36;
  const cupHeight = 277.21;
  const cupX = 35.76;
  const cupY = 0.25;
  const waveHeight = 12;

  // fill math (in base coords)
  const fillScale = Math.max(0, Math.min(1, (value ?? 0) / maxMinutes));
  const waveTop = value === 0 ? 0 : waveHeight;
  const fillHeight = fillScale * cupHeight;
  const fillY = cupY + cupHeight - fillHeight;
  const mugCenterY = cupY + cupHeight / 2;
  const isLabelCovered = fillY <= mugCenterY;

  const min = 0;
  const step = 5;

  const viewBoxX = -120;
  const viewBoxWidth = BASE_W + 120;

  const cupTopY = 0.25;
  const cupBottomY = 319;
  const handleTopY = 43;
  const handleBottomY = 281;

const viewBoxMinY = Math.min(cupTopY, handleTopY);
const viewBoxMaxY = Math.max(cupBottomY, handleBottomY);

const viewBoxHeight = viewBoxMaxY - viewBoxMinY;

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // unique ids for defs/clipPath to avoid collisions
  const id = React.useId();
  const clipId = `coffee-clip-${id}`;
  const handleShadeId = `handle-shade-${id}`;
  const cupBodyGradId = `cup-body-grad-${id}`;
  const coffeeGradId = `coffee-gradient-${id}`;

  // font sizing proportional to visible svg height
  const labelFontSize = Math.max(10, Math.round(svgHeight * 0.1));

  return (
    <div
      className={`flex flex-col items-center transform transition-transform transition-opacity duration-200 ease-out ${
        isExiting
          ? 'opacity-0 scale-95 translate-y-2'
          : mounted
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      {isExiting && onExited ? <ExitCaller onExited={onExited} /> : null}

      <div className="relative border border-red-500" style={{ width: svgWidth }}>
        <svg
          width="100%"
          height="auto"
          viewBox={`${viewBoxX} ${viewBoxMinY} ${viewBoxWidth} ${viewBoxHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id={handleShadeId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E0E0E0" />
              <stop offset="100%" stopColor="#B0B0B0" />
            </linearGradient>

            <linearGradient id={cupBodyGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0F0F0" />
              <stop offset="70%" stopColor="#D9D9D9" />
              <stop offset="100%" stopColor="#C4C4C4" />
            </linearGradient>

            <linearGradient id={coffeeGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A9745B" />
              <stop offset="100%" stopColor="#4B2E2B" />
            </linearGradient>

            <clipPath id={clipId}>
              <rect x={cupX} y={cupY} width={cupWidth} height={cupHeight} rx={8} />
            </clipPath>
          </defs>

          {/* Cup handles */}
          <path
            d="M266 281C297.826 281 328.348 268.463 350.853 246.146C373.357 223.829 386 193.561 386 162C386 130.439 373.357 100.171 350.853 77.8543C328.348 55.5375 297.826 43 266 43L266 83.1107C287.099 83.1107 307.333 91.4223 322.252 106.217C337.171 121.011 345.552 141.077 345.552 162C345.552 182.923 337.171 202.989 322.252 217.783C307.333 232.578 287.099 240.889 266 240.889L266 281Z"
            fill={`url(#${handleShadeId})`}
          />

          {/* <g transform="translate(0,0) scale(-1,1)">
            <path
              d="M266 281C297.826 281 328.348 268.463 350.853 246.146C373.357 223.829 386 193.561 386 162C386 130.439 373.357 100.171 350.853 77.8543C328.348 55.5375 297.826 43 266 43L266 83.1107C287.099 83.1107 307.333 91.4223 322.252 106.217C337.171 121.011 345.552 141.077 345.552 162C345.552 182.923 337.171 202.989 322.252 217.783C307.333 232.578 287.099 240.889 266 240.889L266 281Z"
              fill={`url(#${handleShadeId})`}
            />
          </g> */}
        

          {/* Cup body with shading */}
          <path
            d="M0 0.25061H265.884V304C265.884 312.284 259.168 319 250.884 319H15C6.71572 319 0 312.284 0 304V0.25061Z"
            fill={`url(#${cupBodyGradId})`}
          />

          {/* Cup inner highlight */}
          <path
            d="M35.7621 0.25061H230.122V277.46C230.122 280.222 227.883 282.46 225.122 282.46H40.7621C38.0007 282.46 35.7621 280.222 35.7621 277.46V0.25061Z"
            fill="white"
            fillOpacity="0.25"
          />

          {/* Coffee fill (clipped) */}
          <g clipPath={`url(#${clipId})`}>
            <rect
              x={cupX}
              y={fillY}
              width={cupWidth}
              height={cupY + cupHeight - fillY}
              fill={`url(#${coffeeGradId})`}
              style={{ transition: "height 0.5s, y 0.5s" }}
            />

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
              fill={`url(#${coffeeGradId})`}
              style={{ transition: "d 0.5s" }}
            />
          </g>
        </svg>

        {/* centered text over the mug, font sized proportional to svg height */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1
            style={{
              fontSize: `${labelFontSize}px`,
              lineHeight: 1,
              margin: 0,
            }}
            className={`${isLabelCovered ? 'text-white' : 'text-black'} font-extrabold`}
          >
            {value}m
          </h1>
        </div>
      </div>

      <div
      className="w-full flex justify-center"
      style={{paddingTop: svgHeight * 0.1, paddingBottom: svgHeight * 0.1}}
      >
        <FlatSlider value={value} onChange={onChange ?? (() => {})} min={min} max={maxMinutes} step={step} sliderWidth={svgWidth * 1.2} />
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
