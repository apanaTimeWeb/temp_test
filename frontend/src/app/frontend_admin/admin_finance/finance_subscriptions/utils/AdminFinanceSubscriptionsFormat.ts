import { format, parseISO } from 'date-fns';

export const ADMIN_SUBSCRIPTIONS_DEFAULT_LOCALE = 'en-IN';

export function getAdminSubscriptionsLocale(): string {
  if (typeof document !== 'undefined' && document.documentElement.lang) return document.documentElement.lang;
  if (typeof navigator !== 'undefined' && navigator.language) return navigator.language;
  return ADMIN_SUBSCRIPTIONS_DEFAULT_LOCALE;
}


export function formatCurrency(amountMinor: number, currency: string, locale: string): string {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) return '—';
  if (!/^[A-Z]{3}$/.test(currency)) return '—';
  const safeMinor = amountMinor;
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(safeMinor / (10 ** fractionDigits));
}

export function formatAdminSubscriptionsCurrency(amountMinor: number, currency = 'INR'): string {
  return formatCurrency(amountMinor, currency, getAdminSubscriptionsLocale());
}

export function getAdminSubscriptionsLocalDateString(date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

export function getAdminSubscriptionsLocalMonthString(date = new Date()): string {
  return format(date, 'yyyy-MM');
}

function parseAdminSubscriptionsDisplayDate(dateStr: string): Date {
  // Date-only contract values represent calendar dates, not UTC instants. parseISO keeps them local.
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? parseISO(dateStr) : new Date(dateStr);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const date = parseAdminSubscriptionsDisplayDate(dateStr);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(getAdminSubscriptionsLocale(), { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '—';
  const date = parseAdminSubscriptionsDisplayDate(dateStr);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(getAdminSubscriptionsLocale(), { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}
