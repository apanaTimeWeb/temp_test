import { describe, expect, it } from 'vitest';
import { MANAGER_FINANCE_QUERY_KEYS } from '@/app/frontend_manager/manager_finance/finance_subscriptions/api/manager_finance_subscriptions.query_keys';

describe('ManagerFinanceSubscriptionsQueryKeys', () => {
  it('uses the canonical module namespace and distinct resource keys', () => {
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()[0]).toBe('manager_subscriptions');
    expect(MANAGER_FINANCE_QUERY_KEYS.refunds()[0]).toBe('manager_subscriptions');
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()).not.toEqual(MANAGER_FINANCE_QUERY_KEYS.refunds());
  });
});
