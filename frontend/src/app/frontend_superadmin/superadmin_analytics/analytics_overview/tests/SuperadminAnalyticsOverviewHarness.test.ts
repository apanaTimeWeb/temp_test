// RESPONSIBILITY: Define source-level test coverage for analytics overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_analytics/analytics_overview/tests/SuperadminAnalyticsOverviewHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_ANALYTICS_OVERVIEW_ROUTES as __SUPERADMIN_ANALYTICS_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_analytics/analytics_overview/config/superadmin_analytics_overview.url_config";
import { SUPERADMIN_ANALYTICS_OVERVIEW_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/api/superadmin_analytics_overview.query_keys';

describe('analytics_overview standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_ANALYTICS_OVERVIEW_ROUTES.SUPERADMIN_REPORTS_OVERVIEW_URLS.PAGE).toContain('/superadmin/superadmin_analytics');
    expect(__SUPERADMIN_ANALYTICS_OVERVIEW_ROUTES.SUPERADMIN_REPORTS_OVERVIEW_URLS.SCREEN).toBe("/superadmin/superadmin_analytics/analytics_overview");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_ANALYTICS_OVERVIEW_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_analytics", "analytics_overview"]);
  });
});
