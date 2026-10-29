import type { ManagerFinanceSubscriptionsPaymentStatus, ManagerFinanceSubscriptionsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_subscriptions/types/ManagerFinanceSubscriptionsTypes';

/** Preserve only statuses explicitly understood by this frontend contract. Unknown values must never be presented as valid or pending. */
export function normalizeManagerSubscriptionsPaymentStatus(status: string): ManagerFinanceSubscriptionsPaymentStatus {
  if (status === 'valid' || status === 'deleted') return status;
  return 'unknown';
}

/** Preserve only documented refund states; unknown backend values stay visibly unknown. */
export function normalizeManagerSubscriptionsRefundStatus(status: string): ManagerFinanceSubscriptionsRefundStatus {
  if (status === 'pending' || status === 'approved' || status === 'processed' || status === 'rejected') return status;
  return 'unknown';
}
