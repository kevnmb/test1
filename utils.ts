export const formatUSD = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatPercent = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(val / 100);
};

export const calcMortgage = (p: number, r: number, n: number) => {
  if (r === 0) return p / (n * 12);
  const monthlyRate = r / 100 / 12;
  const payments = n * 12;
  return (p * monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
};