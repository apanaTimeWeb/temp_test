export function formatAdminLockersMatrixCurrency(amountRupees: number, locale = 'en'): string {
  const safeAmount = Number.isFinite(amountRupees) ? amountRupees : 0;
  return new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

export function getAdminLockersMatrixCurrencySymbol(locale = 'en'): string {
  const parts = new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    style: 'currency',
    currency: 'INR',
  }).formatToParts(0);
  return parts.find((p) => p.type === 'currency')?.value ?? 'INR';
}
