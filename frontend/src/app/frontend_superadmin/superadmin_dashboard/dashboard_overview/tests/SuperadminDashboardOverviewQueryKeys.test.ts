// RESPONSIBILITY: Define source-level test coverage for dashboard overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_dashboard/dashboard_overview/tests/SuperadminDashboardOverviewQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_DASHBOARD_OVERVIEW_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/api/superadmin_dashboard_overview.query_keys';

describe('dashboard_overview canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_DASHBOARD_OVERVIEW_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_dashboard', 'dashboard_overview']);
    expect(SUPERADMIN_DASHBOARD_OVERVIEW_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_DASHBOARD_OVERVIEW_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_DASHBOARD_OVERVIEW_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_DASHBOARD_OVERVIEW_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
