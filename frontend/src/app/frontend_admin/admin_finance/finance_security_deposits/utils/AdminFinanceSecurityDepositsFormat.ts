import { format, parseISO } from 'date-fns';

export const ADMIN_FINANCE_DEFAULT_LOCALE = 'en-IN';

export function getAdminFinanceLocale(): string {
  if (typeof document !== 'undefined' && document.documentElement.lang) return document.documentElement.lang;
  if (typeof navigator !== 'undefined' && navigator.language) return navigator.language;
  return ADMIN_FINANCE_DEFAULT_LOCALE;
}


export function minorToMajor(amountMinor: number, currency: string, locale: string): number {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) throw new RangeError('Finance currency amounts must be safe nonnegative integers in minor units.');
  const safeMinor = amountMinor;
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return safeMinor / (10 ** fractionDigits);
}

export function majorToMinor(amountMajor: number, currency: string, locale: string): number {
  if (!Number.isFinite(amountMajor) || amountMajor < 0) throw new RangeError('Major units must be finite and nonnegative.');
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  const minor = Math.round(amountMajor * (10 ** fractionDigits));
  if (!Number.isSafeInteger(minor)) throw new RangeError('Converted minor units exceed the safe integer range.');
  return minor;
}

export function formatCurrency(amountMinor: number, currency: string, locale: string): string {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) throw new RangeError('Finance currency amounts must be safe nonnegative integers in minor units.');
  const safeMinor = amountMinor;
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(safeMinor / (10 ** fractionDigits));
}

export function formatAdminFinanceCurrency(amountMinor: number, currency = 'INR'): string {
  return formatCurrency(amountMinor, currency, getAdminFinanceLocale());
}

/** API-record formatter: absent currency/unit metadata is unknown, never silently treated as INR or paise. */
export function formatAdminFinanceApiAmount(amount: number, currencyCode: string | undefined, amountUnit: 'minor' | 'major' | undefined): string {
  if (!currencyCode || !/^[A-Z]{3}$/.test(currencyCode) || !Number.isFinite(amount) || amount < 0 || amountUnit === undefined) return '—';
  const locale = getAdminFinanceLocale();
  if (amountUnit === 'minor') {
    if (!Number.isSafeInteger(amount)) return '—';
    return formatCurrency(amount, currencyCode, locale);
  }
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(amount);
}

export function getAdminFinanceLocalDateString(date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

export function getAdminFinanceLocalMonthString(date = new Date()): string {
  return format(date, 'yyyy-MM');
}

function parseAdminFinanceDisplayDate(dateStr: string): Date {
  // Date-only contract values represent calendar dates, not UTC instants. parseISO keeps them local.
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? parseISO(dateStr) : new Date(dateStr);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = parseAdminFinanceDisplayDate(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(getAdminFinanceLocale(), { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '';
  const date = parseAdminFinanceDisplayDate(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(getAdminFinanceLocale(), { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}
