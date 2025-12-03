import React from 'react';
import TimeButton from './TimeButton';

interface TimeButtonsProps {
  onChange: (v: number) => void;
  value: number;
  isExiting?: boolean;
  onExited?: () => void;
  sessionCreateState: "stoody" | "shortBreak" | "longBreak" | "cycles";
}

export default function TimeButtons({
  onChange,
  value,
  isExiting,
  onExited,
  sessionCreateState,
}: TimeButtonsProps) {

  const options =
    sessionCreateState === "stoody"
      ? [25, 30, 45, 60]
      : sessionCreateState === "shortBreak"
      ? [5, 10, 15, 30]
      : sessionCreateState === "longBreak"
      ? [15, 30, 45, 60]
      : [1, 2, 3, 4];

  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
      {options.map((opt) => (
        <TimeButton
          key={opt}
          text={sessionCreateState === 'cycles' ? `${opt}` : `${opt}m`}
          value={opt}
          currentTime={value}
          onClick={(v) => onChange(v)}
          isExiting={isExiting}
          onExited={onExited}
        />
      ))}
    </div>
  );
}
