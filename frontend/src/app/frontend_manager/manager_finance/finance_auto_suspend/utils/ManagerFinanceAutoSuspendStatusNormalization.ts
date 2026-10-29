import type { ManagerFinanceAutoSuspendPaymentStatus, ManagerFinanceAutoSuspendRefundStatus } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendTypes';

/** Preserve only statuses explicitly understood by this frontend contract. Unknown values must never be presented as valid or pending. */
export function normalizeManagerAutoSuspendPaymentStatus(status: string): ManagerFinanceAutoSuspendPaymentStatus {
  if (status === 'valid' || status === 'deleted') return status;
  return 'unknown';
}

/** Preserve only documented refund states; unknown backend values stay visibly unknown. */
export function normalizeManagerAutoSuspendRefundStatus(status: string): ManagerFinanceAutoSuspendRefundStatus {
  if (status === 'pending' || status === 'approved' || status === 'processed' || status === 'rejected') return status;
  return 'unknown';
}
