import { describe, expect, it } from 'vitest';
import { MANAGER_FINANCE_QUERY_KEYS } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/api/manager_finance_auto_suspend.query_keys';

describe('ManagerFinanceAutoSuspendQueryKeys', () => {
  it('uses the canonical module namespace and distinct resource keys', () => {
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()[0]).toBe('manager_auto_suspend');
    expect(MANAGER_FINANCE_QUERY_KEYS.refunds()[0]).toBe('manager_auto_suspend');
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()).not.toEqual(MANAGER_FINANCE_QUERY_KEYS.refunds());
  });
});
