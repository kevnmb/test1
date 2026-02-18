import React, { useState, useMemo } from 'react';
import Input from './Input';
import { MortgageInputs } from '../types';
import { calcMortgage, formatUSD } from '../utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { analyzeDeal } from '../services/gemini';

const MortgageCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<MortgageInputs>({
    price: 450000,
    downPayment: 90000,
    rate: 6.5,
    term: 30,
    tax: 4500,
    insurance: 1200,
    hoa: 0
  });

  const [aiResult, setAiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const results = useMemo(() => {
    const loanAmount = inputs.price - inputs.downPayment;
    const pi = calcMortgage(loanAmount, inputs.rate, inputs.term);
    const monthlyTax = inputs.tax / 12;
    const monthlyIns = inputs.insurance / 12;
    const total = pi + monthlyTax + monthlyIns + inputs.hoa;

    return { pi, monthlyTax, monthlyIns, total, loanAmount };
  }, [inputs]);

  const data = [
    { name: 'P&I', value: results.pi, color: '#059669' },
    { name: 'Tax', value: results.monthlyTax, color: '#3b82f6' },
    { name: 'Insurance', value: results.monthlyIns, color: '#f59e0b' },
    { name: 'HOA', value: inputs.hoa, color: '#ef4444' },
  ];

  const handleAI = async () => {
    setLoading(true);
    const text = await analyzeDeal({ ...inputs, results }, 'Mortgage');
    setAiResult(text);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Inputs Column */}
      <div className="lg:col-span-4 space-y-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <span className="mr-2">🏦</span> Financing
          </h3>
          <div className="space-y-6">
            <Input label="Home Price" value={inputs.price} max={5000000} step={5000} isCurrency onChange={(v) => setInputs({...inputs, price: v})} />
            <Input label="Down Payment" value={inputs.downPayment} max={inputs.price} step={1000} isCurrency onChange={(v) => setInputs({...inputs, downPayment: v})} />
            <Input label="Interest Rate" value={inputs.rate} max={15} step={0.1} isPercent onChange={(v) => setInputs({...inputs, rate: v})} />
            <Input label="Loan Term" value={inputs.term} min={5} max={40} onChange={(v) => setInputs({...inputs, term: v})} />
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <span className="mr-2">📝</span> Other Costs
          </h3>
          <div className="space-y-6">
            <Input label="Annual Property Tax" value={inputs.tax} max={50000} step={100} isCurrency onChange={(v) => setInputs({...inputs, tax: v})} />
            <Input label="Annual Insurance" value={inputs.insurance} max={10000} step={100} isCurrency onChange={(v) => setInputs({...inputs, insurance: v})} />
            <Input label="Monthly HOA" value={inputs.hoa} max={3000} step={10} isCurrency onChange={(v) => setInputs({...inputs, hoa: v})} />
          </div>
        </section>
      </div>

      {/* Dashboard Column */}
      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="gradient-bg rounded-3xl p-8 text-white shadow-xl flex flex-col justify-center text-center">
            <h4 className="text-emerald-100 text-sm font-bold uppercase tracking-widest mb-2">Estimated Payment</h4>
            <div className="text-5xl font-extrabold mb-4">{formatUSD(results.total)}</div>
            <div className="h-px bg-white/20 w-full mb-4" />
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-xs text-emerald-200 font-medium uppercase">Principal & Int.</p>
                <p className="text-lg font-semibold">{formatUSD(results.pi)}</p>
              </div>
              <div>
                <p className="text-xs text-emerald-200 font-medium uppercase">Total Loan</p>
                <p className="text-lg font-semibold">{formatUSD(results.loanAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h4 className="text-slate-800 font-bold mb-4">Monthly Breakdown</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatUSD(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {data.map(d => (
                <div key={d.name} className="flex items-center space-x-2 text-xs font-medium text-slate-500">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-emerald-500/20">
                ✨
              </div>
              <div>
                <h3 className="text-xl font-bold">Gemini Deal Insights</h3>
                <p className="text-sm text-slate-400">Advanced risk & opportunity analysis</p>
              </div>
            </div>
            <button 
              onClick={handleAI}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${loading ? 'bg-slate-700 text-slate-400' : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400 active:scale-95'}`}
            >
              {loading ? 'Synthesizing...' : 'Analyze My Numbers'}
            </button>
          </div>

          <div className="min-h-[100px] text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none">
            {aiResult ? (
              <div className="animate-in fade-in slide-in-from-top-2 duration-700 whitespace-pre-wrap">{aiResult}</div>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 text-slate-500 italic">
                Click analyze to get personalized insights on your mortgage structure.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;