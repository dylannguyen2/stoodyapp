import CircularSlider from './CircularSlider';
import React from 'react';

interface StoodyInputProps {
  value: number;
  onChange: (v: number) => void;
  maxMinutes?: number;
  isExiting?: boolean;
  onExited?: () => void;
}

export default function StoodyInput({
  value,
  onChange,
  maxMinutes = 120,
  isExiting = false,
  onExited,
}: StoodyInputProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <CircularSlider
        value={value}
        onChange={onChange}
        maxMinutes={maxMinutes}
        isExiting={isExiting}
        onExited={onExited}
      />

    </div>
  );
}