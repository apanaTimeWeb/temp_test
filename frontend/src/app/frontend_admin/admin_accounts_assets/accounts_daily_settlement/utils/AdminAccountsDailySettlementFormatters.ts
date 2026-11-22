// utils/AdminAccountsDailySettlementFormatters.ts

/**
 * Formats minor-unit paise amount to locale-aware Indian Rupee display.
 * @param amountMinor - amount in paise (e.g. 100000 = ₹1,000)
 * @param locale - locale code, defaults to 'en-IN'
 */
export function adminAccountsDailySettlementFormatCurrency(amountMinor: number, locale = 'en-IN'): string {
  const amountMajor = (amountMinor ?? 0) / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountMajor);
}

/**
 * Formats ISO date to readable string.
 */
export function adminAccountsDailySettlementFormatDate(dateStr: string, locale = 'en-IN'): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export const formatPaiseToRupees = adminAccountsDailySettlementFormatCurrency;
export const formatSettlementDate = adminAccountsDailySettlementFormatDate;
