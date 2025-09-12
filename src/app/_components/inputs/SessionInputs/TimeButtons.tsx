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
    <div className="flex flex-wrap justify-center gap-6 min-h-[54px]">
      {options.map((opt) => (
        <TimeButton
          key={opt}
          text={sessionCreateState === 'cycles' ? `${opt} Cycles` : `${opt}m`}
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
