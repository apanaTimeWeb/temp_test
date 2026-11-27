export function formatAdminShiftsGapCurrency(amountRupees: number, locale = 'en'): string {
  const safeAmount = Number.isFinite(amountRupees) ? amountRupees : 0;
  return new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(safeAmount);
}
