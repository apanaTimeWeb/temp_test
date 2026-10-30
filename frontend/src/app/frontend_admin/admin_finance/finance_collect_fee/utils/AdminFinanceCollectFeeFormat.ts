import { format, parseISO } from 'date-fns';
import type { Locale } from 'date-fns';
import { enGB } from 'date-fns/locale/en-GB';
import { enIN } from 'date-fns/locale/en-IN';
import { enUS } from 'date-fns/locale/en-US';
import { hi } from 'date-fns/locale/hi';

/** Keep locale detection local so this formatter remains independently portable. */
const ADMIN_COLLECT_FEE_DEFAULT_LOCALE = 'en-IN';

function getAdminCollectFeeLocale(): string {
  if (typeof document !== 'undefined' && document.documentElement.lang) return document.documentElement.lang;
  if (typeof navigator !== 'undefined' && navigator.language) return navigator.language;
  return ADMIN_COLLECT_FEE_DEFAULT_LOCALE;
}

function getAdminCollectFeeDateFnsLocale(): Locale {
  const language = getAdminCollectFeeLocale().toLowerCase();
  if (language === 'hi' || language.startsWith('hi-')) return hi;
  if (language === 'en-gb' || language.startsWith('en-gb-')) return enGB;
  if (language === 'en-us' || language.startsWith('en-us-')) return enUS;
  return enIN;
}

export function formatCurrency(amountMinor: number, currency: string, locale: string): string {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) return '—';
  const safeMinor = amountMinor;
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(safeMinor / (10 ** fractionDigits));
}

export function formatAdminCollectFeeCurrency(amountMinor: number, currency = 'INR'): string {
  return formatCurrency(amountMinor, currency, getAdminCollectFeeLocale());
}

export function getAdminCollectFeeLocalDateString(date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

export function getAdminCollectFeeLocalMonthString(date = new Date()): string {
  return format(date, 'yyyy-MM');
}

function parseAdminCollectFeeDisplayDate(dateStr: string): Date {
  // Date-only contract values represent calendar dates, not UTC instants. parseISO keeps them local.
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? parseISO(dateStr) : new Date(dateStr);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = parseAdminCollectFeeDisplayDate(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return format(date, 'PP', { locale: getAdminCollectFeeDateFnsLocale() });
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '';
  const date = parseAdminCollectFeeDisplayDate(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return format(date, 'PPp', { locale: getAdminCollectFeeDateFnsLocale() });
}

export function adminCollectFeeMaskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  return `${digits.slice(0, 2)}****${digits.slice(6)}`;
}

export function adminCollectFeeMajorToMinor(value: string | number, currency = 'INR', locale = getAdminCollectFeeLocale()): number {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > Number.MAX_SAFE_INTEGER / 100) return Number.NaN;
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  const minor = Math.round(parsed * (10 ** fractionDigits));
  return Number.isSafeInteger(minor) ? minor : Number.NaN;
}

/** Convert an integer currency subunit amount to its major unit for form inputs. */
export function adminCollectFeeMinorToMajor(value: number, currency = 'INR', locale = getAdminCollectFeeLocale()): number {
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return Number.isSafeInteger(value) && value >= 0 ? value / (10 ** fractionDigits) : Number.NaN;
}
