import type { ManagerFinanceRefundsRefund } from '@/app/frontend_manager/manager_finance/finance_refunds/types/ManagerFinanceRefundsTypes';

/** Raised while the external refunds endpoint/response/auth contract is not supplied. */
export class ManagerFinanceRefundsContractMissingError extends Error {
  readonly code = 'CONTRACT_MISSING' as const;

  constructor() {
    super('Refunds are unavailable because the authoritative backend API contract was not supplied.');
    this.name = 'ManagerFinanceRefundsContractMissingError';
  }
}

/** Does not issue a network request until an authoritative API contract is available. */
export async function fetchManagerFinanceRefunds(): Promise<ManagerFinanceRefundsRefund[]> {
  throw new ManagerFinanceRefundsContractMissingError();
}
