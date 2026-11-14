// RESPONSIBILITY: Define source-level test coverage for security overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_overview/tests/SuperadminSecurityOverviewHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SECURITY_OVERVIEW_ROUTES as __SUPERADMIN_SECURITY_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_security/security_overview/config/superadmin_security_overview.url_config";
import { SUPERADMIN_SECURITY_OVERVIEW_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_security/security_overview/api/superadmin_security_overview.query_keys';

describe('security_overview standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_SECURITY_OVERVIEW_ROUTES.SUPERADMIN_SECURITY_OVERVIEW_URLS.PAGE).toContain('/superadmin/superadmin_security');
    expect(__SUPERADMIN_SECURITY_OVERVIEW_ROUTES.SUPERADMIN_SECURITY_OVERVIEW_URLS.SCREEN).toBe("/superadmin/superadmin_security/security_overview");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_SECURITY_OVERVIEW_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_security", "security_overview"]);
  });
});
