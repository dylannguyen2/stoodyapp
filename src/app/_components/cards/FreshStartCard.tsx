import Button from "../inputs/Button"

export default function FreshStartCard({ onClick }: { onClick: () => void }) {
  return (
  <div className="relative w-2/5 bg-white rounded-lg shadow-md border border-[#E0E0E0] p-4">
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-xl font-semibold">Start Fresh</h1>
        <h2 className="text-lg gochi-hand-regular"> Create a new stoody session from scratch</h2>
        <img src="/plant.png" alt="Fresh Start Illustration" className="w-1/3" />
      </div>

      <div className="mt-4 flex justify-end">
          <Button 
            text="Customise!"
            onClick={onClick}
            gradient="from-[#00C2FF] to-[#0077FF]"
            shadow="005bb5"
          />
      </div>
    </div>
  )
}