'use client';

import React, { useState, useEffect } from "react";

const operatorPrecedence: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
};

const isOperator = (token: string) => token in operatorPrecedence;

const evaluateExpression = (raw: string): number | null => {
  const sanitized = raw.replace(/[^0-9.+\-*/()]/g, '');
  if (!sanitized.trim()) return null;
  const tokens = sanitized.match(/(\d+\.\d+|\d+|[()+\-*/])/g);
  if (!tokens) return null;

  const normalized: string[] = [];
  tokens.forEach((token, index) => {
    const previousToken = index > 0 ? tokens[index - 1] : undefined;
    if (
      token === '-' &&
      (index === 0 || (previousToken !== undefined && (isOperator(previousToken) || previousToken === '(')))
    ) {
      normalized.push('0');
    }
    normalized.push(token);
  });

  const output: (number | string)[] = [];
  const stack: string[] = [];

  for (const token of normalized) {
    if (isOperator(token)) {
      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        if (!top || !isOperator(top)) {
          break;
        }
        const topPrecedence = operatorPrecedence[top];
        const tokenPrecedence = operatorPrecedence[token];
        if (topPrecedence === undefined || tokenPrecedence === undefined || topPrecedence < tokenPrecedence) {
          break;
        }
        output.push(stack.pop()!);
      }
      stack.push(token);
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      while (stack.length > 0 && stack[stack.length - 1] !== '(') {
        output.push(stack.pop()!);
      }
      if (stack.pop() !== '(') {
        return null;
      }
    } else {
      output.push(parseFloat(token));
    }
  }

  while (stack.length > 0) {
    const top = stack.pop();
    if (!top || top === '(' || top === ')') return null;
    output.push(top);
  }

  const valueStack: number[] = [];
  for (const token of output) {
    if (typeof token === 'number') {
      valueStack.push(token);
    } else if (isOperator(token)) {
      const b = valueStack.pop();
      const a = valueStack.pop();
      if (a === undefined || b === undefined) return null;
      switch (token) {
        case '+':
          valueStack.push(a + b);
          break;
        case '-':
          valueStack.push(a - b);
          break;
        case '*':
          valueStack.push(a * b);
          break;
        case '/':
          if (b === 0) return null;
          valueStack.push(a / b);
          break;
        default:
          return null;
      }
    } else {
      return null;
    }
  }

  if (valueStack.length !== 1) return null;
  const result = valueStack[0];
  if (result === undefined) return null;
  return Number.isFinite(result) ? result : null;
};

interface CalculatorCyclesProps {
  cycles: number;
  setCycles: (n: number) => void;
  isExiting?: boolean;
  onExited?: () => void;
  size: number;
}

export default function CalculatorCycles({ cycles, setCycles, isExiting = false, onExited, size }: CalculatorCyclesProps) {
  const [expression, setExpression] = useState<string | null>(null);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  // size-driven layout (all measurements are relative to `size`)
  const width = Math.max(160, Math.round(size));
  const padding = Math.round(width * 0.04);
  const gap = Math.max(6, Math.round(width * 0.02));
  const inputHeight = Math.max(48, Math.round(width * 0.12));
  const inputFontSize = Math.max(16, Math.round(width * 0.06));
  const btnWidth = Math.max(40, Math.round((width - padding * 2 - gap * 3) / 4));
  const btnHeight = Math.max(32, Math.round(btnWidth * 0.5));
  const btnRadius = Math.max(8, Math.round(btnHeight * 0.28));
  const topGradientHeight = Math.max(10, Math.round(btnHeight * 0.45));
  const eqButtonHeight = btnHeight;
  const eqFontSize = Math.max(16, Math.round(width * 0.06));

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
        const evaluation = evaluateExpression(sanitized);
        if (evaluation === null) {
          setExpression("Err");
          setJustEvaluated(true);
          return;
        }
        const bounded = Math.max(0, Math.min(99, Math.floor(evaluation)));
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
      className={`bg-[#E0D4FF] rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] transform transition-transform transition-opacity duration-200 ease-out ${
        isExiting
          ? 'opacity-0 scale-95 translate-y-2'
          : mounted
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2'
      }`}
      style={{ willChange: 'transform, opacity', width: width, padding: padding, paddingBottom: padding * 0.8 }}
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
        className="w-full bg-[#F3E8FF] text-[#8B5CF6] font-mono flex items-center justify-end rounded-xl border-2 border-[#D8B4FE]"
        style={{
          height: inputHeight,
          fontSize: inputFontSize,
          paddingLeft: Math.round(padding * 0.8),
          paddingRight: Math.round(padding * 0.8),
          boxShadow: 'inset 0 3px 6px rgba(139,92,246,0.25)'
        }}
      />

      <div className="flex flex-col gap-2 w-full mt-3" style={{ gap }}>
        {buttons.map((row, i) => (
          <div key={i} className="grid grid-cols-4" style={{ gap }}>
            {row.map((b, j) =>
              b ? (
                <div key={j} style={{ width: btnWidth, height: btnHeight, position: 'relative' }}>
                  {b !== "C" && b !== "⌫" && (
                    <div
                      aria-hidden
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: Math.round(btnHeight * 0.19),
                        width: '100%',
                        height: topGradientHeight,
                        borderRadius: btnRadius,
                        boxShadow: `0 ${Math.round(btnHeight * 0.18)}px ${Math.round(btnHeight * 0.36)}px rgba(196,156,207,0.4)`,
                        background: '#C49CCF',
                        zIndex: 0,
                      }}
                    />
                  )}

                  <button
                    onClick={() => handlePress(b === "÷" ? "/" : b === "×" ? "*" : b)}
                    className="relative w-full rounded-xl flex items-center justify-center overflow-hidden transition-all duration-150 cursor-pointer"
                    style={{
                      height: btnHeight,
                      zIndex: 1,
                      borderRadius: btnRadius,
                      transform: pressedButton === b ? `translateY(${Math.round(btnHeight * 0.12)}px)` : undefined,
                      boxShadow: b === "C" || b === "⌫"
                        ? pressedButton === b
                          ? '0 0 0 #AF1010'
                          : `0 ${Math.round(btnHeight * 0.12)}px 0 #AF1010`
                        : pressedButton === b
                          ? `0 0 0 rgba(196,156,207,0.4)`
                          : `0 ${Math.round(btnHeight * 0.12)}px 0 rgba(196,156,207,0.4)`,
                      background: b === "C" || b === "⌫"
                        ? (pressedButton === b ? 'linear-gradient(to bottom,#FF5A5A,#DC2626)' : 'linear-gradient(to bottom,#FF5A5A,#DC2626)')
                        : (pressedButton === b ? '#E1BEE7' : '#E1BEE7')
                    }}
                  >
                    {/* top gradient highlight */}
                    <div
                      className="absolute top-0 left-0 w-full rounded-t-xl overflow-hidden pointer-events-none"
                      style={{
                        height: topGradientHeight,
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0))',
                        borderTopLeftRadius: btnRadius,
                        borderTopRightRadius: btnRadius,
                        zIndex: 2
                      }}
                      aria-hidden
                    />
                    <span style={{ fontWeight: 700, color: '#fff' }} className="relative">{b}</span>
                  </button>
                </div>
              ) : (
                <div key={j} />
              )
            )}

          </div>
        ))}

        <div className="grid grid-cols-4 gap-2 mt-2" style={{ gap }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <button
              onClick={() => handlePress("=")}
              style={{
                width: '100%',
                height: eqButtonHeight,
                borderRadius: btnRadius,
                background: 'linear-gradient(to bottom,#8B5CF6,#6931b0)',
                color: '#fff',
                fontWeight: 700,
                fontSize: eqFontSize,
                boxShadow: pressedButton === "=" ? '0 0 0 #5d21c2' : `0 ${Math.round(eqButtonHeight * 0.12)}px 0 #5d21c2`,
                transform: pressedButton === "=" ? `translateY(${Math.round(eqButtonHeight * 0.08)}px)` : undefined,
                transition: 'all 150ms'
              }}
            >=</button>
          </div>
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
