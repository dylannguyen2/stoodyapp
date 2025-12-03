import Button from "../inputs/Button";

export default function FreshStartCard({ onClick }: { onClick: () => void }) {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-[0_6px_18px_rgba(0,0,0,0.08)] sm:p-6">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Start Fresh</h1>
        <h2 className="gochi-hand-regular text-lg text-gray-700 sm:text-xl">
          Create a new stoody session from scratch
        </h2>
        <img
          src="/plant.png"
          alt="Fresh start illustration"
          className="mt-2 h-28 w-auto sm:h-32"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          text="Customise!"
          onClick={onClick}
          gradient="from-[#00C2FF] to-[#0077FF]"
          shadow="005bb5"
          className="min-w-[140px]"
        />
      </div>
    </div>
  );
}
