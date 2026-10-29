import type { ManagerFinanceFinesPaymentsPaymentStatus, ManagerFinanceFinesPaymentsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_fines_payments/types/ManagerFinanceFinesPaymentsTypes';

/** Preserve only statuses explicitly understood by this frontend contract. Unknown values must never be presented as valid or pending. */
export function normalizeManagerFinesPaymentsPaymentStatus(status: string): ManagerFinanceFinesPaymentsPaymentStatus {
  if (status === 'valid' || status === 'deleted') return status;
  return 'unknown';
}

/** Preserve only documented refund states; unknown backend values stay visibly unknown. */
export function normalizeManagerFinesPaymentsRefundStatus(status: string): ManagerFinanceFinesPaymentsRefundStatus {
  if (status === 'pending' || status === 'approved' || status === 'processed' || status === 'rejected') return status;
  return 'unknown';
}
