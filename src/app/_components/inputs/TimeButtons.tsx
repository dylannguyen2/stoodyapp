import React from 'react';
import TimeButton from './TimeButton';

interface TimeButtonsProps {
  options: number[];
  onChange: (v: number) => void;
  value: number;
  isExiting?: boolean;
  onExited?: () => void;
  sessionCreateState: string;
}

export default function TimeButtons({
  options,
  onChange,
  value,
  isExiting,
  onExited,
  sessionCreateState,
}: TimeButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-6 min-h-[54px]">
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
