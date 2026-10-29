import { describe, expect, it } from 'vitest';
import { MANAGER_FINANCE_QUERY_KEYS } from '@/app/frontend_manager/manager_finance/finance_trust_scores/api/manager_finance_trust_scores.query_keys';

describe('ManagerFinanceTrustScoresQueryKeys', () => {
  it('uses the canonical module namespace and distinct resource keys', () => {
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()[0]).toBe('manager_trust_scores');
    expect(MANAGER_FINANCE_QUERY_KEYS.refunds()[0]).toBe('manager_trust_scores');
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()).not.toEqual(MANAGER_FINANCE_QUERY_KEYS.refunds());
  });
});
