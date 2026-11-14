// RESPONSIBILITY: Define source-level test coverage for billing member finance overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_finance_overview/tests/SuperadminBillingOverviewMemberFinanceOverviewHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BILLING_MEMBER_FINANCE_OVERVIEW_ROUTES as __SUPERADMIN_BILLING_MEMBER_FINANCE_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_billing/billing_member_finance_overview/config/superadmin_billing_member_finance_overview.url_config";
import { SUPERADMIN_FINANCE_FINANCE_DASHBOARD_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_finance_overview/api/superadmin_billing_overview_member_finance_overview.query_keys';

describe('member_finance_overview standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_BILLING_MEMBER_FINANCE_OVERVIEW_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_FINANCE_OVERVIEW_FINANCE_FINANCE_DASHBOARD_URLS.PAGE).toContain('/superadmin/superadmin_billing');
    expect(__SUPERADMIN_BILLING_MEMBER_FINANCE_OVERVIEW_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_FINANCE_OVERVIEW_FINANCE_FINANCE_DASHBOARD_URLS.SCREEN).toBe("/superadmin/superadmin_billing/billing_overview?view=member_finance_overview");
    expect(__SUPERADMIN_BILLING_MEMBER_FINANCE_OVERVIEW_ROUTES.SUPERADMIN_FINANCE_MEMBER_FINANCE_OVERVIEW_URLS.PAGE).toBe('/superadmin/superadmin_billing/billing_member_finance_overview');
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_FINANCE_FINANCE_DASHBOARD_QUERY_KEYS.all[0]).toBe('superadmin_member_finance_overview');
  });
});
