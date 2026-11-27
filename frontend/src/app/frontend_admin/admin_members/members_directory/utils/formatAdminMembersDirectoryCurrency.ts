export function formatAdminMembersDirectoryCurrency(
  amountRupees: number,
  locale = 'en',
  decimals = 0,
): string {
  const safeAmount = Number.isFinite(amountRupees) ? amountRupees : 0;
  return new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safeAmount);
}

export function getAdminMembersDirectoryCurrencySymbol(locale = 'en'): string {
  const parts = new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    style: 'currency',
    currency: 'INR',
  }).formatToParts(0);
  return parts.find((p) => p.type === 'currency')?.value ?? 'INR';
}
