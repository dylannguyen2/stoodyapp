import { useState, useEffect, useRef, useMemo } from 'react';
import Skip from './controls/Skip';
import Reset from './controls/Reset';
import Playback from './controls/Playback';
import PhaseButton from 'db/app/_components/controls/Phase';
import StoodyIcon from './icons/StoodyIcon';
import AudioIcon from './icons/AudioIcon';
import CircularButton from './inputs/CircularButton';
import BackIcon from './icons/BackIcon';
import NextIcon from './icons/NextIcon';
import useWindowSize from './hooks/useWindowSize';
// import EditUI from './inputs/EditUI';



type Settings = { stoody: number; shortBreak: number; longBreak: number; cycles: number };

interface TimerProps {
  stoody: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
  onPhaseChange?: (phase: 'stoody' | 'shortBreak' | 'longBreak' | 'transition') => void;
  onSettingsSave?: (s: Settings) => void;
  editOpen?: boolean;
  onEditOpenChange?: (open: boolean) => void;
}
export default function Timer({ stoody, shortBreak, longBreak, cycles, onPhaseChange, onSettingsSave, editOpen: editOpenProp, onEditOpenChange }: TimerProps) {
  const [localStoody, setLocalStoody] = useState<number>(stoody);
  const [localShortBreak, setLocalShortBreak] = useState<number>(shortBreak);
  const [localLongBreak, setLocalLongBreak] = useState<number>(longBreak);
  const [localCycles, setLocalCycles] = useState<number>(cycles);
  const [internalEditOpen, setInternalEditOpen] = useState(false);
  const editOpen = typeof editOpenProp === 'boolean' ? editOpenProp : internalEditOpen;
  const setEditOpen = (v: boolean) => {
    if (typeof onEditOpenChange === 'function') onEditOpenChange(v);
    else setInternalEditOpen(v);
  };

  useEffect(() => setLocalStoody(stoody), [stoody]);
  useEffect(() => setLocalShortBreak(shortBreak), [shortBreak]);
  useEffect(() => setLocalLongBreak(longBreak), [longBreak]);
  useEffect(() => setLocalCycles(cycles), [cycles]);

  const [timer, setTimer] = useState(5);
  const [isRunning, setIsRunning] = useState(true);
  const [phase, setPhase] = useState<'stoody' | 'shortBreak' | 'longBreak' | 'transition'>('transition');
  const [cycleCount, setCycleCount] = useState(1);
  const [step, setStep] = useState(-1);
  const [audioOn, setAudioOn] = useState(true);

  const audioToggle = () => { setAudioOn(!audioOn); }
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const timeline = ['stoody', 'shortBreak', 'stoody', 'shortBreak', 'stoody', 'longBreak'];
  const timePerCycle = 3 * localStoody + 2 * localShortBreak + localLongBreak;
  const { width, height } = useWindowSize();

  function timeRemaining() {
    let time = 0;
    let temp = step + 1;
    if (phase === 'transition' && step == 5) {
      temp = -1;
    }
    if (phase === "stoody" || phase === "shortBreak" || phase === "longBreak") {
      time += timer / 60;
    }

    let currentPhase;
    while (temp < timeline.length) {
      currentPhase = timeline[temp];
      if (currentPhase === 'stoody') time += localStoody;
      else if (currentPhase === 'shortBreak') time += localShortBreak;
      else if (currentPhase === 'longBreak') time += localLongBreak;
          temp++;
    }
    let numberFullCyclesLeft = cycles - cycleCount;
    time += numberFullCyclesLeft * timePerCycle;
    return time;
  }

  function percentageComplete() {
    const totalTime = localCycles * timePerCycle;
    return 100 - Math.floor((timeRemaining() / totalTime) * 100);
  }

  function nextPhase() {
    const nextStep = (step + 1) % timeline.length;
    if (timeline[step] === 'longBreak' && cycleCount + 1 > cycles) {
      return "Session Complete!";
    }
    const nextPhase = timeline[nextStep];
    return nextPhase === 'stoody' ? `${localStoody}-min stoody`
    : nextPhase === 'shortBreak' ? `${localShortBreak}-min Short Break`
    : nextPhase === 'longBreak' ? `${localLongBreak}-min Long Break`
    : 'Transition';
  }

  function setNextPhase(phase: string) {
    let time = phase === 'stoody' ? localStoody * 60 : phase === 'shortBreak' ? localShortBreak * 60 : phase === 'longBreak' ? localLongBreak * 60 : 5;
    let numSteps = findNextPhase(phase);

    if (step + numSteps >= timeline.length) {
      setStep((step + numSteps) % timeline.length); 
      if (cycleCount + 1 <= cycles) {
        setCycleCount(cycleCount + 1);
      }
    } else {
      setStep(step + numSteps);
    }
    setPhase(phase as 'stoody' | 'shortBreak' | 'longBreak' | 'transition');
    setTimer(time);
  }

  function findNextPhase(phase: string) {
    let temp = step;
    let numSteps = 0
    while (timeline[temp] !== phase) {
      temp = (temp + 1) % timeline.length;
      numSteps += 1;
    }
    return numSteps;
  }

  const phaseLabel = phase === 'stoody' ? 'Work' : phase === 'shortBreak' ? 'Short Break' : phase === 'longBreak' ? 'Long Break' : 'Transition';
  const percentComplete = useMemo(() => percentageComplete(), [timer, phase, cycleCount, localStoody, localShortBreak, localLongBreak, localCycles]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    try {
      const a = new Audio('/alarm.wav');
      a.preload = 'auto';
      audioRef.current = a;
    } catch (err) {
      audioRef.current = null;
    }
    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {}
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isRunning || timer > 0) return;

    if (phase !== "transition" && audioOn) {
      try {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          void audioRef.current.play();
        }
      } catch (e) {
      }
    }
    handleSkip();
  }, [timer, phase, isRunning, localCycles, localStoody, localShortBreak, localLongBreak, cycleCount]);

  useEffect(() => {
    const prevTitle = document.title;
    const mm = String(Math.floor(timer / 60)).padStart(2, '0');
    const ss = String(timer % 60).padStart(2, '0');
    const runState = isRunning ? '' : ' (Paused)';
    document.title = `Stoody | ${phaseLabel} ${mm}:${ss}${runState}`;
    return () => {
      document.title = prevTitle;
    };
  }, [timer, phase, isRunning]);

  useEffect(() => {
    if (onPhaseChange) onPhaseChange(phase);
  }, [phase, onPhaseChange]);

  const handleReset = () => {
  setIsRunning(false);
  setPhase('stoody');
  setTimer(localStoody * 60);
  setCycleCount(1);
  };

  const handlePausePlay = () => {
    if (isRunning) {
      setIsRunning(false);
    }
    else {
      setIsRunning(true);
    }
  };

  const handleSkip = () => {
    if (phase === 'stoody' || phase === 'shortBreak' || phase === 'longBreak') {
      if (phase === 'longBreak') {
        const nextCycle = cycleCount + 1;
        if (nextCycle > cycles) {
          setIsRunning(false);
        }
        else {
          setCycleCount(nextCycle);
        }
      }
      setPhase('transition');
      setTimer(5);
      return;
    }

    if (phase === 'transition') {
      const nextStep = (step + 1) % timeline.length;
      const nextPhase = timeline[nextStep] as 'stoody' | 'shortBreak' | 'longBreak';

      setPhase(nextPhase);
    if (nextPhase === 'stoody') setTimer(localStoody * 60);
    else if (nextPhase === 'shortBreak') setTimer(localShortBreak * 60);
    else if (nextPhase === 'longBreak') setTimer(localLongBreak * 60);

        setStep(nextStep);
      }
    };

  const handlePrevStep = () => {
    if (step === 0 && cycleCount === 1) return;
    const prev = step === -1 ? timeline.length - 1 : (step - 1 + timeline.length) % timeline.length;
    const prevPhase = timeline[prev] as 'stoody' | 'shortBreak' | 'longBreak';

    if (step === 0 && cycleCount > 1) {
      setCycleCount((c) => c - 1);
    }

    setStep(prev);
    setPhase(prevPhase);
    if (prevPhase === 'stoody') setTimer(localStoody * 60);
    else if (prevPhase === 'shortBreak') setTimer(localShortBreak * 60);
    else if (prevPhase === 'longBreak') setTimer(localLongBreak * 60);
  };

  const handleNextStep = () => {
    if (step === (timeline.length - 1) && cycleCount === cycles) return;
    const nextIndex = (step + 1) % timeline.length;
    const nextPhase = timeline[nextIndex] as 'stoody' | 'shortBreak' | 'longBreak';
    setNextPhase(nextPhase);
  };

  // --- Circular slider helpers (copied/adapted from CircularSlider) ---
  const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
    return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
  }

  const totalSeconds =
    phase === 'stoody' ? localStoody * 60 : phase === 'shortBreak' ? localShortBreak * 60 : phase === 'longBreak' ? localLongBreak * 60 : 5;

   useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const editable =
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target.isContentEditable;
        if (editable) return;
      }

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handlePausePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevStep();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextStep();
      }
    };

     window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePausePlay, handlePrevStep, handleNextStep]);

  //////////////////////////////////////////////////////////////////////////
  // UI SIZING
  //////////////////////////////////////////////////////////////////////////

  const GLOBAL_SCALE = 0.85;

  const BASE_SIZE = 600;

const shortestSide = Math.min(width, height);
const longestSide = Math.max(width, height);

// scaleFactor grows with viewport, clamped for usability
const scaleFactor = Math.max(0.5, Math.min(2, shortestSide / BASE_SIZE));

const MIN_SVG_SIZE = 220;
const svgSize = Math.max(MIN_SVG_SIZE, Math.round(shortestSide * 0.5 * GLOBAL_SCALE));
const center = svgSize / 2;
const strokeWidth = Math.max(4, 0.15 * center);
const radius = center - strokeWidth / 2;
const timerFont = Math.max(18, Math.round(28 * scaleFactor))

const headerFontSize = Math.max(16, Math.round(svgSize * 0.06));

const phaseButtonSpacing = 0.0625 * svgSize;
const phaseButtonSize = Math.max(1.25 * 0.33 * (svgSize - 2 * phaseButtonSpacing), 84);

const iconSize = Math.max(20, 0.075 * svgSize);
const arrowSpacing = 0.1 * svgSize;
const arrowSize = Math.max(48, 0.12 * svgSize);
const arrowIconSize = Math.round(arrowSize * 0.6);

const nextPhasePadding = Math.max(8, 0.045 * svgSize);

const controlSize = Math.max(48, 0.16 * svgSize);
const controlFont = 1/4 * controlSize;

const gapSize = Math.max(32, 0.1 * svgSize);

//////

const containerRef = useRef<HTMLDivElement | null>(null);
const [showArrows, setShowArrows] = useState(true);

const horizontalPadding = Math.max(12, Math.round(0.12 * svgSize));

const rafRef = useRef<number | null>(null);
const lastShowRef = useRef<boolean | null>(null);

useEffect(() => {
  const el = containerRef.current;
  if (!el) return;

  const measure = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const totalNeeded = 2 * (arrowSize + 2 * arrowSpacing) + svgSize;
    const shouldShow = totalNeeded <= containerWidth;
    if (lastShowRef.current !== shouldShow) {
      lastShowRef.current = shouldShow;
      setShowArrows(shouldShow);
    }
  };

  const ro = new ResizeObserver(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(measure);
  });
  ro.observe(el);

  const onWin = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(measure);
  };
  window.addEventListener('resize', onWin, { passive: true });

  measure();

  return () => {
    ro.disconnect();
    window.removeEventListener('resize', onWin);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };
}, [svgSize, arrowSize, arrowSpacing, horizontalPadding]);

  const valueRatio = useMemo(() => clamp(timer / Math.max(1, totalSeconds), 0, 1), [timer, totalSeconds]);
  const startAngle = 0;
  const endAngle = useMemo(() => startAngle + valueRatio * 360, [valueRatio]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const dashOffset = useMemo(() => circumference * (1 - valueRatio), [circumference, valueRatio]);

  const isAtStart = cycleCount === 1 && step <= 0;
  const isFinished = cycleCount === cycles && phase === 'longBreak';

  return (
    <div
    ref={containerRef}
    className="flex flex-col items-center w-full">
      <h1
        className="text-2xl text-black inter-bold"
        style={{ fontSize: headerFontSize, paddingBottom: arrowSpacing}}
        >
        Cycle: {cycleCount} of {cycles}: {percentComplete}% complete
      </h1>
      <div className="flex"
        style={{ gap: phaseButtonSpacing, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <PhaseButton onClick={setNextPhase} currentPhase={phase} phase="stoody" size={phaseButtonSize} />
        <PhaseButton onClick={setNextPhase} currentPhase={phase} phase="shortBreak" size={phaseButtonSize} />
        <PhaseButton onClick={setNextPhase} currentPhase={phase} phase="longBreak" size={phaseButtonSize} />
      </div>
      
      <div
        className="relative flex items-center justify-center"
        style={{
          // width: 'clamp(260px, 100vw, 1200px)',
          paddingTop: arrowSpacing,
          paddingLeft: horizontalPadding,
          paddingRight: horizontalPadding,
          gap: arrowSpacing,
          boxSizing: 'border-box',
        }}
      >
        <div
          className="flex-shrink-0"
          style={{
            width: arrowSize,
            height: arrowSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {(!isAtStart) && showArrows && (
            <CircularButton
              icon={<BackIcon width={arrowIconSize} height={arrowIconSize} />}
              onClick={handlePrevStep}
              gradient={
                phase === "stoody" ? "from-[#C18FFF] to-[#8B5CF6]"
                : phase === "shortBreak" ? "from-[#2BB5A3] to-[#1E8771]"
                : phase === "longBreak" ? "from-[#4CAF50] to-[#3D9440]"
                : "from-[#9CA3AF] to-[#6B7280]"
               }
               shadow={
                phase === "stoody" ? "8B5CF6"
                : phase === "shortBreak" ? "1E8771"
                : phase === "longBreak" ? "3D9440"
                : "6B7280"
               }
              title="Back"
              size={arrowSize}
            />
          )}
        </div>
        
        {/* svg wrapper: don't let flex shrink it */}
        <div className="relative flex items-center justify-center" style={{ flex: "1 1 auto" }}>
          <svg
            width={svgSize}
            height={svgSize}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            preserveAspectRatio="xMidYMid meet"
            className=""
            style={{
              minWidth: `${MIN_SVG_SIZE}px`,
              minHeight: `${MIN_SVG_SIZE}px`,
              flexShrink: 0,
              display: 'block',
            }}
          >
          {/* Track */}
          <circle cx={center} cy={center} r={radius} stroke="#E6E6E6" strokeWidth={strokeWidth} fill="none" />
          {useMemo(() => (
            <defs>
              <linearGradient id="stoodyGradient" gradientTransform="rotate(90)">
                <stop offset="0%" stopColor="#C18FFF" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="shortBreakGradient" gradientTransform="rotate(90)">
                <stop offset="0%" stopColor="#2BB5A3" />
                <stop offset="100%" stopColor="#1E8771" />
              </linearGradient>
              <linearGradient id="longBreakGradient" gradientTransform="rotate(90)">
                <stop offset="0%" stopColor="#4CAF50" />
                <stop offset="100%" stopColor="#3D9440" />
              </linearGradient>
              <linearGradient id="transitionGradient" gradientTransform="rotate(90)">
                <stop offset="0%" stopColor="#9CA3AF" />
                <stop offset="100%" stopColor="#6B7280" />
              </linearGradient>
            </defs>
          ), [])}

          {useMemo(() =>
            Array.from({ length: 8 }, (_, i) => {
              const angle = i * 45;
              const inner = polarToCartesian(center, center, radius - strokeWidth / 2 - 10, angle);
              const outer = polarToCartesian(center, center, radius - strokeWidth / 2 - 20, angle);
              return (
                <line
                  key={i}
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="#D1D5DB"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              );
            }), [center, radius, strokeWidth])}

          {/* Animated progress using stroke-dashoffset for smooth transitions */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke= {
              phase === "stoody" ? "url(#stoodyGradient)"
              : phase === "shortBreak" ? "url(#shortBreakGradient)"
              : phase === "longBreak" ? "url(#longBreakGradient)"
              : "url(#transitionGradient)"}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: 'stroke-dashoffset 360ms cubic-bezier(0.22,1,0.36,1)', willChange: 'stroke-dashoffset' }}
          />
          </svg>

          {/* overlay moved inside svg wrapper so it's centered on the circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              {width > 350 && (<button
                aria-label="Mute timer audio"
                title="Mute timer audio"
                onClick={() => audioToggle()}
                className="p-1 rounded-md hover:bg-black/5 cursor-pointer"
                style={{ width: iconSize + 6, height: iconSize + 6 }}
              >
                <AudioIcon
                  silent={!audioOn}
                  phase={phase}
                  width={iconSize}
                  height={iconSize}
                />
              </button>
              )}
 
              <span style={{ fontSize: timerFont }} className="font-extrabold inter-bold">
               {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
               </span>
 
              {width > 350 && (<button
                aria-label="Edit session settings"
                title="Edit session settings"
                onClick={() => setEditOpen(true)}
                className="p-1 rounded-md hover:bg-black/5 cursor-pointer"
                style={{ width: iconSize + 6, height: iconSize + 6 }}
              >
                <StoodyIcon
                  width={iconSize}
                  height={iconSize}
                  phase={phase}
                />
              </button>
              )}
            </div>
          </div>
        </div>
 
         {/* next button: positioned to the right */}
           <div
              className="flex-shrink-0"
              style={{
                width: arrowSize,
                height: arrowSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
             {(!isFinished) && showArrows && (
             <CircularButton
               icon={<NextIcon
                height={arrowIconSize}
                width={arrowIconSize}
                />}
               onClick={handleNextStep}
               gradient={
                phase === "stoody" ? "from-[#C18FFF] to-[#8B5CF6]"
                : phase === "shortBreak" ? "from-[#2BB5A3] to-[#1E8771]"
                : phase === "longBreak" ? "from-[#4CAF50] to-[#3D9440]"
                : "from-[#9CA3AF] to-[#6B7280]"
               }
               shadow={
                phase === "stoody" ? "8B5CF6"
                : phase === "shortBreak" ? "1E8771"
                : phase === "longBreak" ? "3D9440"
                : "6B7280"
               }
               title="Next"
               size={arrowSize}
             />
             )}
           </div>
        
      </div>

      <div
      className="text-[#6B7280]"
      style={{ 
        paddingTop: nextPhasePadding,
        paddingBottom: nextPhasePadding,
        fontSize: controlFont,
       }}>
        Next: {nextPhase()}
      </div>

      <div className="flex mt-1" style={{ gap: `${gapSize}px` }}>
        <div className="flex flex-col items-center">
          <Reset onClick={handleReset} size={controlSize} />
          <div 
            className={`mt-2 bg-gradient-to-r from-[#F87171] to-[#DC2626] bg-clip-text text-transparent`}
            style={{ fontSize: controlFont }}
          >
            Reset
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Playback onClick={handlePausePlay} sessionState={phase} isRunning={isRunning} size={controlSize} />
          <div
            className={`mt-2 bg-gradient-to-r bg-clip-text text-transparent
              ${phase === "stoody" ? "from-[#C18FFF] to-[#8B5CF6]" 
              : phase === "shortBreak" ? "from-[#2BB5A3] to-[#1E8771]" 
              : phase === "longBreak" ? "from-[#4CAF50] to-[#3D9440]" 
              : "from-[#9CA3AF] to-[#6B7280]"}
            `}
            style={{ fontSize: controlFont }}
          >
            {isRunning ? 'Pause' : 'Play'}
          </div>

        </div>
        <div className="flex flex-col items-center">
          <Skip onClick={handleSkip} size={controlSize} />
          <div
            className={`mt-2 text-lg bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent`}
            style={{ fontSize: controlFont }}
          >
            Skip
          </div>
        </div>
      </div>
     </div>
   );
 }



