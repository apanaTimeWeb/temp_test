// RESPONSIBILITY: Define source-level test coverage for users member referrals using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_member_referrals/tests/SuperadminUsersOverviewMemberReferralsHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_USERS_MEMBER_REFERRALS_ROUTES as __SUPERADMIN_USERS_MEMBER_REFERRALS_ROUTES } from "@/app/frontend_superadmin/superadmin_users/users_member_referrals/config/users_member_referrals.url_config";
import { SUPERADMIN_FINANCE_REFERRALS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_users/users_member_referrals/api/superadmin_users_overview_member_referrals.query_keys';

describe('member_referrals standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_USERS_MEMBER_REFERRALS_ROUTES.SUPERADMIN_USERS_OVERVIEW_MEMBER_REFERRALS_FINANCE_REFERRALS_URLS.PAGE).toContain('/superadmin/superadmin_users');
    expect(__SUPERADMIN_USERS_MEMBER_REFERRALS_ROUTES.SUPERADMIN_USERS_OVERVIEW_MEMBER_REFERRALS_FINANCE_REFERRALS_URLS.SCREEN).toBe("/superadmin/superadmin_users/users_overview?view=member_referrals");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_FINANCE_REFERRALS_QUERY_KEYS.all[0]).toBe('superadmin_member_referrals');
  });
});
