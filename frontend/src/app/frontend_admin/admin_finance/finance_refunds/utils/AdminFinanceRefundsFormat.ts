import type { Locale } from 'date-fns';
import { format,parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale/en-GB';
import { enIN } from 'date-fns/locale/en-IN';
import { enUS } from 'date-fns/locale/en-US';
import { hi } from 'date-fns/locale/hi';

/** Keep locale detection local so this formatter remains independently portable. */
const ADMIN_FINANCE_DEFAULT_LOCALE = 'en-IN';

function getAdminFinanceLocale(): string {
  if (typeof document === 'undefined') return ADMIN_FINANCE_DEFAULT_LOCALE;
  if (document.documentElement.lang) return document.documentElement.lang;
  if (typeof navigator !== 'undefined' && navigator.language) return navigator.language;
  return ADMIN_FINANCE_DEFAULT_LOCALE;
}

function getAdminFinanceDateFnsLocale(): Locale {
  const language = getAdminFinanceLocale().toLowerCase();
  if (language === 'hi' || language.startsWith('hi-')) return hi;
  if (language === 'en-gb' || language.startsWith('en-gb-')) return enGB;
  if (language === 'en-us' || language.startsWith('en-us-')) return enUS;
  return enIN;
}

export function formatCurrency(amountMinor: number, currency: string, locale: string): string {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) throw new RangeError('Finance currency amounts must be safe nonnegative integers in minor units.');
  const safeMinor = amountMinor;
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(safeMinor / (10 ** fractionDigits));
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

function parseAdminFinanceDisplayDate(dateStr: string): Date {
  // Date-only contract values represent calendar dates, not UTC instants. parseISO keeps them local.
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? parseISO(dateStr) : new Date(dateStr);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = parseAdminFinanceDisplayDate(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return format(date, 'PP', { locale: getAdminFinanceDateFnsLocale() });
}
