/**
 * Fail-closed API boundary. The supplied frontend archive contains no authoritative
 * endpoint/response contract for this domain mapping. Do not treat another domain's
 * payment/refund response as this feature's data.
 */
import type { ManagerFinanceTrustScoresPayment, ManagerFinanceTrustScoresRefund } from '@/app/frontend_manager/manager_finance/finance_trust_scores/types/ManagerFinanceTrustScoresTypes';
export const MANAGER_TRUST_SCORES_API_CONTRACT_STATUS = 'CONTRACT_NOT_FOUND_IN_WEB_ZIP' as const;

export async function fetchManagerTrustScoresPayments(): Promise<ManagerFinanceTrustScoresPayment[]> {
  throw Object.assign(new Error('CONTRACT_NOT_FOUND_IN_WEB_ZIP: authoritative endpoint/response contract is not supplied.'), { code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP' as const, status: 501 as const });
}

export async function fetchManagerTrustScoresRefunds(): Promise<ManagerFinanceTrustScoresRefund[]> {
  throw Object.assign(new Error('CONTRACT_NOT_FOUND_IN_WEB_ZIP: authoritative endpoint/response contract is not supplied.'), { code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP' as const, status: 501 as const });
}

