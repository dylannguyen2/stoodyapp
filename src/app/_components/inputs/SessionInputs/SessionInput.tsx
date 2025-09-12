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
  handleOnExited
}: SessionInputProps) {
  return (
    <>
    {sessionCreateState === "name" && (
        <StickyNotes
          name={name}
          setName={setName}
          nextSessionState={nextSessionState}
          handleStartSession={handleStartSession}
          isExiting={isExiting}
          onExited={handleOnExited}
        />
      )}
      {sessionCreateState === "stoody" && (
        <StoodyInput
          value={stoody}
          onChange={(v) => setStoody(v)}
          maxMinutes={120}
          isExiting={isExiting}
          onExited={handleOnExited}
        />
      )}
      {sessionCreateState === "shortBreak" && (
        <ShortBreakInput
          value={shortBreak}
          onChange={setShortBreak}
          maxMinutes={60}
          isExiting={isExiting}
          onExited={handleOnExited}
        />
      )}
      {sessionCreateState === "longBreak" && (
        <LongBreakInput
          value={longBreak}
          onChange={setLongBreak}
          maxMinutes={120}
          isExiting={isExiting}
          onExited={handleOnExited}
        />
      )}
      {sessionCreateState === "cycles" && (
        <CycleInput
          value={cycles}
          onChange={setCycles}
          isExiting={isExiting}
          onExited={handleOnExited}
        />
      )}
    </>
  )
}