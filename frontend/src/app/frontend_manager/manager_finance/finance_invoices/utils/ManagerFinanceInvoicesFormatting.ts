/**
 * Pure, feature-local formatters. Monetary values are stored as integer minor units.
 * Consumers must pass the active locale from next-intl; a default locale is deliberately not provided.
 */
export function formatCurrency(amountMinor: number, currencyCode: string, locale: string): string {
  if (!Number.isFinite(amountMinor)) return '—';
  try {
    const currencyFormatter = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode });
    const fractionDigits = currencyFormatter.resolvedOptions().maximumFractionDigits ?? 2;
    const divisor = 10 ** fractionDigits;
    return currencyFormatter.format(amountMinor / divisor);
  } catch {
    return '—';
  }
}

/** Converts a user-entered major-unit amount to integer minor units before a verified API call. */
export function toMinorUnits(amountMajor: number, currencyCode: string, locale: string): number {
  if (!Number.isFinite(amountMajor)) throw new RangeError('Amount must be a finite number.');
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).resolvedOptions().maximumFractionDigits ?? 2;
  return Math.round(amountMajor * (10 ** fractionDigits));
}

export function formatDate(dateStr: string, locale: string): string {
  if (!dateStr) return '—';
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]), 12)
    : new Date(dateStr);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export function formatDateTime(dateStr: string, locale: string): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}
