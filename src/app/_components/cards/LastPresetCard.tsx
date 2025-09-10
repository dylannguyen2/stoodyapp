import StoodyIcon from "../icons/StoodyIcon"
import ShortBreakIcon from "../icons/ShortBreakIcon"
import EditIcon from "../icons/EditIcon"
import StoodentIcon from "../icons/StoodentIcon"
import LongBreakIcon from "../icons/LongBreakIcon"
import CycleIcon from "../icons/CycleIcon"
import QuickStartButton from "../inputs/QuickStartButton"

interface LastPresetCardProps {
  name: string;
  stoody: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
  onClick?: () => void;
}
export default function LastPresetCard({ name, stoody, shortBreak, longBreak, cycles, onClick }: LastPresetCardProps) {
  return (
    <div className="relative w-2/5 bg-white rounded-lg shadow-md border border-[#E0E0E0] p-4">
      {/* Title + edit button container */}
      <div className="flex justify-center items-center mb-4 relative">
        <h1 className="text-xl font-semibold">Last Used Preset</h1>
        
        {/* Edit button positioned to the right of the container */}
        <button
          aria-label="Edit preset"
          className="absolute right-0 p-2 text-gray-600 cursor-pointer"
          onClick={() => { /* open edit UI */ }}
        >
          <EditIcon />
        </button>
      </div>

      {/* Name */}
      <div className="flex justify-center mb-4 space-x-2">
        <StoodentIcon />
        <div className="text-gray-700 text-sm">{name}</div>
      </div>

      {/* Details row */}
      <div className="flex flex-col space-y-4 items-center">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2 items-center">
            <StoodyIcon />
            <span className="text-gray-700 text-sm">{stoody}-min</span>
          </div>
          <div className="flex space-x-2 items-center">
            <ShortBreakIcon />
            <span className="text-gray-700 text-sm">{shortBreak}-min</span>
          </div>
          <div className="flex space-x-2 items-center">
            <LongBreakIcon />
            <span className="text-gray-700 text-sm">{longBreak}-min</span>
          </div>
          <div className="flex space-x-2 items-center">
            <CycleIcon />
            <span className="text-gray-700 text-sm">{cycles} cycles</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-end">
        <QuickStartButton
          handleClick={onClick ?? (() => {})}
          text="Quick Start"
        />
      </div>
  </div>

  );
}
