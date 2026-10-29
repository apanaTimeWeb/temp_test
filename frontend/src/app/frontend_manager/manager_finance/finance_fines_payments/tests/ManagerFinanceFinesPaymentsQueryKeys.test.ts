import { describe, expect, it } from 'vitest';
import { MANAGER_FINANCE_QUERY_KEYS } from '@/app/frontend_manager/manager_finance/finance_fines_payments/api/manager_finance_fines_payments.query_keys';

describe('ManagerFinanceFinesPaymentsQueryKeys', () => {
  it('uses the canonical module namespace and distinct resource keys', () => {
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()[0]).toBe('manager_fines_payments');
    expect(MANAGER_FINANCE_QUERY_KEYS.refunds()[0]).toBe('manager_fines_payments');
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()).not.toEqual(MANAGER_FINANCE_QUERY_KEYS.refunds());
  });
});
