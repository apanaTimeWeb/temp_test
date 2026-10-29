import type { ManagerFinanceReceiptsPaymentStatus, ManagerFinanceReceiptsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_receipts/types/ManagerFinanceReceiptsTypes';

/** Preserve only statuses explicitly understood by this frontend contract. Unknown values must never be presented as valid or pending. */
export function normalizeManagerReceiptPaymentStatus(status: string): ManagerFinanceReceiptsPaymentStatus {
  if (status === 'valid' || status === 'deleted') return status;
  return 'unknown';
}

/** Preserve only documented refund states; unknown backend values stay visibly unknown. */
export function normalizeManagerReceiptRefundStatus(status: string): ManagerFinanceReceiptsRefundStatus {
  if (status === 'pending' || status === 'approved' || status === 'processed' || status === 'rejected') return status;
  return 'unknown';
}
