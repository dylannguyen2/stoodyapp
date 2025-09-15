import Sundial from './Sundial';
import React from 'react';

interface StoodyInputProps {
  value: number;
  onChange: (v: number) => void;
  maxMinutes?: number;
  isExiting?: boolean;
  onExited?: () => void;
  size: number;
}

export default function LongBreakInput({
  value,
  onChange,
  maxMinutes = 60,
  isExiting = false,
  onExited,
  size
}: StoodyInputProps) {

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full flex justify-center">
        <Sundial
          size={size}
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