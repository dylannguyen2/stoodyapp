type PhaseButtonProps = {
  onClick: (phase: 'stoody' | 'shortBreak' | 'longBreak' | 'transition') => void;
  currentPhase: 'stoody' | 'shortBreak' | 'longBreak' | 'transition';
  phase: 'stoody' | 'shortBreak' | 'longBreak' | 'transition';
  size?: number; // optional width in px to scale the button
};

export default function PhaseButton({ onClick, currentPhase, phase, size }: PhaseButtonProps) {
  let colour;
  if (phase === "stoody") {
    colour =  currentPhase === 'stoody' ? 'from-[#C18FFF] to-[#8B5CF6] shadow-[0_4px_0px_#8054c7] hover:shadow-[0_2px_0px_#8054c7] hover:translate-y-[2px] active:shadow-[0_0px_0px_#8054c7]'
    : 'from-[#D9D9D9] to-[#D9D9D9] shadow-[0_4px_0px_#B0B0B0] hover:shadow-[0_2px_0px_#B0B0B0] hover:translate-y-[2px] active:shadow-[0_0px_0px_#B0B0B0]';
  }

  else if (phase === "shortBreak") {
    colour = currentPhase === 'shortBreak' ? 'from-[#2BB5A3] to-[#1E8771] shadow-[0_4px_0px_#1E8771] hover:shadow-[0_2px_0px_#1E8771] hover:translate-y-[2px] active:shadow-[0_0px_0px_#1E8771]'
    : 'from-[#D9D9D9] to-[#D9D9D9] shadow-[0_4px_0px_#B0B0B0] hover:shadow-[0_2px_0px_#B0B0B0] hover:translate-y-[2px] active:shadow-[0_0px_0px_#B0B0B0]';
  }
  else if (phase === "longBreak") {
    colour = currentPhase === "longBreak" ? 'from-[#4CAF50] to-[#3D9440] shadow-[0_4px_0px_#357A38] hover:shadow-[0_2px_0px_#357A38] hover:translate-y-[2px] active:shadow-[0_0px_0px_#357A38]'
    : 'from-[#D9D9D9] to-[#D9D9D9] shadow-[0_4px_0px_#B0B0B0] hover:shadow-[0_2px_0px_#B0B0B0] hover:translate-y-[2px] active:shadow-[0_0px_0px_#B0B0B0]';
  }

  // scaling defaults
  const DEFAULT_WIDTH = 160; // w-40 equivalent
  const width = size ?? DEFAULT_WIDTH;
  const paddingY = Math.max(6, Math.round(width * 0.05)); // ~8px for 160
  const paddingX = Math.max(12, Math.round(width * 0.125)); // ~20px for 160
  const fontSize = Math.max(16, Math.round(width * 0.125)); // ~20px for 160

  return (
    <div className="flex items-center gap-3 relative z-30">
      <button
        type="button"
        onClick={() => onClick(phase)}
        className={`
          rounded-xl
          bg-gradient-to-b ${colour}
          text-white font-semibold gochi-hand-regular
          active:translate-y-[4px]
          transition-all duration-150
          cursor-pointer
        `}
        style={{
          width: `${width}px`,
          padding: `${paddingY}px ${paddingX}px`,
          fontSize: `${fontSize}px`,
        }}
      >
        {phase}
      </button>
    </div>
  );
}
