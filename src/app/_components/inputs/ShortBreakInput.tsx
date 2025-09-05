import CoffeeSlider from './CoffeeSlider';
import React from 'react';

interface StoodyInputProps {
  value: number;
  onChange: (v: number) => void;
  maxMinutes?: number;
  isExiting?: boolean;
  onExited?: () => void;
}

export default function ShortBreakInput({
  value,
  onChange,
  maxMinutes = 60,
  isExiting = false,
  onExited,
}: StoodyInputProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full flex justify-center">
        <CoffeeSlider
          value={value}
          onChange={onChange}
          maxMinutes={maxMinutes}
          isExiting={isExiting}
          onExited={onExited}
        />
      </div>

    </div>
  );
}