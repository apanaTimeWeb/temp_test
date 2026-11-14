// RESPONSIBILITY: Define source-level test coverage for billing member payments collection using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_payments_collection/tests/SuperadminBillingOverviewMemberPaymentsCollectionHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BILLING_MEMBER_PAYMENTS_COLLECTION_ROUTES as __SUPERADMIN_BILLING_MEMBER_PAYMENTS_COLLECTION_ROUTES } from "@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/config/superadmin_billing_member_payments_collection.url_config";
import { SUPERADMIN_FINANCE_COLLECT_FEE_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/api/superadmin_billing_overview_member_payments_collection.query_keys';

describe('member_payments_collection standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_BILLING_MEMBER_PAYMENTS_COLLECTION_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_COLLECTION_FINANCE_COLLECT_FEE_URLS.PAGE).toContain('/superadmin/superadmin_billing');
    expect(__SUPERADMIN_BILLING_MEMBER_PAYMENTS_COLLECTION_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_COLLECTION_FINANCE_COLLECT_FEE_URLS.SCREEN).toBe("/superadmin/superadmin_billing/billing_overview?view=member_payments_collection");
    expect(__SUPERADMIN_BILLING_MEMBER_PAYMENTS_COLLECTION_ROUTES.SUPERADMIN_FINANCE_MEMBER_PAYMENTS_COLLECTION_URLS.PAGE).toBe('/superadmin/superadmin_billing/billing_member_payments_collection');
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_FINANCE_COLLECT_FEE_QUERY_KEYS.all[0]).toBe('superadmin_member_payments_collection');
  });
});
