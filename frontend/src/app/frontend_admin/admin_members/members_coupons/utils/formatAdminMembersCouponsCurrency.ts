export function getAdminMembersCouponsCurrencySymbol(locale = 'en'): string {
  const parts = new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    style: 'currency',
    currency: 'INR',
  }).formatToParts(0);
  return parts.find((p) => p.type === 'currency')?.value ?? 'INR';
}
