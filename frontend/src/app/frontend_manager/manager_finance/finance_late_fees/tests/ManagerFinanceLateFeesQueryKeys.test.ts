import { describe, expect, it } from 'vitest';
import { MANAGER_FINANCE_QUERY_KEYS } from '@/app/frontend_manager/manager_finance/finance_late_fees/api/manager_finance_late_fees.query_keys';

describe('ManagerFinanceLateFeesQueryKeys', () => {
  it('uses the canonical module namespace and distinct resource keys', () => {
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()[0]).toBe('manager_late_fees');
    expect(MANAGER_FINANCE_QUERY_KEYS.refunds()[0]).toBe('manager_late_fees');
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()).not.toEqual(MANAGER_FINANCE_QUERY_KEYS.refunds());
  });
});
