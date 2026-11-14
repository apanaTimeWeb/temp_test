// RESPONSIBILITY: Define source-level test coverage for billing member receipts using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_receipts/tests/SuperadminBillingInvoicesMemberReceiptsHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BILLING_MEMBER_RECEIPTS_ROUTES as __SUPERADMIN_BILLING_MEMBER_RECEIPTS_ROUTES } from "@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/config/superadmin_billing_member_receipts.url_config";
import { SUPERADMIN_FINANCE_RECEIPT_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/api/superadmin_billing_invoices_member_receipts.query_keys';

describe('member_receipts standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_BILLING_MEMBER_RECEIPTS_ROUTES.SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_URLS.PAGE).toContain('/superadmin/superadmin_billing');
    expect(__SUPERADMIN_BILLING_MEMBER_RECEIPTS_ROUTES.SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_URLS.SCREEN).toBe("/superadmin/superadmin_billing/billing_invoices?view=member_receipts");
    expect(__SUPERADMIN_BILLING_MEMBER_RECEIPTS_ROUTES.SUPERADMIN_FINANCE_MEMBER_RECEIPTS_URLS.PAGE).toBe('/superadmin/superadmin_billing/billing_member_receipts');
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_FINANCE_RECEIPT_QUERY_KEYS.all[0]).toBe('superadmin_member_receipts');
  });
});
