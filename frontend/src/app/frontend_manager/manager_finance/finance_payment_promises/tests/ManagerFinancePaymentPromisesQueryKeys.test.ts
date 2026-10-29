import { describe, expect, it } from 'vitest';
import { MANAGER_FINANCE_QUERY_KEYS } from '@/app/frontend_manager/manager_finance/finance_payment_promises/api/manager_finance_payment_promises.query_keys';

describe('ManagerFinancePaymentPromisesQueryKeys', () => {
  it('uses the canonical module namespace and distinct resource keys', () => {
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()[0]).toBe('manager_payment_promises');
    expect(MANAGER_FINANCE_QUERY_KEYS.refunds()[0]).toBe('manager_payment_promises');
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()).not.toEqual(MANAGER_FINANCE_QUERY_KEYS.refunds());
  });
});
