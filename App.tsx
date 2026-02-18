import React, { useState } from 'react';
import { Tab } from './types';
import MortgageCalculator from './components/MortgageCalculator';
import InvestmentCalculator from './components/InvestmentCalculator';
import RentVsBuy from './components/RentVsBuy';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('mortgage');

  const tabs = [
    { id: 'mortgage', label: 'Mortgage', icon: '🏠' },
    { id: 'investment', label: 'Investment', icon: '📈' },
    { id: 'rentvsbuy', label: 'Rent vs Buy', icon: '⚖️' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
              EP
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">EstatePro</h1>
              <p className="text-xs text-slate-500 font-medium tracking-tight">INTELLIGENT ANALYSIS</p>
            </div>
          </div>
          
          <nav className="hidden md:flex bg-slate-100 p-1.5 rounded-2xl space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-white text-emerald-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            {activeTab === 'mortgage' && 'Strategic Mortgage Planning'}
            {activeTab === 'investment' && 'Real Estate Deal Analysis'}
            {activeTab === 'rentvsbuy' && 'Build Wealth: Rent or Buy?'}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            {activeTab === 'mortgage' && 'Optimize your home purchase with detailed monthly breakdowns and interest projections.'}
            {activeTab === 'investment' && 'Professional pro-forma tool for calculating ROI, Cap Rates, and operational cash flows.'}
            {activeTab === 'rentvsbuy' && 'The ultimate wealth-building comparison based on market appreciation and opportunity costs.'}
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'mortgage' && <MortgageCalculator />}
          {activeTab === 'investment' && <InvestmentCalculator />}
          {activeTab === 'rentvsbuy' && <RentVsBuy />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} EstatePro Intelligence Group. All financial projections are estimates.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;