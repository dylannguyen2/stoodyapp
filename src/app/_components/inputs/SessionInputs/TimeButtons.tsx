import React from 'react';
import TimeButton from './TimeButton';

interface TimeButtonsProps {
  onChange: (v: number) => void;
  value: number;
  isExiting?: boolean;
  onExited?: () => void;
  sessionCreateState: "stoody" | "shortBreak" | "longBreak" | "cycles";
  size: number;
  spacing: number;
}

export default function TimeButtons({
  onChange,
  value,
  isExiting,
  onExited,
  sessionCreateState,
  size,
  spacing
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
    <div
    className="flex flex-wrap justify-center min-h-[54px]"
    style={{ gap: spacing }}
    >
      {options.map((opt) => (
        <TimeButton
          key={opt}
          text={sessionCreateState === 'cycles' ? `${opt}` : `${opt}m`}
          value={opt}
          currentTime={value}
          onClick={(v) => onChange(v)}
          isExiting={isExiting}
          onExited={onExited}
          size={size}
        />
      ))}
    </div>
  );
}
