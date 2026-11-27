export function formatAdminStaffPayrollCurrency(amountRupees: number, decimals = 0): string {
  const safe = Number.isFinite(amountRupees) ? amountRupees : 0;
  const locale = typeof document !== 'undefined' && document.documentElement.lang === 'hi' ? 'hi-IN' : 'en-IN';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safe);
}
