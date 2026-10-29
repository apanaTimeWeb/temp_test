import type { ManagerFinancePaymentPromisesPaymentStatus, ManagerFinancePaymentPromisesRefundStatus } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesTypes';

/** Preserve only statuses explicitly understood by this frontend contract. Unknown values must never be presented as valid or pending. */
export function normalizeManagerPaymentPromisesPaymentStatus(status: string): ManagerFinancePaymentPromisesPaymentStatus {
  if (status === 'valid' || status === 'deleted') return status;
  return 'unknown';
}

/** Preserve only documented refund states; unknown backend values stay visibly unknown. */
export function normalizeManagerPaymentPromisesRefundStatus(status: string): ManagerFinancePaymentPromisesRefundStatus {
  if (status === 'pending' || status === 'approved' || status === 'processed' || status === 'rejected') return status;
  return 'unknown';
}
