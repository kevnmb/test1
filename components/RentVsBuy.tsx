import React, { useState, useMemo } from 'react';
import Input from './Input';
import { formatUSD } from '../utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RentVsBuy: React.FC = () => {
  const [inputs, setInputs] = useState({
    rent: 2400,
    rentInc: 4,
    price: 450000,
    appreciation: 5,
    maintenance: 1,
    years: 15
  });

  const chartData = useMemo(() => {
    let rentWealth = 0;
    let buyWealth = 0;
    const data = [];

    // Simple wealth building model
    // Buying assumes 20% down, net equity gain vs total costs
    const downPayment = inputs.price * 0.2;
    const mortgage = (inputs.price - downPayment) * 0.006 * 12; // Approx 7% rate

    for (let i = 1; i <= inputs.years; i++) {
      const annualRent = (inputs.rent * 12) * Math.pow(1 + inputs.rentInc / 100, i - 1);
      rentWealth -= annualRent;

      const value = inputs.price * Math.pow(1 + inputs.appreciation / 100, i);
      const equity = value - (inputs.price * 0.8); // Simple equity (ignoring paydown for simplicity)
      const expenses = (mortgage + (inputs.price * (inputs.maintenance / 100))) * i;
      buyWealth = equity - expenses - downPayment;

      data.push({
        year: `Yr ${i}`,
        rent: Math.round(rentWealth),
        buy: Math.round(buyWealth)
      });
    }
    return data;
  }, [inputs]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 border-b pb-4">Rental Path</h3>
          <Input label="Monthly Rent" value={inputs.rent} max={10000} step={100} isCurrency onChange={(v) => setInputs({...inputs, rent: v})} />
          <Input label="Annual Rent Increase" value={inputs.rentInc} max={15} isPercent onChange={(v) => setInputs({...inputs, rentInc: v})} />
        </section>
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 border-b pb-4">Homeownership Path</h3>
          <Input label="Purchase Price" value={inputs.price} max={3000000} isCurrency onChange={(v) => setInputs({...inputs, price: v})} />
          <Input label="Market Appreciation" value={inputs.appreciation} max={15} isPercent onChange={(v) => setInputs({...inputs, appreciation: v})} />
        </section>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Wealth Accumulation Over Time</h3>
            <p className="text-slate-500 text-sm">Comparing net cash outlay vs. net equity growth</p>
          </div>
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100">
             15 Year Forecast Window
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip formatter={(v: number) => formatUSD(v)} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="rent" name="Net Wealth (Rent)" stroke="#ef4444" fillOpacity={1} fill="url(#colorRent)" strokeWidth={3} />
              <Area type="monotone" dataKey="buy" name="Net Wealth (Buy)" stroke="#10b981" fillOpacity={1} fill="url(#colorBuy)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RentVsBuy;