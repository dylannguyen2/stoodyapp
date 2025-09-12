'use client';

import React, { useState, useEffect } from "react";

interface CalculatorCyclesProps {
  cycles: number;
  setCycles: (n: number) => void;
  isExiting?: boolean;
  onExited?: () => void;
}

export default function CalculatorCycles({ cycles, setCycles, isExiting = false, onExited }: CalculatorCyclesProps) {
  const [expression, setExpression] = useState<string | null>(null);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  const handlePress = (val: string) => {
    setPressedButton(val);
    setTimeout(() => setPressedButton(null), 150);

    if (val === "C") {
      setExpression(null);
      setCycles(0);
      setJustEvaluated(false);
    } else if (val === "⌫") {
      setExpression((prev) => {
        if (!prev) return null;
        const next = prev.slice(0, -1);
        return next === "" ? null : next;
      });
      setJustEvaluated(false);
    } else if (val === "=" || val === " ") {
      if (!expression) return;
      try {
        const sanitized = expression.replace(/(^|[^0-9.])0+([0-9]+)/g, (_m, p1, p2) => `${p1}${p2}`);
        const result = new Function(`return ${sanitized}`)();
        const bounded = Math.max(0, Math.min(99, Math.floor(Number(result))));
        setCycles(bounded);
        setExpression(bounded.toString());
        setJustEvaluated(true);
      } catch {
        setExpression("Err");
        setJustEvaluated(true);
      }
    } else {
      setExpression((prev) => {
        if (justEvaluated || prev === "Err" || prev === null) {
          setJustEvaluated(false);
          return val;
        }
        return prev + val;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keyMap: Record<string, string> = {
      Space: "=",
      Enter: "=",
      Backspace: "⌫",
      "=": "=",
      "(": "(",
      ")": ")",
      "+": "+",
      "-": "-",
      "*": "×",
      "/": "÷",
      "0": "0",
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      "5": "5",
      "6": "6",
      "7": "7",
      "8": "8",
      "9": "9",
      C: "C",
      c: "C",
    };

    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      handlePress('=');
      return;
    }

    const val = keyMap[e.key];
    if (val) {
      e.preventDefault();
      handlePress(val);
    }
  };

  const buttons = [
    ["(", ")", "C", "⌫"],
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "-"],
    ["", "0", "", "+"],
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (mounted && !isExiting) inputRef.current?.focus();
  }, [mounted, isExiting]);

  return (
   <div
      className={`w-3/4 bg-[#E0D4FF] rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] p-4 flex flex-col items-center pb-4 transform transition-transform transition-opacity duration-200 ease-out ${
        isExiting
          ? 'opacity-0 scale-95 translate-y-2'
          : mounted
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >

      {isExiting && onExited ? <ExitCaller onExited={onExited} /> : null}

      <input
        ref={inputRef}
        type="text"
        value={expression ?? ""}
        readOnly
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          if (justEvaluated) setJustEvaluated(false);
          setExpression(e.target.value === "" ? null : e.target.value);
        }}
        placeholder={cycles.toString()}
        className="
          w-full h-1/4 bg-[#F3E8FF] text-[#8B5CF6] font-mono text-2xl flex items-center justify-end px-4 rounded-xl
          border-2 border-[#D8B4FE] shadow-[inset_0_3px_6px_rgba(139,92,246,0.25)]
        "
      />

      <div className="flex flex-col gap-2 w-full mt-3">
        {buttons.map((row, i) => (
          <div key={i} className="grid grid-cols-4 gap-2">
            {row.map((b, j) =>
              b ? (
                <div key={j} style={{ width: '48px', height: '32px', position: 'relative' }}>
                  {b !== "C" && b !== "⌫" && (
                    <div
                      className="absolute left-0 w-full h-8 rounded-xl shadow-[0_6px_12px_rgba(196,156,207,0.4)] bg-[#C49CCF] top-[6px]"
                      aria-hidden
                    />
                  )}

                  <button
                    onClick={() => handlePress(b === "÷" ? "/" : b === "×" ? "*" : b)}
                    className={`
                      relative w-full h-8 rounded-xl flex items-center justify-center overflow-hidden
                      transition-all duration-150 cursor-pointer
                      ${
                        b === "C" || b === "⌫"
                          ? pressedButton === b
                            ? 'translate-y-[4px] shadow-[0_0px_0px_#AF1010] bg-gradient-to-b from-[#FF5A5A] to-[#DC2626]'
                            : 'bg-gradient-to-b from-[#FF5A5A] to-[#DC2626] shadow-[0_4px_0px_#AF1010] hover:translate-y-[2px] hover:shadow-[0_2px_0px_#AF1010]'
                          : pressedButton === b
                            ? 'translate-y-[4px] shadow-[0_0px_0px_rgba(196,156,207,0.4)] bg-[#E1BEE7]'
                            : 'bg-[#E1BEE7] active:bg-[#E1BEE7] shadow-[0_4px_0px_rgba(196,156,207,0.4)] hover:translate-y-[2px] hover:shadow-[0_2px_0px_rgba(196,156,207,0.4)]'
                      }
                    `}
                  >
                    {/* top gradient highlight */}
                    <div
                      className="absolute top-0 left-0 w-full h-[15px] rounded-t-xl overflow-hidden pointer-events-none"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0))',
                      }}
                      aria-hidden
                    />
                    <span className="relative text-white font-bold">{b}</span>
                  </button>
                </div>
              ) : (
                <div key={j} />
              )
            )}

          </div>
        ))}

        <div className="grid grid-cols-4 gap-2 mt-2">
          <button
            onClick={() => handlePress("=")}
            className={`
              col-span-4 h-8 rounded-xl bg-gradient-to-b from-[#8B5CF6] to-[#6931b0]
              text-white font-bold text-lg
              transition-all duration-150
              ${pressedButton === "=" ? 'translate-y-1 shadow-[0_0px_0px_#5d21c2)]' : 'shadow-[0_4px_0px_#5d21c2] hover:translate-y-[2px] hover:shadow-[0_2px_0px_#5d21c2]'}
            `}
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}

function ExitCaller({ onExited }: { onExited: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onExited(), 200);
    return () => clearTimeout(t);
  }, [onExited]);
  return null;
}
