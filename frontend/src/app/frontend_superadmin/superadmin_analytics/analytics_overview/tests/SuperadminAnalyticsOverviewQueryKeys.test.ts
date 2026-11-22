// RESPONSIBILITY: Define source-level test coverage for analytics overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_analytics/analytics_overview/tests/SuperadminAnalyticsOverviewQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_ANALYTICS_OVERVIEW_QUERY_KEYS } from '../api/superadmin_analytics_overview.query_keys';

describe('analytics_overview canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_ANALYTICS_OVERVIEW_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_analytics', 'analytics_overview']);
    expect(SUPERADMIN_ANALYTICS_OVERVIEW_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_ANALYTICS_OVERVIEW_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_ANALYTICS_OVERVIEW_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_ANALYTICS_OVERVIEW_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
