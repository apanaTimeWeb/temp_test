import type { ManagerFinanceReferralsPaymentStatus, ManagerFinanceReferralsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_referrals/types/ManagerFinanceReferralsTypes';

/** Preserve only statuses explicitly understood by this frontend contract. Unknown values must never be presented as valid or pending. */
export function normalizeManagerReferralsPaymentStatus(status: string): ManagerFinanceReferralsPaymentStatus {
  if (status === 'valid' || status === 'deleted') return status;
  return 'unknown';
}

/** Preserve only documented refund states; unknown backend values stay visibly unknown. */
export function normalizeManagerReferralsRefundStatus(status: string): ManagerFinanceReferralsRefundStatus {
  if (status === 'pending' || status === 'approved' || status === 'processed' || status === 'rejected') return status;
  return 'unknown';
}
