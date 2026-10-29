import type { ManagerFinanceRenewalsPaymentStatus, ManagerFinanceRenewalsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsTypes';

/** Preserve only statuses explicitly understood by this frontend contract. Unknown values must never be presented as valid or pending. */
export function normalizeManagerRenewalsPaymentStatus(status: string): ManagerFinanceRenewalsPaymentStatus {
  if (status === 'valid' || status === 'deleted') return status;
  return 'unknown';
}

/** Preserve only documented refund states; unknown backend values stay visibly unknown. */
export function normalizeManagerRenewalsRefundStatus(status: string): ManagerFinanceRenewalsRefundStatus {
  if (status === 'pending' || status === 'approved' || status === 'processed' || status === 'rejected') return status;
  return 'unknown';
}
