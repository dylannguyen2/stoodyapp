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
  windowWidth: number;
  windowHeight: number;
}

export default function ({
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
  windowWidth,
  windowHeight
}: SessionInputProps) {
  const shorterSide = Math.min(windowWidth, windowHeight);
  return (
    <div className="">
    {sessionCreateState === "name" && (
        <StickyNotes
          name={name}
          setName={setName}
          nextSessionState={nextSessionState}
          handleStartSession={handleStartSession}
          isExiting={isExiting}
          onExited={handleOnExited}
          size={shorterSide * 0.4}
        />
      )}
      {sessionCreateState === "stoody" && (
        <StoodyInput
          value={stoody}
          onChange={(v) => setStoody(v)}
          maxMinutes={120}
          isExiting={isExiting}
          onExited={handleOnExited}
          size={shorterSide / 2}
        />
      )}
      {sessionCreateState === "shortBreak" && (
        <ShortBreakInput
          value={shortBreak}
          onChange={setShortBreak}
          maxMinutes={60}
          isExiting={isExiting}
          onExited={handleOnExited}
          size={shorterSide / 2}
        />
      )}
      {sessionCreateState === "longBreak" && (
        <LongBreakInput
          value={longBreak}
          onChange={setLongBreak}
          maxMinutes={120}
          isExiting={isExiting}
          onExited={handleOnExited}
          size={shorterSide /1.5}
        />
      )}
      {sessionCreateState === "cycles" && (
        <CycleInput
          value={cycles}
          onChange={setCycles}
          isExiting={isExiting}
          onExited={handleOnExited}
          size={shorterSide / 2 * 0.9}
        />
      )}
    </div>
  )
}