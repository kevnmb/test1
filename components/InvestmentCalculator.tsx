
import React, { useState, useMemo } from 'react';
import InputGroup from './InputGroup';
import { InvestmentInputs } from '../types';
import { formatCurrency } from '../utils';
import { getDealAnalysis } from '../services/geminiService';

const InvestmentCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<InvestmentInputs>({
    purchasePrice: 350000,
    downPaymentPercent: 20,
    interestRate: 6.8,
    loanTerm: 30,
    monthlyRent: 2800,
    otherIncome: 0,
    vacancyRate: 5,
    propertyTax: 3500,
    insurance: 1000,
    repairs: 5,
    management: 8,
  });

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const results = useMemo(() => {
    const downPayment = inputs.purchasePrice * (inputs.downPaymentPercent / 100);
    const loanAmount = inputs.purchasePrice - downPayment;
    const monthlyRate = inputs.interestRate / 100 / 12;
    const payments = inputs.loanTerm * 12;

    const mortgagePayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
    
    const grossIncome = inputs.monthlyRent + inputs.otherIncome;
    const vacancyLoss = grossIncome * (inputs.vacancyRate / 100);
    const effectiveGrossIncome = grossIncome - vacancyLoss;

    const operatingExpenses = 
      (inputs.propertyTax / 12) + 
      (inputs.insurance / 12) + 
      (grossIncome * (inputs.repairs / 100)) + 
      (grossIncome * (inputs.management / 100));

    const noi = (effectiveGrossIncome - operatingExpenses) * 12;
    const cashFlow = effectiveGrossIncome - operatingExpenses - mortgagePayment;
    const capRate = (noi / inputs.purchasePrice) * 100;
    const cocReturn = ((cashFlow * 12) / downPayment) * 100;

    return {
      monthlyCashFlow: cashFlow,
      annualCashFlow: cashFlow * 12,
      noi,
      capRate,
      cocReturn,
      mortgagePayment,
      totalExpenses: operatingExpenses + mortgagePayment,
      downPayment,
    };
  }, [inputs]);

  const handleAiAnalysis = async () => {
    setLoadingAi(true);
    const analysis = await getDealAnalysis({ ...inputs, results }, 'investment');
    setAiAnalysis(analysis);
    setLoadingAi(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <h2 className="text-xl font-semibold text-slate-800 border-b pb-3">Property Stats</h2>
        <InputGroup label="Purchase Price" value={inputs.purchasePrice} onChange={(v) => setInputs(p => ({ ...p, purchasePrice: v }))} prefix="$" step={5000} />
        <InputGroup label="Down Payment %" value={inputs.downPaymentPercent} onChange={(v) => setInputs(p => ({ ...p, downPaymentPercent: v }))} suffix="%" max={100} />
        <InputGroup label="Interest Rate" value={inputs.interestRate} onChange={(v) => setInputs(p => ({ ...p, interestRate: v }))} suffix="%" step={0.1} />
        
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 pt-4">Income</h3>
        <InputGroup label="Monthly Rent" value={inputs.monthlyRent} onChange={(v) => setInputs(p => ({ ...p, monthlyRent: v }))} prefix="$" />
        <InputGroup label="Vacancy Rate" value={inputs.vacancyRate} onChange={(v) => setInputs(p => ({ ...p, vacancyRate: v }))} suffix="%" />

        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 pt-4">Expenses</h3>
        <InputGroup label="Maint. & Repairs (%)" value={inputs.repairs} onChange={(v) => setInputs(p => ({ ...p, repairs: v }))} suffix="%" />
        <InputGroup label="Property Management (%)" value={inputs.management} onChange={(v) => setInputs(p => ({ ...p, management: v }))} suffix="%" />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-6 rounded-xl border flex flex-col items-center justify-center ${results.monthlyCashFlow > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">Monthly Cash Flow</p>
            <h4 className={`text-2xl font-bold ${results.monthlyCashFlow > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {formatCurrency(results.monthlyCashFlow)}
            </h4>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl flex flex-col items-center justify-center">
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">Cap Rate</p>
            <h4 className="text-2xl font-bold text-blue-700">{results.capRate.toFixed(2)}%</h4>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl flex flex-col items-center justify-center">
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">Cash on Cash Return</p>
            <h4 className="text-2xl font-bold text-amber-700">{results.cocReturn.toFixed(2)}%</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Net Operating Income (Annual)</span>
              <span className="font-semibold">{formatCurrency(results.noi)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Monthly Mortgage P&I</span>
              <span className="font-semibold text-red-600">-{formatCurrency(results.mortgagePayment)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Total Monthly Expenses</span>
              <span className="font-semibold">{formatCurrency(results.totalExpenses)}</span>
            </div>
            <div className="flex justify-between py-2 pt-4">
              <span className="text-slate-800 font-bold">Total Cash Required</span>
              <span className="font-bold text-slate-900">{formatCurrency(results.downPayment)}</span>
            </div>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.464 15.05a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM19.122 19.122A1 1 0 1017.707 17.707l-.707.707a1 1 0 001.414 1.414l.707-.707z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Gemini Investment Analysis</h3>
            </div>
            <button 
              onClick={handleAiAnalysis}
              disabled={loadingAi}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                loadingAi 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-500 text-slate-900 hover:bg-blue-400'
              }`}
            >
              {loadingAi ? 'Calculating ROI...' : 'Analyze Deal Quality'}
            </button>
          </div>
          
          {aiAnalysis ? (
            <div className="prose prose-invert max-w-none text-slate-300 text-sm whitespace-pre-line leading-relaxed">
              {aiAnalysis}
            </div>
          ) : (
            <p className="text-slate-400 text-sm italic">
              Use Gemini to stress test this investment deal. It will consider vacancy rates, ROI, and risk factors.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;
