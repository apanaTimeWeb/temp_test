/** Convert integer minor units to the major currency unit using ISO currency precision. */
export function adminAccountingMinorToMajor(minorUnits: number, currency = 'INR', locale = 'en-IN'): number {
  const safeMinorUnits = Number.isFinite(minorUnits) ? Math.trunc(minorUnits) : 0;
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return safeMinorUnits / (10 ** fractionDigits);
}

/** Format a minor-unit amount using the active UI locale; defaults to the app's INR contract. */
export function formatAdminAccountingCurrency(minorUnits: number, locale = 'en-IN', currency = 'INR'): string {
  const resolvedLocale = locale === 'en' ? 'en-IN' : locale === 'hi' ? 'hi-IN' : locale;
  const fractionDigits = new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat(resolvedLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(adminAccountingMinorToMajor(minorUnits, currency, resolvedLocale));
}

/** Convert a user-entered major-unit value to the currency's smallest unit. */
export function toAdminAccountingMinorUnits(majorUnits: number, currency = 'INR', locale = 'en-IN'): number {
  if (!Number.isFinite(majorUnits)) return 0;
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return Math.round(majorUnits * (10 ** fractionDigits));
}
