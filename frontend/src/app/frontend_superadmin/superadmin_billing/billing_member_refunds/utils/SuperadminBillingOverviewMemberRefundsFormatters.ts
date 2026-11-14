// RESPONSIBILITY: Format typed values for billing member refunds display using the supplied locale/currency contract; it does not mutate underlying values.
// FLOW: Feature UI -> superadmin_billing/billing_member_refunds/utils/SuperadminBillingOverviewMemberRefundsFormatters.ts -> typed values and locale -> formatted display output.
/** API money uses integer minor units; legacy major-unit preview values use an explicit compatibility adapter. */
import { format as formatDateFns, isValid, parseISO } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';

const CURRENCY_SUBUNITS: Readonly<Record<string, number>> = Object.freeze({
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


/** Format integer minor units using an explicit ISO currency and active locale. 
 * @param amountMinor - Input supplied by the caller under the declared TypeScript contract.
 * @param currencyCode - Input supplied by the caller under the declared TypeScript contract.
 * @param locale - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example superadminFinanceFormatCurrency(amountMinor, currencyCode, locale) uses the declared inputs to produce the module's canonical output.
 */
export function superadminFinanceFormatCurrency(amountMinor: number, currencyCode: string, locale: string): string {
  if (!Number.isFinite(amountMinor) || !Number.isSafeInteger(amountMinor) || !/^[A-Z]{3}$/.test(currencyCode)) return '—';
  const divisor = currencySubunits(currencyCode);
  if (!divisor) return '—';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(amountMinor / divisor);
  } catch {
    return '—';
  }
}

/** Explicit compatibility boundary for existing major-unit finance preview values; never pass API minor-unit payloads here. 
 * @param amount - Input supplied by the caller under the declared TypeScript contract.
 * @param currencyCode - Input supplied by the caller under the declared TypeScript contract.
 * @param locale - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example formatMajorUnitPreviewCurrency(amount, currencyCode, locale) uses the declared inputs to produce the module's canonical output.
 */
export function formatMajorUnitPreviewCurrency(amount: number, currencyCode: string, locale: string): string {
  const currencyDivisor = currencySubunits(currencyCode);
  if (!currencyDivisor) return '—';
  if (!Number.isFinite(amount)) return '—';
  return superadminFinanceFormatCurrency(Math.round(amount * (currencyDivisor)), currencyCode, locale);
}

/** Format a date string, returning an empty value for absent or invalid input. */

/** Resolves the active supported UI locale for date-fns date presentation. */
function resolveSuperadminDateFnsLocale(locale: string) {
  return locale.toLowerCase().startsWith('hi') ? hi : enUS;
}

/** Formats date-only values for billing overview using the active locale; invalid ISO dates return an empty string. 
 * @param dateString - Input supplied by the caller under the declared TypeScript contract.
 * @param locale - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example formatDate(dateString, locale) uses the declared inputs to produce the module's canonical output.
 */
export function formatDate(dateString: string | null | undefined, locale: string): string {
  if (!dateString) return '';
  const parsed = parseISO(dateString);
  const localeOptions = { locale: resolveSuperadminDateFnsLocale(locale) };
  if (isValid(parsed)) return formatDateFns(parsed, 'PP', localeOptions);
  if (/^\d{4}-\d{2}-\d{2}(?:$|T)/.test(dateString)) return '';
  const legacyDate = new Date(dateString);
  return isValid(legacyDate) ? formatDateFns(legacyDate, 'PP', localeOptions) : '';
}

/** Format a date/time string, returning an empty value for invalid input. 
 * @param dateString - Input supplied by the caller under the declared TypeScript contract.
 * @param locale - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example formatDateTime(dateString, locale) uses the declared inputs to produce the module's canonical output.
 */
export function formatDateTime(dateString: string | null | undefined, locale: string): string {
  if (!dateString) return '';
  const parsed = parseISO(dateString);
  const localeOptions = { locale: resolveSuperadminDateFnsLocale(locale) };
  if (isValid(parsed)) return formatDateFns(parsed, 'PPp', localeOptions);
  if (/^\d{4}-\d{2}-\d{2}(?:$|T)/.test(dateString)) return '';
  const legacyDate = new Date(dateString);
  return isValid(legacyDate) ? formatDateFns(legacyDate, 'PPp', localeOptions) : '';
}
