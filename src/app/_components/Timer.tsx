import { useState, useEffect, useRef } from 'react';
import { set } from 'zod/v4';


interface TimerProps {
  stoody: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
}

export default function Timer({ stoody, shortBreak, longBreak, cycles }: TimerProps) {
  const [timer, setTimer] = useState(5);
  const [isRunning, setIsRunning] = useState(true);
  const [phase, setPhase] = useState<'work' | 'shortBreak' | 'longBreak' | 'transition'>('transition');
  const [cycleCount, setCycleCount] = useState(1);
  const [step, setStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const timeline = ['transition', 'work', 'shortBreak', 'work', 'shortBreak', 'work', 'longBreak'];

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
    if (!isRunning || timer > 0) return;

    if (phase == "work" || phase == "shortBreak") {
      setPhase('transition');
      setTimer(5);
    }

    else if (timeline[step] === 'longBreak') {
      setStep(0);
      setPhase('transition');
      setTimer(5);
      setCycleCount(cycleCount + 1);
      if (cycleCount >= cycles) {
        setIsRunning(false);
      }
    }
    else if (phase === 'transition') {
      const nextStep = (step + 1) % timeline.length;
      const nextPhase = timeline[nextStep] as 'work' | 'shortBreak' | 'longBreak' | 'transition';

      setPhase(nextPhase);
      if (nextPhase === 'work') setTimer(stoody * 60);
      else if (nextPhase === 'shortBreak') setTimer(shortBreak * 60);
      else if (nextPhase === 'longBreak') setTimer(longBreak * 60);

      setStep(nextStep);
    }
  }, [timer, phase, isRunning, cycles, stoody, shortBreak, longBreak, cycleCount]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setPhase('work');
    setTimer(stoody * 60);
    setCycleCount(1);
  };

  const handleSkip = () => {
    if (phase == "work" || phase == "shortBreak" || phase == "longBreak") {
      setPhase('transition');
      setTimer(5);
    }
    else if (phase === 'transition') {
      const nextStep = (step + 1) % timeline.length;
      const nextPhase = timeline[nextStep] as 'work' | 'shortBreak' | 'longBreak' | 'transition';

      // If we just finished longBreak, reset for next cycle or stop
      if (timeline[step] === 'longBreak') {
        // If you want to repeat cycles:
        setStep(0);
        setPhase('transition');
        setTimer(5);
        setCycleCount(cycleCount + 1);
        return;
        // If you want to stop after all cycles, setIsRunning(false) here
      }

      setPhase(nextPhase);
      if (nextPhase === 'work') setTimer(stoody * 60);
      else if (nextPhase === 'shortBreak') setTimer(shortBreak * 60);
      else if (nextPhase === 'longBreak') setTimer(longBreak * 60);

      setStep(nextStep);
      setCycleCount(Math.floor(nextStep / 6));
    }
  };

  return (
    <div>
      <div className="mb-2 text-xl font-mono">
        {phase === 'work' && `Work`} 
        {phase === 'shortBreak' && `Short Break`} 
        {phase === 'longBreak' && `Long Break`} 
        {phase === 'transition' && `Transition`}
        <span className={isRunning ? 'ml-2 text-green-600' : 'ml-2 text-red-600'}>
          {isRunning ? '● Running' : '⏸ Paused'}
        </span>
      </div>
      <div className="mb-6 text-4xl font-mono">
        {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
      </div>
      <div className="flex gap-4">
        <button
          onClick={isRunning ? handleStop : handleStart}
          disabled={phase === 'longBreak'}
          className={
            `${isRunning ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded cursor-pointer`
          }
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button onClick={handleReset} className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Reset</button>
        <button onClick={handleSkip} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Skip</button>
      </div>
      <div className="mt-2">Cycle: {cycleCount} / {cycles}</div>
      <div className="mt-2">Step: {step}</div>
    </div>
  );
}