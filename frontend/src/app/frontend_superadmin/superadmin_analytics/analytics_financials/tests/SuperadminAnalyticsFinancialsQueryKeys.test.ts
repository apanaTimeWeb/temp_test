// RESPONSIBILITY: Define source-level test coverage for analytics financials using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_analytics/analytics_financials/tests/SuperadminAnalyticsFinancialsQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_ANALYTICS_FINANCIALS_QUERY_KEYS } from '../api/superadmin_analytics_financials.query_keys';

describe('analytics_financials canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_ANALYTICS_FINANCIALS_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_analytics', 'analytics_financials']);
    expect(SUPERADMIN_ANALYTICS_FINANCIALS_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_ANALYTICS_FINANCIALS_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_ANALYTICS_FINANCIALS_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_ANALYTICS_FINANCIALS_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
