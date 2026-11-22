// RESPONSIBILITY: Define source-level test coverage for subscriptions overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_subscriptions/subscriptions_overview/tests/SuperadminSubscriptionsOverviewHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_ROUTES as __SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/config/superadmin_subscriptions_overview.url_config";
import { SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/api/superadmin_subscriptions_overview.query_keys';

describe('subscriptions_overview standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_ROUTES.SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_URLS.PAGE).toContain('/superadmin/superadmin_subscriptions');
    expect(__SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_ROUTES.SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_URLS.SCREEN).toBe("/superadmin/superadmin_subscriptions/subscriptions_overview");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_subscriptions", "subscriptions_overview"]);
  });
});
