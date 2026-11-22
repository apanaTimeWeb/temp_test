// RESPONSIBILITY: Define source-level test coverage for analytics overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_analytics/analytics_overview/tests/SuperadminAnalyticsOverviewUrlFilter.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { buildSuperadminReportsFilterSearch } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/hooks/useSuperadminAnalyticsOverviewUrlFilter';

describe('Superadmin Reports URL filter query state', () => {
  it('preserves unrelated query parameters when a report filter changes', () => {
    const query = buildSuperadminReportsFilterSearch('?tab=Financials&tenantStatus=Active', 'dateRange', 'Last 6 Months', 'This Year');
    expect(new URLSearchParams(query).get('tab')).toBe('Financials');
    expect(new URLSearchParams(query).get('tenantStatus')).toBe('Active');
    expect(new URLSearchParams(query).get('dateRange')).toBe('This Year');
  });

  it('removes the default report filter without clearing other filters', () => {
    const query = buildSuperadminReportsFilterSearch('?dateRange=This+Year&tenantStatus=Active', 'dateRange', 'Last 6 Months', 'Last 6 Months');
    expect(new URLSearchParams(query).has('dateRange')).toBe(false);
    expect(new URLSearchParams(query).get('tenantStatus')).toBe('Active');
  });
});
