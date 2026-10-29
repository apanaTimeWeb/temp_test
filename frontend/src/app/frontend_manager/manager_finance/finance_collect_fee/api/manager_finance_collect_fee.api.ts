/**
 * Fail-closed API boundary. The supplied frontend archive contains no authoritative
 * endpoint/response contract for this domain mapping. Do not issue undocumented requests.
 */
import type { ManagerFinanceCollectFeePayment } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';
export const MANAGER_COLLECT_FEE_API_CONTRACT_STATUS = 'CONTRACT_NOT_FOUND_IN_WEB_ZIP' as const;

export async function fetchManagerCollectFeePayments(): Promise<ManagerFinanceCollectFeePayment[]> {
  throw Object.assign(new Error('CONTRACT_NOT_FOUND_IN_WEB_ZIP: authoritative endpoint/response contract is not supplied.'), { code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP' as const, status: 501 as const });
}
