import type { ManagerFinanceSecurityDepositsPaymentStatus, ManagerFinanceSecurityDepositsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_security_deposits/types/ManagerFinanceSecurityDepositsTypes';

/** Preserve only statuses explicitly understood by this frontend contract. Unknown values must never be presented as valid or pending. */
export function normalizeManagerSecurityDepositsPaymentStatus(status: string): ManagerFinanceSecurityDepositsPaymentStatus {
  if (status === 'valid' || status === 'deleted') return status;
  return 'unknown';
}

/** Preserve only documented refund states; unknown backend values stay visibly unknown. */
export function normalizeManagerSecurityDepositsRefundStatus(status: string): ManagerFinanceSecurityDepositsRefundStatus {
  if (status === 'pending' || status === 'approved' || status === 'processed' || status === 'rejected') return status;
  return 'unknown';
}
