// RESPONSIBILITY: Define source-level test coverage for billing overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_overview/tests/SuperadminBillingOverviewHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BILLING_OVERVIEW_ROUTES as __SUPERADMIN_BILLING_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_billing/billing_overview/config/superadmin_billing_overview.url_config";
import { SUPERADMIN_BILLING_OVERVIEW_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/api/superadmin_billing_overview.query_keys';

describe('billing_overview standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_BILLING_OVERVIEW_ROUTES.SUPERADMIN_BILLING_OVERVIEW_URLS.PAGE).toContain('/superadmin/superadmin_billing');
    expect(__SUPERADMIN_BILLING_OVERVIEW_ROUTES.SUPERADMIN_BILLING_OVERVIEW_URLS.SCREEN).toBe("/superadmin/superadmin_billing/billing_overview");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_BILLING_OVERVIEW_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_billing", "billing_overview"]);
  });
});
