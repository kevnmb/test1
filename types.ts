export type Tab = 'mortgage' | 'investment' | 'rentvsbuy';

export interface MortgageInputs {
  price: number;
  downPayment: number;
  rate: number;
  term: number;
  tax: number;
  insurance: number;
  hoa: number;
}

export interface InvestmentInputs {
  price: number;
  downPaymentPercent: number;
  rate: number;
  term: number;
  rent: number;
  vacancy: number;
  repairs: number;
  management: number;
  taxes: number;
  insurance: number;
}

export interface RentVsBuyInputs {
  rent: number;
  rentIncrease: number;
  homePrice: number;
  appreciation: number;
  maintenance: number;
}