// RESPONSIBILITY: Define source-level test coverage for subscriptions member auto suspend policy using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_subscriptions/subscriptions_member_auto_suspend_policy/tests/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SUBSCRIPTIONS_MEMBER_AUTO_SUSPEND_POLICY_ROUTES as __SUPERADMIN_SUBSCRIPTIONS_MEMBER_AUTO_SUSPEND_POLICY_ROUTES } from "@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_auto_suspend_policy/config/subscriptions_member_auto_suspend_policy.url_config";
import { SUPERADMIN_FINANCE_AUTO_SUSPEND_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_auto_suspend_policy/api/superadmin_subscriptions_overview_member_auto_suspend_policy.query_keys';

describe('member_auto_suspend_policy standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_SUBSCRIPTIONS_MEMBER_AUTO_SUSPEND_POLICY_ROUTES.SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_AUTO_SUSPEND_POLICY_FINANCE_AUTO_SUSPEND_URLS.PAGE).toContain('/superadmin/superadmin_subscriptions');
    expect(__SUPERADMIN_SUBSCRIPTIONS_MEMBER_AUTO_SUSPEND_POLICY_ROUTES.SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_AUTO_SUSPEND_POLICY_FINANCE_AUTO_SUSPEND_URLS.SCREEN).toBe("/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_auto_suspend_policy");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_FINANCE_AUTO_SUSPEND_QUERY_KEYS.all[0]).toBe('superadmin_member_auto_suspend_policy');
  });
});
