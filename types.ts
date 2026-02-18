
export enum CalculatorTab {
  MORTGAGE = 'MORTGAGE',
  INVESTMENT = 'INVESTMENT',
  RENT_VS_BUY = 'RENT_VS_BUY'
}

export interface MortgageInputs {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  insurance: number;
  hoa: number;
}

export interface InvestmentInputs {
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  monthlyRent: number;
  otherIncome: number;
  vacancyRate: number;
  propertyTax: number;
  insurance: number;
  repairs: number;
  management: number;
}

export interface CalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  amortization: AmortizationEntry[];
}

export interface AmortizationEntry {
  month: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}
