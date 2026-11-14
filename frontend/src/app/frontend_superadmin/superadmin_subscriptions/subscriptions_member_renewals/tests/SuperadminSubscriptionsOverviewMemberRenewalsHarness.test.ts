// RESPONSIBILITY: Define source-level test coverage for subscriptions member renewals using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_subscriptions/subscriptions_member_renewals/tests/SuperadminSubscriptionsOverviewMemberRenewalsHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SUBSCRIPTIONS_MEMBER_RENEWALS_ROUTES as __SUPERADMIN_SUBSCRIPTIONS_MEMBER_RENEWALS_ROUTES } from "@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/config/subscriptions_member_renewals.url_config";
import { SUPERADMIN_FINANCE_RENEWALS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/api/superadmin_subscriptions_overview_member_renewals.query_keys';

describe('member_renewals standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_SUBSCRIPTIONS_MEMBER_RENEWALS_ROUTES.SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_RENEWALS_FINANCE_RENEWALS_URLS.PAGE).toContain('/superadmin/superadmin_subscriptions');
    expect(__SUPERADMIN_SUBSCRIPTIONS_MEMBER_RENEWALS_ROUTES.SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_RENEWALS_FINANCE_RENEWALS_URLS.SCREEN).toBe("/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_renewals");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_FINANCE_RENEWALS_QUERY_KEYS.all[0]).toBe('superadmin_member_renewals');
  });
});
