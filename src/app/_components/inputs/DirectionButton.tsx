type DirectionButtonProps = {
  handleNextClick: () => void;
  sessionCreateState: string;
  text: string;
};

export default function DirectionButton({ handleNextClick, sessionCreateState, text }: DirectionButtonProps) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <button
        type="button"
        onClick={handleNextClick}
        className="px-3 py-1 rounded bg-[#513690] text-white text-sm hover:bg-[#3f2b6b] transition-colors"
      >
        {text}
      </button>
      <span className="text-sm text-gray-800">State: <strong className="ml-1">{sessionCreateState}</strong></span>
    </div>);
}