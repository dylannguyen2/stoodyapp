import StoodyIcon from "../icons/StoodyIcon";
import ShortBreakIcon from "../icons/ShortBreakIcon";
import EditIcon from "../icons/EditIcon";
import StoodentIcon from "../icons/StoodentIcon";
import LongBreakIcon from "../icons/LongBreakIcon";
import CycleIcon from "../icons/CycleIcon";
import Button from "../inputs/Button";

interface LastPresetCardProps {
  name: string;
  stoody: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
  onClick: () => void;
  onEdit: () => void;
}

export default function LastPresetCard({
  name,
  stoody,
  shortBreak,
  longBreak,
  cycles,
  onClick,
  onEdit,
}: LastPresetCardProps) {
  const details = [
    { label: `${stoody}-min`, Icon: StoodyIcon },
    { label: `${shortBreak}-min`, Icon: ShortBreakIcon },
    { label: `${longBreak}-min`, Icon: LongBreakIcon },
    { label: `${cycles} cycles`, Icon: CycleIcon },
  ];

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.08)] sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Last Used Preset</h1>
        <button
          aria-label="Edit preset"
          onClick={onEdit}
          className="rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100"
        >
          <EditIcon width={22} height={22} />
        </button>
      </div>

      <div className="mb-6 flex items-center justify-center gap-3 text-gray-600">
        <StoodentIcon width={28} height={28} />
        <span className="text-lg font-medium sm:text-xl">{name}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-gray-700 sm:gap-6">
        {details.map(({ label, Icon }) => (
          <div key={label} className="flex items-center gap-2 text-base sm:text-lg">
            <Icon width={26} height={26} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          text="Quick Start"
          onClick={onClick}
          gradient="from-[#00C2FF] to-[#0077FF]"
          shadow="005bb5"
          className="min-w-[140px]"
        />
      </div>
    </div>
  );
}
