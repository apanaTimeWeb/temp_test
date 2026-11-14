// RESPONSIBILITY: Define source-level test coverage for billing member security deposits using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_security_deposits/tests/SuperadminBillingOverviewMemberSecurityDepositsHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BILLING_MEMBER_SECURITY_DEPOSITS_ROUTES as __SUPERADMIN_BILLING_MEMBER_SECURITY_DEPOSITS_ROUTES } from "@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/config/billing_member_security_deposits.url_config";
import { SUPERADMIN_FINANCE_SECURITY_DEPOSITS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/api/superadmin_billing_overview_member_security_deposits.query_keys';

describe('member_security_deposits standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_BILLING_MEMBER_SECURITY_DEPOSITS_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_SECURITY_DEPOSITS_FINANCE_SECURITY_DEPOSITS_URLS.PAGE).toContain('/superadmin/superadmin_billing');
    expect(__SUPERADMIN_BILLING_MEMBER_SECURITY_DEPOSITS_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_SECURITY_DEPOSITS_FINANCE_SECURITY_DEPOSITS_URLS.SCREEN).toBe("/superadmin/superadmin_billing/billing_overview?view=member_security_deposits");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_FINANCE_SECURITY_DEPOSITS_QUERY_KEYS.all[0]).toBe('superadmin_member_security_deposits');
  });
});
