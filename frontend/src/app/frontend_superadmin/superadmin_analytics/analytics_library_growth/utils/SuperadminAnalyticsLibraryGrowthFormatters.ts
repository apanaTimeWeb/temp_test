// RESPONSIBILITY: Format typed values for analytics library growth display using the supplied locale/currency contract; it does not mutate underlying values.
// FLOW: Feature UI -> superadmin_analytics/analytics_library_growth/utils/SuperadminAnalyticsLibraryGrowthFormatters.ts -> typed values and locale -> formatted display output.
/** Module-owned currency formatting for report values; contracts use integer minor units. */
function currencyScale(currencyCode: string, locale: string): number | null {
  if (!/^[A-Z]{3}$/.test(currencyCode)) return null;
  const supportedValuesOf = (Intl as unknown as { supportedValuesOf?: (key: 'currency') => string[] }).supportedValuesOf;
  const supportedCurrencies = supportedValuesOf?.('currency');
  if (supportedCurrencies && !supportedCurrencies.includes(currencyCode) && currencyCode !== 'CLF') return null;
  try { const digits = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).resolvedOptions().maximumFractionDigits; return typeof digits === 'number' ? 10 ** digits : null; } catch { return null; }
}
/** Format integer minor units using the currency precision supplied by the runtime ISO-4217 data. 
 * @param amountMinor - Input supplied by the caller under the declared TypeScript contract.
 * @param currencyCode - Input supplied by the caller under the declared TypeScript contract.
 * @param locale - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example FormatCurrency(amountMinor, currencyCode, locale) uses the declared inputs to produce the module's canonical output.
 */
export function FormatCurrency(amountMinor: number, currencyCode: string, locale: string): string {
  if (!Number.isFinite(amountMinor) || !Number.isSafeInteger(amountMinor)) return '—';
  const scale = currencyScale(currencyCode, locale);
  if (scale === null) return '—';
  try { return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(amountMinor / scale); } catch { return '—'; }
}
/** Explicit compatibility boundary for current major-unit report preview fixtures; never pass API minor-unit payloads here. 
 * @param value - Input supplied by the caller under the declared TypeScript contract.
 * @param locale - Input supplied by the caller under the declared TypeScript contract.
 * @param currencyCode - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example formatSuperadminReportsMajorPreviewCurrency(value, locale, currencyCode) uses the declared inputs to produce the module's canonical output.
 */
export function formatSuperadminReportsMajorPreviewCurrency(value: number, locale: string, currencyCode: string): string {
  const scale = currencyScale(currencyCode, locale);
  if (!Number.isFinite(value) || scale === null) return '—';
  const minor = Math.round(value * scale);
  return Number.isSafeInteger(minor) ? FormatCurrency(minor, currencyCode, locale) : '—';
}
