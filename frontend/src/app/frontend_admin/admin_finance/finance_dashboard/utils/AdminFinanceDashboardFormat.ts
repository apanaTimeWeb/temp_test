import { getAdminFinanceLocale } from '@/app/frontend_admin/admin_finance/finance_dashboard/utils/AdminFinanceDashboardLocale';

/** Formats the dashboard's existing minor-unit demo amounts using the current document locale. */
export function formatAdminFinanceCurrency(amountMinor: number, currency = 'INR'): string {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) throw new RangeError('Finance currency amounts must be safe nonnegative integers in minor units.');
  const locale = getAdminFinanceLocale();
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(amountMinor / (10 ** fractionDigits));
}
