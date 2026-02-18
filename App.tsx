
import React, { useState } from 'react';
import Layout from './components/Layout';
import MortgageCalculator from './components/MortgageCalculator';
import InvestmentCalculator from './components/InvestmentCalculator';
import RentVsBuy from './components/RentVsBuy';
import { CalculatorTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(CalculatorTab.MORTGAGE);

  const renderContent = () => {
    switch (activeTab) {
      case CalculatorTab.MORTGAGE:
        return <MortgageCalculator />;
      case CalculatorTab.INVESTMENT:
        return <InvestmentCalculator />;
      case CalculatorTab.RENT_VS_BUY:
        return <RentVsBuy />;
      default:
        return <MortgageCalculator />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in duration-500">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-2">
            {activeTab === CalculatorTab.MORTGAGE && 'Mortgage Planner'}
            {activeTab === CalculatorTab.INVESTMENT && 'Rental ROI Analyzer'}
            {activeTab === CalculatorTab.RENT_VS_BUY && 'Rent vs. Buy Comparison'}
          </h1>
          <p className="text-lg text-slate-600">
            {activeTab === CalculatorTab.MORTGAGE && 'Calculate your monthly payments and see how interest impacts your loan.'}
            {activeTab === CalculatorTab.INVESTMENT && 'Evaluate potential income properties and calculate your cash flow.'}
            {activeTab === CalculatorTab.RENT_VS_BUY && 'Decide if homeownership or renting makes more financial sense for you.'}
          </p>
        </header>
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
