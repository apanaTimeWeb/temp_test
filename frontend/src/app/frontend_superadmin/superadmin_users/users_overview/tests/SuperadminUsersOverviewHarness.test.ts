// RESPONSIBILITY: Define source-level test coverage for users overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_overview/tests/SuperadminUsersOverviewHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_USERS_OVERVIEW_ROUTES as __SUPERADMIN_USERS_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_users/users_overview/config/superadmin_users_overview.url_config";
import { SUPERADMIN_USERS_OVERVIEW_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_users/users_overview/api/superadmin_users_overview.query_keys';

describe('users_overview standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_USERS_OVERVIEW_ROUTES.SUPERADMIN_USERS_OVERVIEW_URLS.PAGE).toContain('/superadmin/superadmin_users');
    expect(__SUPERADMIN_USERS_OVERVIEW_ROUTES.SUPERADMIN_USERS_OVERVIEW_URLS.SCREEN).toBe("/superadmin/superadmin_users/users_overview");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_USERS_OVERVIEW_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_users", "users_overview"]);
  });
});
