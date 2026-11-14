// RESPONSIBILITY: Format typed values for dashboard overview display using the supplied locale/currency contract; it does not mutate underlying values.
// FLOW: Feature UI -> superadmin_dashboard/dashboard_overview/utils/SuperadminDashboardOverviewFormatters.ts -> typed values and locale -> formatted display output.
/** Dashboard-local money formatting. API and normalized monetary fixtures use integer minor units. */
const CURRENCY_SUBUNITS: Readonly<Record<string, number>> = Object.freeze({
  CLF: 10000,
  BHD: 1000, IQD: 1000, JOD: 1000, KWD: 1000, LYD: 1000, OMR: 1000, TND: 1000,
  BIF: 1, CLP: 1, DJF: 1, GNF: 1, ISK: 1, JPY: 1, KMF: 1, KRW: 1, PYG: 1, RWF: 1, UGX: 1, UYI: 1, VND: 1, VUV: 1, XAF: 1, XOF: 1, XPF: 1,
});

/** Resolves the minor-unit divisor for a currency; unknown codes are never silently assumed to use two decimals. */
function currencySubunits(currencyCode: string): number | undefined {
  const known = CURRENCY_SUBUNITS[currencyCode];
  if (known) return known;
  const supportedValuesOf = (Intl as typeof Intl & { supportedValuesOf?: (key: 'currency') => string[] }).supportedValuesOf;
  if (!supportedValuesOf || !supportedValuesOf('currency').includes(currencyCode)) return undefined;
  try {
    const digits = new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode }).resolvedOptions().maximumFractionDigits;
    return typeof digits === 'number' && Number.isInteger(digits) && digits >= 0 && digits <= 4 ? 10 ** digits : undefined;
  } catch { return undefined; }
}


/** Format integer minor units as a standard currency value with explicit currency and locale. 
 * @param amountMinor - Input supplied by the caller under the declared TypeScript contract.
 * @param currencyCode - Input supplied by the caller under the declared TypeScript contract.
 * @param locale - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example FormatCurrency(amountMinor, currencyCode, locale) uses the declared inputs to produce the module's canonical output.
 */
export function FormatCurrency(amountMinor: number, currencyCode: string, locale: string): string {
  const currencyDivisor = currencySubunits(currencyCode);
  if (!currencyDivisor) return '—';
  if (!Number.isSafeInteger(amountMinor) || !/^[A-Z]{3}$/.test(currencyCode)) return '—';
  try { return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(amountMinor / (currencyDivisor)); } catch { return '—'; }
}

/** Format integer minor units compactly for dashboard KPIs while preserving locale-specific number notation. 
 * @param amountMinor - Input supplied by the caller under the declared TypeScript contract.
 * @param currencyCode - Input supplied by the caller under the declared TypeScript contract.
 * @param locale - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example FormatCompactCurrency(amountMinor, currencyCode, locale) uses the declared inputs to produce the module's canonical output.
 */
export function FormatCompactCurrency(amountMinor: number, currencyCode: string, locale: string): string {
  const currencyDivisor = currencySubunits(currencyCode);
  if (!currencyDivisor) return '—';
  if (!Number.isSafeInteger(amountMinor) || !/^[A-Z]{3}$/.test(currencyCode)) return '—';
  try { return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode, notation: 'compact', maximumFractionDigits: 1 }).format(amountMinor / (currencyDivisor)); } catch { return '—'; }
}
