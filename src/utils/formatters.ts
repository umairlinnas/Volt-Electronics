import { LKR_EXCHANGE_RATE } from '../data/initialData';

export function formatCurrency(amountUSD: number, currency: 'LKR' | 'USD'): string {
  if (currency === 'LKR') {
    const lkrAmount = Math.round(amountUSD * LKR_EXCHANGE_RATE);
    return `Rs. ${lkrAmount.toLocaleString('en-LK')}`;
  }
  return `$${amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(val: number): string {
  return val.toLocaleString();
}

export function calculateKokoInstallment(amountUSD: number, currency: 'LKR' | 'USD'): { installmentAmount: string; totalAmount: string } {
  const perInstallmentUSD = amountUSD / 3;
  return {
    installmentAmount: formatCurrency(perInstallmentUSD, currency),
    totalAmount: formatCurrency(amountUSD, currency)
  };
}
