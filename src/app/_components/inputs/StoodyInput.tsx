import CircularSlider from './CircularSlider';
import DirectionButton from './DirectionButton';
import TimeButton from './TimeButton';
import React from 'react';

interface StoodyInputProps {
  value: number;
  onChange: (v: number) => void;
  options?: number[];
  maxMinutes?: number;
  sessionCreateState: string;
  nextSessionState: () => void;
  prevSessionState: () => void;
}

export default function StoodyInput({
  value,
  onChange,
  options = [30, 45, 60, 90],
  maxMinutes = 120,
  sessionCreateState,
  nextSessionState,
  prevSessionState,
}: StoodyInputProps) {
  const handleNextClick = () => {
    dirRef.current = 'next';
    setIsExiting(true);
  };
  const handlePrevClick = () => {
    dirRef.current = 'prev';
    setIsExiting(true);
  };
  const [isExiting, setIsExiting] = React.useState(false);

  const dirRef = React.useRef<'next' | 'prev'>('next');
  const handleOnExited = () => {
    setIsExiting(false);
    if (dirRef.current === 'next') nextSessionState();
    else prevSessionState();
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <CircularSlider
        value={value}
        onChange={onChange}
        maxMinutes={maxMinutes}
        isExiting={isExiting}
        onExited={handleOnExited}
      />

      <div className={`text-sm text-gray-700 transform transition-all duration-700 ease-in-out ${isExiting ? 'opacity-0 scale-75 -translate-y-6' : 'opacity-100 scale-100 translate-y-0'}`}>
        Study length: <strong>{value} min</strong>
      </div>

      <div className="flex justify-center gap-4">
        {options.map((opt) => (
          <TimeButton
            key={opt}
            text={`${opt}m`}
            value={opt}
            currentTime={value}
            onClick={(v) => {
              onChange(v);
            }}
            isExiting={isExiting}
            onExited={handleOnExited}
          />
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <DirectionButton handleNextClick={handlePrevClick} sessionCreateState={sessionCreateState} text="Back" />
        <DirectionButton handleNextClick={handleNextClick} sessionCreateState={sessionCreateState} text="Next" />
      </div>
      

    </div>
  );
}