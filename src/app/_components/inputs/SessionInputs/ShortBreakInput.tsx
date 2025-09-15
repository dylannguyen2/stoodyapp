import CoffeeSlider from './CoffeeSlider';
import React from 'react';

interface StoodyInputProps {
  value: number;
  onChange: (v: number) => void;
  maxMinutes?: number;
  isExiting?: boolean;
  onExited?: () => void;
  size: number;
}

export default function ShortBreakInput({
  value,
  onChange,
  maxMinutes = 60,
  isExiting = false,
  onExited,
  size,
}: StoodyInputProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full flex justify-center pt-8">
        <CoffeeSlider
          value={value}
          onChange={onChange}
          maxMinutes={maxMinutes}
          isExiting={isExiting}
          onExited={onExited}
          size={size}
        />
      </div>

    </div>
  );
}