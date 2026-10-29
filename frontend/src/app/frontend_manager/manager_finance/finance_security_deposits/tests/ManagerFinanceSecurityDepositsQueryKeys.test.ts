import { describe, expect, it } from 'vitest';
import { MANAGER_FINANCE_QUERY_KEYS } from '@/app/frontend_manager/manager_finance/finance_security_deposits/api/manager_finance_security_deposits.query_keys';

describe('ManagerFinanceSecurityDepositsQueryKeys', () => {
  it('uses the canonical module namespace and distinct resource keys', () => {
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()[0]).toBe('manager_security_deposits');
    expect(MANAGER_FINANCE_QUERY_KEYS.refunds()[0]).toBe('manager_security_deposits');
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()).not.toEqual(MANAGER_FINANCE_QUERY_KEYS.refunds());
  });
});
