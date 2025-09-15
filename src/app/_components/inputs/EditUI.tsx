import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

type Values = {
  stoody: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
  name?: string;
};

type Props = {
  initial?: Partial<Values>;
  onSave?: (vals: Values) => void;
  onCancel?: () => void;
};

const DEFAULTS: Values = { stoody: 25, shortBreak: 5, longBreak: 15, cycles: 4 };

export default function EditUI({ initial = {}, onSave, onCancel }: Props) {
  const start: Values = { ...DEFAULTS, ...initial };

  const [stoody, setStoody] = useState<number>(start.stoody);
  const [shortBreak, setShortBreak] = useState<number>(start.shortBreak);
  const [longBreak, setLongBreak] = useState<number>(start.longBreak);
  const [cycles, setCycles] = useState<number>(start.cycles);
  const [error, setError] = useState<string | null>(null);


  const validate = (): Values | null => {
    if (stoody < 1 || shortBreak < 1 || longBreak < 1 || cycles < 1) {
      setError('All values must be at least 1');
      return null;
    }
    setError(null);
    return { stoody, shortBreak, longBreak, cycles };
  };

  const handleSave = () => {
    const vals = validate();
    if (vals) onSave?.(vals);
  };

  const handleReset = () => {
    setStoody(DEFAULTS.stoody);
    setShortBreak(DEFAULTS.shortBreak);
    setLongBreak(DEFAULTS.longBreak);
    setCycles(DEFAULTS.cycles);
    setError(null);
  };

  const inputStyle =
    'mt-1 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none text-gray-900 placeholder-gray-400 shadow-sm';

  return (
    <motion.div
      className="max-w-md w-full p-6 bg-white rounded-2xl shadow-xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Session Settings</h3>
        <button
          onClick={handleReset}
          className="text-sm text-indigo-500 underline hover:text-indigo-600 transition cursor-pointer"
        >
          Reset Default
        </button>
      </div>

      <div className="space-y-4">
        <label className="flex flex-col">
          <span className="text-gray-600 font-medium mb-1">Stoody (minutes)</span>
          <input
            type="number"
            min={1}
            step={1}
            value={stoody}
            onChange={(e) => setStoody(Number(e.target.value))}
            className={inputStyle}
            placeholder="25"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-gray-600 font-medium mb-1">Short Break (minutes)</span>
          <input
            type="number"
            min={1}
            step={1}
            value={shortBreak}
            onChange={(e) => setShortBreak(Number(e.target.value))}
            className={inputStyle}
            placeholder="5"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-gray-600 font-medium mb-1">Long Break (minutes)</span>
          <input
            type="number"
            min={1}
            step={1}
            value={longBreak}
            onChange={(e) => setLongBreak(Number(e.target.value))}
            className={inputStyle}
            placeholder="15"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-gray-600 font-medium mb-1">Cycles</span>
          <input
            type="number"
            min={1}
            step={1}
            value={cycles}
            onChange={(e) => setCycles(Number(e.target.value))}
            className={inputStyle}
            placeholder="4"
          />
        </label>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="mt-6 flex justify-center items-center w-full">
        <div className="flex gap-3 w-full justify-center">
          <Button
            onClick={onCancel ?? (() => {})}
            text="Cancel"
            gradient="from-gray-300 to-gray-200"
            shadow="bdbdbd"
            textColour="gray-800"
            className="flex-1 min-w-[120px]"
            /> 
          <Button
            onClick={handleSave}
            text="Save"
            gradient="from-[#C18FFF] to-[#a770ff]"
            shadow="8054c7"
            textColour="white"
            className="flex-1 min-w-[120px] text-[clamp(12px,4vw,20px)]"
          />
        </div>
      </div>
    </motion.div>
  );
}
