function resolveFinanceLocale(): string {
  if (typeof document !== 'undefined' && document.documentElement.lang.toLowerCase().startsWith('hi')) {
    return 'hi-IN';
  }
  return 'en-IN';
}

export function formatAdminFinanceReferralsInr(amountRupees: number, decimals = 0): string {
  const safeAmount = Number.isFinite(amountRupees) ? amountRupees : 0;
  return new Intl.NumberFormat(resolveFinanceLocale(), {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safeAmount);
}

export function getAdminFinanceReferralsCurrencySymbol(): string {
  const parts = new Intl.NumberFormat(resolveFinanceLocale(), {
    style: 'currency',
    currency: 'INR',
  }).formatToParts(0);
  return parts.find((p) => p.type === 'currency')?.value ?? 'INR';
}
