import type { ManagerFinanceTrustScoresPaymentStatus, ManagerFinanceTrustScoresRefundStatus } from '@/app/frontend_manager/manager_finance/finance_trust_scores/types/ManagerFinanceTrustScoresTypes';

/** Preserve only statuses explicitly understood by this frontend contract. Unknown values must never be presented as valid or pending. */
export function normalizeManagerTrustScoresPaymentStatus(status: string): ManagerFinanceTrustScoresPaymentStatus {
  if (status === 'valid' || status === 'deleted') return status;
  return 'unknown';
}

/** Preserve only documented refund states; unknown backend values stay visibly unknown. */
export function normalizeManagerTrustScoresRefundStatus(status: string): ManagerFinanceTrustScoresRefundStatus {
  if (status === 'pending' || status === 'approved' || status === 'processed' || status === 'rejected') return status;
  return 'unknown';
}
