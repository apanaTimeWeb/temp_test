// RESPONSIBILITY: Define source-level test coverage for billing member payment promises using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_payment_promises/tests/SuperadminBillingOverviewMemberPaymentPromisesHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BILLING_MEMBER_PAYMENT_PROMISES_ROUTES as __SUPERADMIN_BILLING_MEMBER_PAYMENT_PROMISES_ROUTES } from "@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/config/superadmin_billing_member_payment_promises.url_config";
import { SUPERADMIN_FINANCE_PAYMENT_PROMISES_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/api/superadmin_billing_overview_member_payment_promises.query_keys';

describe('member_payment_promises standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_BILLING_MEMBER_PAYMENT_PROMISES_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENT_PROMISES_FINANCE_PAYMENT_PROMISES_URLS.PAGE).toContain('/superadmin/superadmin_billing');
    expect(__SUPERADMIN_BILLING_MEMBER_PAYMENT_PROMISES_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENT_PROMISES_FINANCE_PAYMENT_PROMISES_URLS.SCREEN).toBe("/superadmin/superadmin_billing/billing_overview?view=member_payment_promises");
    expect(__SUPERADMIN_BILLING_MEMBER_PAYMENT_PROMISES_ROUTES.SUPERADMIN_FINANCE_MEMBER_PAYMENT_PROMISES_URLS.PAGE).toBe('/superadmin/superadmin_billing/billing_member_payment_promises');
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_FINANCE_PAYMENT_PROMISES_QUERY_KEYS.all[0]).toBe('superadmin_member_payment_promises');
  });
});
