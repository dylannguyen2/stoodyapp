import React from 'react';

interface TimeButtonProps {
  text: string;
  value: number; // minutes for the button
  currentTime: number; // current stoody time in minutes
  onClick?: (value: number) => void;
  isExiting?: boolean;
  onExited?: () => void;
}

export default function TimeButton({ text, value, currentTime, onClick, isExiting = false, onExited, }: TimeButtonProps) {
  const isSelected = value === currentTime;

  // Front and back colors depending on selection
  const frontColorClass = isSelected ? 'bg-[#8B5CF6]' : 'bg-[#E1BEE7]';
  const hoverClass = isSelected ? 'hover:bg-[#9D6CFF]' : 'hover:bg-[#F1C4F1]';
  const activeClass = isSelected ? 'active:bg-[#7A4FE0]' : 'active:bg-[#E1BEE7]';

  const backShadowClass = isSelected
    ? 'shadow-[0_2px_4px_rgba(93,33,194,0.4)] top-[2px] bg-[#6F3BDC]'
    : 'shadow-[0_6px_12px_rgba(196,156,207,0.4)] top-[6px] bg-[#C49CCF]';

  return (
    <div
      className={`relative mx-2 transform transition-all duration-700 ease-in-out ${isExiting ? 'opacity-0 scale-75 -translate-y-6' : 'opacity-100 scale-100 translate-y-0'}`}
      style={{ width: 96, height: 54 }}
    >
      {/* exit timer callback */}
      {isExiting && onExited ? <ExitCaller onExited={onExited} /> : null}
      {/* wrapper taller for back layer */}
      <div style={{ width: '96px', height: '54px' }}>
      {/* lower shifted layer */}
      <div className={`absolute left-0 w-full h-[48px] rounded-[10px] ${backShadowClass}`} aria-hidden />

      {/* main button */}
      <button
        type="button"
        onClick={() => onClick?.(value)}
        aria-label={text}
        className={`
          relative w-[96px] h-[48px] rounded-[10px] flex items-center justify-center overflow-hidden
          transition-all duration-150 cursor-pointer
          ${frontColorClass} ${hoverClass} ${activeClass}
        `}
      >
        {/* top gradient highlight */}
        <div
          className="absolute top-0 left-0 w-full h-[15px] rounded-t-[10px] overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0))',
          }}
          aria-hidden
        />
        <span className="relative text-white font-semibold select-none">{text}</span>
      </button>
      </div>
    </div>
  );
}

function ExitCaller({ onExited }: { onExited: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(() => onExited(), 700);
    return () => clearTimeout(t);
  }, [onExited]);
  return null;
}
