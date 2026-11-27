import { getAdminFinanceLocale } from '@/app/frontend_admin/admin_finance/finance_referrals/utils/AdminFinanceReferralsLocale';

export function formatCurrency(amountMinor: number, currency: string, locale: string): string {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) throw new RangeError('Finance currency amounts must be safe nonnegative integers in minor units.');
  const safeMinor = amountMinor;
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(safeMinor / (10 ** fractionDigits));
}

export function formatAdminFinanceCurrency(amountMinor: number, currency = 'INR'): string {
  return formatCurrency(amountMinor, currency, getAdminFinanceLocale());
}
