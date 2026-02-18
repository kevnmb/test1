import React from 'react';

interface Props {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max: number;
  step?: number;
  isCurrency?: boolean;
  isPercent?: boolean;
}

const Input: React.FC<Props> = ({ label, value, onChange, min = 0, max, step = 1, isCurrency, isPercent }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-600">{label}</label>
        <div className="relative">
          {isCurrency && <span className="absolute left-2 top-1.5 text-slate-400 text-sm">$</span>}
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`w-28 bg-white border border-slate-200 rounded-md px-2 py-1 text-right text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none ${isCurrency ? 'pl-5' : ''} ${isPercent ? 'pr-5' : ''}`}
          />
          {isPercent && <span className="absolute right-2 top-1.5 text-slate-400 text-sm">%</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
      />
    </div>
  );
};

export default Input;