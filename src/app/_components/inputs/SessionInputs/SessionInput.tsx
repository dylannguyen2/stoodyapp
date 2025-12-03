import { useEffect, useState } from "react";
import StickyNotes from "./StickyNotes";
import StoodyInput from "./StoodyInput";
import ShortBreakInput from "./ShortBreakInput";
import LongBreakInput from "../SessionInputs/LongBreakInput";
import CycleInput from "./CycleInput";

interface SessionInputProps {
  sessionCreateState: string;
  name: string;
  stoody: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
  setName: (v: string) => void;
  setStoody: (v: number) => void;
  setShortBreak: (v: number) => void;
  setLongBreak: (v: number) => void;
  setCycles: (v: number) => void;
  nextSessionState: () => void;
  handleStartSession: () => void;
  isExiting?: boolean;
  handleOnExited?: () => void;
}

const clampSize = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function SessionInput({
  sessionCreateState,
  name,
  stoody,
  shortBreak,
  longBreak,
  cycles,
  setName,
  setStoody,
  setShortBreak,
  setLongBreak,
  setCycles,
  nextSessionState,
  handleStartSession,
  isExiting = false,
  handleOnExited,
}: SessionInputProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(320);

  useEffect(() => {
    if (!container || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [container]);

  const baseSize = clampSize(containerWidth, 220, 520);
  const stickySize = clampSize(baseSize * 0.9, 200, 420);
  const stoodySize = clampSize(baseSize, 240, 520);
  const shortSize = clampSize(baseSize * 0.9, 200, 460);
  const longSize = clampSize(baseSize * 1.05, 250, 540);
  const cyclesSize = clampSize(baseSize * 0.85, 200, 440);

  return (
    <div
      ref={setContainer}
      className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[440px] xl:max-w-[500px]"
    >
    {sessionCreateState === "name" && (
        <StickyNotes
          name={name}
          setName={setName}
          nextSessionState={nextSessionState}
          handleStartSession={handleStartSession}
          isExiting={isExiting}
          onExited={handleOnExited}
          size={stickySize}
        />
      )}
      {sessionCreateState === "stoody" && (
        <StoodyInput
          value={stoody}
          onChange={(v) => setStoody(v)}
          maxMinutes={120}
          isExiting={isExiting}
          onExited={handleOnExited}
          size={stoodySize}
        />
      )}
      {sessionCreateState === "shortBreak" && (
        <ShortBreakInput
          value={shortBreak}
          onChange={setShortBreak}
          maxMinutes={60}
          isExiting={isExiting}
          onExited={handleOnExited}
          size={shortSize}
        />
      )}
      {sessionCreateState === "longBreak" && (
        <LongBreakInput
          value={longBreak}
          onChange={setLongBreak}
          maxMinutes={120}
          isExiting={isExiting}
          onExited={handleOnExited}
          size={longSize}
        />
      )}
      {sessionCreateState === "cycles" && (
        <CycleInput
          value={cycles}
          onChange={setCycles}
          isExiting={isExiting}
          onExited={handleOnExited}
          size={cyclesSize}
        />
      )}
    </div>
  )
}
