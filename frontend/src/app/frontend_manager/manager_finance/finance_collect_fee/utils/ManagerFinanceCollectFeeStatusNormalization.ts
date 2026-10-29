import type { ManagerFinanceCollectFeePaymentStatus } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';

/** Preserve only payment states explicitly understood by this frontend contract. */
export function normalizeManagerCollectFeePaymentStatus(status: string): ManagerFinanceCollectFeePaymentStatus {
  if (status === 'valid' || status === 'deleted') return status;
  return 'unknown';
}
