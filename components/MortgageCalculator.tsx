
import React, { useState, useMemo } from 'react';
import InputGroup from './InputGroup';
import { MortgageInputs } from '../types';
import { calculateMortgage, formatCurrency } from '../utils';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { getDealAnalysis } from '../services/geminiService';

const MortgageCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<MortgageInputs>({
    homePrice: 450000,
    downPayment: 90000,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTax: 4500,
    insurance: 1200,
    hoa: 0,
  });

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const results = useMemo(() => calculateMortgage(inputs), [inputs]);

  const pieData = [
    { name: 'P&I', value: results.monthlyPayment - (inputs.propertyTax/12 + inputs.insurance/12 + inputs.hoa) },
    { name: 'Tax', value: inputs.propertyTax / 12 },
    { name: 'Insurance', value: inputs.insurance / 12 },
    { name: 'HOA', value: inputs.hoa },
  ];

  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444'];

  const handleAiAnalysis = async () => {
    setLoadingAi(true);
    const analysis = await getDealAnalysis({ ...inputs, results }, 'mortgage');
    setAiAnalysis(analysis);
    setLoadingAi(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Inputs Section */}
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <h2 className="text-xl font-semibold text-slate-800 border-b pb-3">Loan Details</h2>
        <InputGroup 
          label="Home Price" 
          value={inputs.homePrice} 
          onChange={(v) => setInputs(prev => ({ ...prev, homePrice: v }))} 
          prefix="$" 
          max={5000000}
          step={5000}
        />
        <InputGroup 
          label="Down Payment" 
          value={inputs.downPayment} 
          onChange={(v) => setInputs(prev => ({ ...prev, downPayment: v }))} 
          prefix="$" 
          max={inputs.homePrice}
          step={1000}
        />
        <InputGroup 
          label="Interest Rate" 
          value={inputs.interestRate} 
          onChange={(v) => setInputs(prev => ({ ...prev, interestRate: v }))} 
          suffix="%" 
          max={15}
          step={0.1}
        />
        <InputGroup 
          label="Loan Term" 
          value={inputs.loanTerm} 
          onChange={(v) => setInputs(prev => ({ ...prev, loanTerm: v }))} 
          suffix="Years" 
          max={40}
        />
        <div className="pt-4 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Additional Monthly Costs</h3>
          <InputGroup 
            label="Property Tax (Annual)" 
            value={inputs.propertyTax} 
            onChange={(v) => setInputs(prev => ({ ...prev, propertyTax: v }))} 
            prefix="$" 
            max={50000}
          />
          <InputGroup 
            label="Home Insurance (Annual)" 
            value={inputs.insurance} 
            onChange={(v) => setInputs(prev => ({ ...prev, insurance: v }))} 
            prefix="$" 
            max={10000}
          />
          <InputGroup 
            label="HOA Fees (Monthly)" 
            value={inputs.hoa} 
            onChange={(v) => setInputs(prev => ({ ...prev, hoa: v }))} 
            prefix="$" 
            max={2000}
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Card */}
          <div className="bg-emerald-600 p-8 rounded-xl text-white shadow-md flex flex-col justify-center items-center">
            <p className="text-emerald-100 text-sm font-medium uppercase tracking-widest mb-2">Estimated Monthly Payment</p>
            <h3 className="text-5xl font-bold">{formatCurrency(results.monthlyPayment)}</h3>
            <div className="mt-6 pt-6 border-t border-emerald-500 w-full flex justify-between text-sm">
              <div>
                <p className="text-emerald-200">Total Interest</p>
                <p className="font-semibold">{formatCurrency(results.totalInterest)}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-200">Total Cost of Loan</p>
                <p className="font-semibold">{formatCurrency(results.totalCost)}</p>
              </div>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Breakdown</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Amortization Schedule Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Balance Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.amortization}>
                <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
                <YAxis tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="remainingBalance" name="Remaining Balance" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Gemini Deal Insights</h3>
            </div>
            <button 
              onClick={handleAiAnalysis}
              disabled={loadingAi}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                loadingAi 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400'
              }`}
            >
              {loadingAi ? 'Analyzing...' : 'Get AI Analysis'}
            </button>
          </div>
          
          {aiAnalysis ? (
            <div className="prose prose-invert max-w-none text-slate-300 text-sm whitespace-pre-line leading-relaxed">
              {aiAnalysis}
            </div>
          ) : (
            <p className="text-slate-400 text-sm italic">
              Click the button above to have Gemini analyze your mortgage parameters for risk and market suitability.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
