
import React, { useState, useMemo } from 'react';
import InputGroup from './InputGroup';
import { formatCurrency } from '../utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RentVsBuy: React.FC = () => {
  const [rent, setRent] = useState(2200);
  const [rentIncrease, setRentIncrease] = useState(3);
  const [homePrice, setHomePrice] = useState(450000);
  const [appreciation, setAppreciation] = useState(4);
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    let rentTotal = 0;
    let buyTotal = 0;
    const chartData = [];
    
    // Simple buying logic (maintenance, taxes, equity gain)
    const monthlyMaint = (homePrice * 0.01) / 12;
    const monthlyTaxIns = (homePrice * 0.015) / 12;
    const mortgage = (homePrice * 0.8 * 0.0055); // estimated

    for (let i = 1; i <= years; i++) {
      const annualRent = rent * 12 * Math.pow(1 + rentIncrease / 100, i - 1);
      rentTotal += annualRent;
      
      const annualBuyCosts = (mortgage + monthlyMaint + monthlyTaxIns) * 12;
      buyTotal += annualBuyCosts;

      const equity = homePrice * Math.pow(1 + appreciation / 100, i) - homePrice;
      
      chartData.push({
        year: i,
        rentCost: Math.round(rentTotal),
        buyCost: Math.round(buyTotal - equity), // Net cost considering equity gain
      });
    }
    return chartData;
  }, [rent, rentIncrease, homePrice, appreciation, years]);

  const winner = data[data.length - 1].buyCost < data[data.length - 1].rentCost ? 'Buying' : 'Renting';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Renting Scenario</h3>
          <InputGroup label="Monthly Rent" value={rent} onChange={setRent} prefix="$" />
          <InputGroup label="Annual Rent Increase" value={rentIncrease} onChange={setRentIncrease} suffix="%" step={0.1} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Buying Scenario</h3>
          <InputGroup label="Home Price" value={homePrice} onChange={setHomePrice} prefix="$" step={5000} />
          <InputGroup label="Annual Appreciation" value={appreciation} onChange={setAppreciation} suffix="%" step={0.1} />
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">10-Year Comparison</h3>
            <p className="text-slate-500">Net cost comparison (Expenses minus Equity gained)</p>
          </div>
          <div className="mt-4 md:mt-0 p-4 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center space-x-3">
            <span className="text-sm text-slate-600 font-medium">Potential Winner:</span>
            <span className="text-xl font-bold text-emerald-700">{winner}</span>
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend verticalAlign="top" height={36}/>
              <Line type="monotone" dataKey="rentCost" name="Total Rent Cost" stroke="#ef4444" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="buyCost" name="Net Buy Cost" stroke="#059669" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 leading-relaxed italic">
          *Note: This calculation provides a high-level comparison. Net Buy Cost subtracts estimated property appreciation (equity) from the total expenses (mortgage, tax, insurance, maintenance). Real-world results depend on local market conditions and individual loan terms.
        </div>
      </div>
    </div>
  );
};

export default RentVsBuy;
