type QuickStartButtonProps = {
  handleClick: () => void;
  text: string;
};

export default function QuickStartButton({ handleClick, text }: QuickStartButtonProps) {
  return (
    <div className="flex items-center gap-3 relative z-30">
      <button
        type="button"
        onClick={handleClick}
        className="
          px-5 py-2
          w-32 
          rounded-xl 
          bg-gradient-to-b from-[#00C2FF] to-[#0077FF] 
          text-white font-semibold text-base 
          shadow-[0_4px_0px_#005bb5] 
          hover:shadow-[0_2px_0px_#005bb5] 
          hover:translate-y-[2px] 
          active:shadow-[0_0px_0px_#005bb5] 
          active:translate-y-[4px]
          transition-all duration-150
          cursor-pointer
        "
      >
        {text}
      </button>
    </div>
  );
}
