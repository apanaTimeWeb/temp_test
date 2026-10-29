import type { ManagerFinancePaymentsPayment } from '@/app/frontend_manager/manager_finance/finance_payments/types/ManagerFinancePaymentsTypes';

/** Raised while the external payments endpoint/response/auth contract is not supplied. */
export class ManagerFinancePaymentsContractMissingError extends Error {
  readonly code = 'CONTRACT_MISSING' as const;

  constructor() {
    super('Payments are unavailable because the authoritative backend API contract was not supplied.');
    this.name = 'ManagerFinancePaymentsContractMissingError';
  }
}

/** Does not issue a network request until an authoritative API contract is available. */
export async function fetchManagerFinancePayments(): Promise<ManagerFinancePaymentsPayment[]> {
  throw new ManagerFinancePaymentsContractMissingError();
}
