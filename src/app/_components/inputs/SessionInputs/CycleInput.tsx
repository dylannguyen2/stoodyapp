import CalculatorCycles from "./Calculator";
import React from 'react';


interface StoodyInputProps {
  value: number;
  onChange: (v: number) => void;
  options?: number[];
  maxMinutes?: number;
  isExiting?: boolean;
  onExited?: () => void;
  size: number;
}

export default function CycleInput({
  value,
  onChange,
  size,
  isExiting = false,
  onExited,
}: StoodyInputProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center items-center">
        <CalculatorCycles cycles={value} setCycles={onChange} isExiting={isExiting} onExited={onExited} size={size} />
      </div>
    </div>
  )
}