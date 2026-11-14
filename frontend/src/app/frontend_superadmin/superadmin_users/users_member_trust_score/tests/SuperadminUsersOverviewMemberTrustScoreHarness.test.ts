// RESPONSIBILITY: Define source-level test coverage for users member trust score using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_member_trust_score/tests/SuperadminUsersOverviewMemberTrustScoreHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_USERS_MEMBER_TRUST_SCORE_ROUTES as __SUPERADMIN_USERS_MEMBER_TRUST_SCORE_ROUTES } from "@/app/frontend_superadmin/superadmin_users/users_member_trust_score/config/users_member_trust_score.url_config";
import { SUPERADMIN_FINANCE_TRUST_SCORE_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/api/superadmin_users_overview_member_trust_score.query_keys';

describe('member_trust_score standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_USERS_MEMBER_TRUST_SCORE_ROUTES.SUPERADMIN_USERS_OVERVIEW_MEMBER_TRUST_SCORE_FINANCE_TRUST_SCORE_URLS.PAGE).toContain('/superadmin/superadmin_users');
    expect(__SUPERADMIN_USERS_MEMBER_TRUST_SCORE_ROUTES.SUPERADMIN_USERS_OVERVIEW_MEMBER_TRUST_SCORE_FINANCE_TRUST_SCORE_URLS.SCREEN).toBe("/superadmin/superadmin_users/users_overview?view=member_trust_score");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_FINANCE_TRUST_SCORE_QUERY_KEYS.all[0]).toBe('superadmin_member_trust_score');
  });
});
