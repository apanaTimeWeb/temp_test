/**
 * Fail-closed API boundary. The supplied frontend archive contains no authoritative
 * endpoint/response contract for this domain mapping. Do not treat another domain's
 * payment/refund response as this feature's data.
 */
import type { ManagerFinanceAutoSuspendPayment, ManagerFinanceAutoSuspendRefund } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendTypes';
export const MANAGER_AUTO_SUSPEND_API_CONTRACT_STATUS = 'CONTRACT_NOT_FOUND_IN_WEB_ZIP' as const;

export async function fetchManagerAutoSuspendPayments(): Promise<ManagerFinanceAutoSuspendPayment[]> {
  throw Object.assign(new Error('CONTRACT_NOT_FOUND_IN_WEB_ZIP: authoritative endpoint/response contract is not supplied.'), { code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP' as const, status: 501 as const });
}

export async function fetchManagerAutoSuspendRefunds(): Promise<ManagerFinanceAutoSuspendRefund[]> {
  throw Object.assign(new Error('CONTRACT_NOT_FOUND_IN_WEB_ZIP: authoritative endpoint/response contract is not supplied.'), { code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP' as const, status: 501 as const });
}

