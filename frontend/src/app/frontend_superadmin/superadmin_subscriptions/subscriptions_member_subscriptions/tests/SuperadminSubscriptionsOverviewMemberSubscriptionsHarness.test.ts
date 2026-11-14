// RESPONSIBILITY: Define source-level test coverage for subscriptions member subscriptions using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_subscriptions/subscriptions_member_subscriptions/tests/SuperadminSubscriptionsOverviewMemberSubscriptionsHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SUBSCRIPTIONS_MEMBER_SUBSCRIPTIONS_ROUTES as __SUPERADMIN_SUBSCRIPTIONS_MEMBER_SUBSCRIPTIONS_ROUTES } from "@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/config/subscriptions_member_subscriptions.url_config";
import { SUPERADMIN_FINANCE_SUBSCRIPTIONS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/api/superadmin_subscriptions_overview_member_subscriptions.query_keys';

describe('member_subscriptions standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_SUBSCRIPTIONS_MEMBER_SUBSCRIPTIONS_ROUTES.SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_SUBSCRIPTIONS_FINANCE_SUBSCRIPTIONS_URLS.PAGE).toContain('/superadmin/superadmin_subscriptions');
    expect(__SUPERADMIN_SUBSCRIPTIONS_MEMBER_SUBSCRIPTIONS_ROUTES.SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_SUBSCRIPTIONS_FINANCE_SUBSCRIPTIONS_URLS.SCREEN).toBe("/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_subscriptions");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_FINANCE_SUBSCRIPTIONS_QUERY_KEYS.all[0]).toBe('superadmin_member_subscriptions');
  });
});
