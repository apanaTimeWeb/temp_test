// RESPONSIBILITY: Define source-level test coverage for system health overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_health_overview/tests/SuperadminSystemHealthOverviewHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_ROUTES as __SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_system/system_health_overview/config/superadmin_system_health_overview.url_config";
import { SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/api/superadmin_system_health_overview.query_keys';

describe('system_health_overview standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_ROUTES.SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_URLS.PAGE).toContain('/superadmin/superadmin_system');
    expect(__SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_ROUTES.SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_URLS.SCREEN).toBe("/superadmin/superadmin_system/system_health_overview");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_system", "system_health_overview"]);
  });
});
