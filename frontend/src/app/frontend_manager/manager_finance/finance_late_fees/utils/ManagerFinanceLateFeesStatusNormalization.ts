import type { ManagerFinanceLateFeesPaymentStatus, ManagerFinanceLateFeesRefundStatus } from '@/app/frontend_manager/manager_finance/finance_late_fees/types/ManagerFinanceLateFeesTypes';

/** Preserve only statuses explicitly understood by this frontend contract. Unknown values must never be presented as valid or pending. */
export function normalizeManagerLateFeesPaymentStatus(status: string): ManagerFinanceLateFeesPaymentStatus {
  if (status === 'valid' || status === 'deleted') return status;
  return 'unknown';
}

/** Preserve only documented refund states; unknown backend values stay visibly unknown. */
export function normalizeManagerLateFeesRefundStatus(status: string): ManagerFinanceLateFeesRefundStatus {
  if (status === 'pending' || status === 'approved' || status === 'processed' || status === 'rejected') return status;
  return 'unknown';
}
