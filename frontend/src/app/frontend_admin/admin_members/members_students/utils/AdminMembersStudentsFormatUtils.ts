import { format, isValid, parse, parseISO } from 'date-fns';
import { enIN, hi } from 'date-fns/locale';
export type AdminStudentsExpiryDateState = 'expired' | 'current' | 'unknown';
export interface AdminStudentsExpiryDatePresentation { label: string; className: string; state: AdminStudentsExpiryDateState; }
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const LEGACY_DATE_PATTERN = /^\d{2} [A-Za-z]{3} \d{4}$/;
function parseKnownAdminStudentsDate(value: string, referenceDate: Date): Date | null {
  const input = value.trim();
  if (ISO_DATE_PATTERN.test(input)) { const parsed = parseISO(input); return isValid(parsed) && format(parsed, 'yyyy-MM-dd') === input ? parsed : null; }
  if (LEGACY_DATE_PATTERN.test(input)) { const parsed = parse(input, 'dd MMM yyyy', referenceDate); return isValid(parsed) && format(parsed, 'dd MMM yyyy').toLowerCase() === input.toLowerCase() ? parsed : null; }
  return null;
}
function formatKnownDate(parsed: Date, locale: string): string { return format(parsed, 'dd MMM yyyy', { locale: locale.toLowerCase().startsWith('hi') ? hi : enIN }); }
export function getAdminStudentsExpiryDatePresentation(value: unknown, now = new Date(), locale = 'en'): AdminStudentsExpiryDatePresentation {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw || raw === '—') return { label: '—', className: 'text-text-secondary', state: 'unknown' };
  const parsed = parseKnownAdminStudentsDate(raw, now);
  if (!parsed) return { label: raw, className: 'text-text-secondary', state: 'unknown' };
  const label = formatKnownDate(parsed, locale);
  // Expiry is inclusive through the displayed calendar date; compare date-only values, not midnight timestamps.
  const isExpired = format(parsed, 'yyyy-MM-dd') < format(now, 'yyyy-MM-dd');
  return isExpired ? { label, className: 'text-danger-text font-semibold', state: 'expired' } : { label, className: 'text-primary', state: 'current' };
}
export function formatAdminStudentsDate(value: unknown, locale = 'en', referenceDate = new Date()): string {
  if (typeof value !== 'string' || !value.trim() || value.trim() === '—') return '—';
  const parsed = parseKnownAdminStudentsDate(value, referenceDate);
  return parsed ? formatKnownDate(parsed, locale) : '—';
}

/** Format safe integer minor units only when currency identity is supplied by the source. */
export function formatAdminStudentsMoney(amountMinor: number, currencyCode: string, locale = 'en'): string {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0 || !/^[A-Z]{3}$/.test(currencyCode)) return '—';
  try {
    const formatter = new Intl.NumberFormat(locale.toLowerCase().startsWith('hi') ? 'hi-IN' : 'en-IN', { style: 'currency', currency: currencyCode });
    const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
    return formatter.format(amountMinor / (10 ** digits));
  } catch { return '—'; }
}
