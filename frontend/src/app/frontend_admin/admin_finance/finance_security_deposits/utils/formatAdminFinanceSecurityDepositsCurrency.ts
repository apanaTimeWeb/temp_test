function resolveFinanceLocale(): string {
  if (typeof document !== 'undefined' && document.documentElement.lang.toLowerCase().startsWith('hi')) {
    return 'hi-IN';
  }
  return 'en-IN';
}

export function formatAdminFinanceSecurityDepositsCurrency(amountRupees: number, decimals = 0): string {
  const safeAmount = Number.isFinite(amountRupees) ? amountRupees : 0;
  return new Intl.NumberFormat(resolveFinanceLocale(), {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safeAmount);
}
