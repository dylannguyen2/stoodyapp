import React from 'react';
import Button from '../Button';

interface TimeButtonProps {
  text: string;
  value: number;
  currentTime: number;
  onClick: (value: number) => void;
  isExiting?: boolean;
  onExited?: () => void;
}

export default function TimeButton({
  text,
  value,
  currentTime,
  onClick,
  isExiting = false,
  onExited,
}: TimeButtonProps) {
  const isSelected = value === currentTime;

  const gradient = isSelected
    ? "from-[#8B5CF6] to-[#8B5CF6]"
    : "from-[#E1BEE7] to-[#E1BEE7]";

  const shadowHex = isSelected ? "5d21c2" : "c49ccf";

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`flex flex-col items-center gap-4 transform transition-transform transition-opacity duration-200${
        isExiting
          ? 'opacity-0 scale-95 translate-y-2'
          : mounted
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      {isExiting && onExited ? <ExitCaller onExited={onExited} /> : null}

      <Button
        text={text}
        onClick={() => onClick(value)}
        gradient={gradient}
        shadow={shadowHex}
        className="w-full min-w-[120px] text-base sm:min-w-[140px] lg:min-w-[160px]"
      />
    </div>
  );
}

function ExitCaller({ onExited }: { onExited: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(() => onExited(), 200);
    return () => clearTimeout(t);
  }, [onExited]);
  return null;
}
