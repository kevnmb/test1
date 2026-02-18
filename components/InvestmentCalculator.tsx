import React, { useState, useMemo } from 'react';
import Input from './Input';
import { InvestmentInputs } from '../types';
import { calcMortgage, formatUSD, formatPercent } from '../utils';
import { analyzeDeal } from '../services/gemini';

const InvestmentCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<InvestmentInputs>({
    price: 350000,
    downPaymentPercent: 20,
    rate: 6.8,
    term: 30,
    rent: 2800,
    vacancy: 5,
    repairs: 5,
    management: 8,
    taxes: 3500,
    insurance: 1000
  });

  const [aiResult, setAiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const res = useMemo(() => {
    const downPayment = inputs.price * (inputs.downPaymentPercent / 100);
    const loan = inputs.price - downPayment;
    const mortgage = calcMortgage(loan, inputs.rate, inputs.term);
    
    const grossIncome = inputs.rent * 12;
    const vacancyLoss = grossIncome * (inputs.vacancy / 100);
    const egi = grossIncome - vacancyLoss;

    const opEx = (inputs.taxes) + (inputs.insurance) + (grossIncome * (inputs.repairs / 100)) + (grossIncome * (inputs.management / 100));
    const noi = egi - opEx;
    const cashFlow = noi - (mortgage * 12);
    const capRate = (noi / inputs.price) * 100;
    const coc = (cashFlow / downPayment) * 100;

    return { downPayment, mortgage, noi, cashFlow, capRate, coc };
  }, [inputs]);

  const handleAI = async () => {
    setLoading(true);
    const text = await analyzeDeal({ ...inputs, results: res }, 'Investment');
    setAiResult(text);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center"><span className="mr-2">💰</span> Acquisition</h3>
          <div className="space-y-6">
            <Input label="Purchase Price" value={inputs.price} max={5000000} step={5000} isCurrency onChange={(v) => setInputs({...inputs, price: v})} />
            <Input label="Down Payment %" value={inputs.downPaymentPercent} max={100} isPercent onChange={(v) => setInputs({...inputs, downPaymentPercent: v})} />
            <Input label="Mortgage Rate" value={inputs.rate} max={15} step={0.1} isPercent onChange={(v) => setInputs({...inputs, rate: v})} />
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center"><span className="mr-2">🏠</span> Operations</h3>
          <div className="space-y-6">
            <Input label="Monthly Rent" value={inputs.rent} max={15000} step={100} isCurrency onChange={(v) => setInputs({...inputs, rent: v})} />
            <Input label="Repairs & Maint %" value={inputs.repairs} max={25} isPercent onChange={(v) => setInputs({...inputs, repairs: v})} />
            <Input label="Mgmt Fee %" value={inputs.management} max={20} isPercent onChange={(v) => setInputs({...inputs, management: v})} />
          </div>
        </section>
      </div>

      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-center shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase mb-2">Monthly Cash Flow</p>
            <h4 className={`text-3xl font-black ${res.cashFlow > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatUSD(res.cashFlow / 12)}
            </h4>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-center shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase mb-2">Cap Rate</p>
            <h4 className="text-3xl font-black text-blue-600">{res.capRate.toFixed(2)}%</h4>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-center shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase mb-2">Cash on Cash</p>
            <h4 className="text-3xl font-black text-amber-600">{res.coc.toFixed(2)}%</h4>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Annual Financial Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-slate-600 font-medium text-sm">Net Operating Income (NOI)</span>
              <span className="text-slate-900 font-bold">{formatUSD(res.noi)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100 text-rose-600">
              <span className="font-medium text-sm">Annual Debt Service</span>
              <span className="font-bold">-{formatUSD(res.mortgage * 12)}</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-slate-900 font-extrabold">Total Cash Outlay</span>
              <span className="text-slate-900 font-extrabold text-xl">{formatUSD(res.downPayment)}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-blue-500/20">
                💎
              </div>
              <div>
                <h3 className="text-xl font-bold">Investment Grading</h3>
                <p className="text-sm text-slate-400">ROI verification and exit strategy analysis</p>
              </div>
            </div>
            <button 
              onClick={handleAI}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${loading ? 'bg-slate-700 text-slate-400' : 'bg-blue-500 text-slate-900 hover:bg-blue-400 active:scale-95'}`}
            >
              {loading ? 'Crunching ROI...' : 'Grade This Deal'}
            </button>
          </div>
          <div className="min-h-[100px] text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none">
            {aiResult ? (
              <div className="animate-in fade-in slide-in-from-top-2 duration-700 whitespace-pre-wrap">{aiResult}</div>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 text-slate-500 italic">
                Get an AI-powered grade on this investment's potential performance.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;