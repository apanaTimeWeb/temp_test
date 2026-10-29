import type { ManagerFinanceRefundsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_refunds/types/ManagerFinanceRefundsTypes';
export function normalizeManagerRefundsRefundStatus(value: string): ManagerFinanceRefundsRefundStatus {
  if (value === 'pending' || value === 'approved' || value === 'rejected' || value === 'processed') return value;
  return 'unknown';
}
