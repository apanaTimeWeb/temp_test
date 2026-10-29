import type { ManagerFinancePaymentsPaymentStatus } from '@/app/frontend_manager/manager_finance/finance_payments/types/ManagerFinancePaymentsTypes';
export function normalizeManagerPaymentsPaymentStatus(value: string): ManagerFinancePaymentsPaymentStatus {
  if (value === 'valid' || value === 'deleted') return value;
  return 'unknown';
}
