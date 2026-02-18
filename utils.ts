
import { MortgageInputs, CalculationResult, AmortizationEntry } from './types';

export const calculateMortgage = (inputs: MortgageInputs): CalculationResult => {
  const principal = inputs.homePrice - inputs.downPayment;
  const monthlyInterestRate = inputs.interestRate / 100 / 12;
  const numberOfPayments = inputs.loanTerm * 12;

  const monthlyPrincipalInterest =
    (principal *
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  const monthlyOther = (inputs.propertyTax / 12) + (inputs.insurance / 12) + inputs.hoa;
  const totalMonthlyPayment = monthlyPrincipalInterest + monthlyOther;

  let balance = principal;
  const amortization: AmortizationEntry[] = [];

  for (let i = 1; i <= numberOfPayments; i++) {
    const interestPart = balance * monthlyInterestRate;
    const principalPart = monthlyPrincipalInterest - interestPart;
    balance -= principalPart;

    if (i % 12 === 0 || i === 1) {
      amortization.push({
        month: i,
        principal: principalPart,
        interest: interestPart,
        remainingBalance: Math.max(0, balance),
      });
    }
  }

  return {
    monthlyPayment: totalMonthlyPayment,
    totalInterest: (monthlyPrincipalInterest * numberOfPayments) - principal,
    totalCost: (monthlyPrincipalInterest * numberOfPayments) + (monthlyOther * numberOfPayments),
    amortization,
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};
