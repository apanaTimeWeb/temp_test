// utils/AdminAssetsRegisterFormatters.ts

export function adminAssetsRegisterFormatCurrency(amountMinor: number, locale = 'en-IN'): string {
  const amountMajor = (amountMinor ?? 0) / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountMajor);
}

export function adminAssetsRegisterFormatDate(dateStr?: string | null, locale = 'en-IN'): string {
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

export function getDaysUntilExpiry(expiryDateStr?: string | null): number | null {
  if (!expiryDateStr) return null;
  try {
    const expiry = new Date(expiryDateStr).getTime();
    const now = new Date().getTime();
    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

export function isExpiringSoon(expiryDateStr?: string | null, daysThreshold = 30): boolean {
  const days = getDaysUntilExpiry(expiryDateStr);
  return days !== null && days >= 0 && days <= daysThreshold;
}

export const formatPaiseToRupees = adminAssetsRegisterFormatCurrency;
export const formatAssetDate = adminAssetsRegisterFormatDate;

