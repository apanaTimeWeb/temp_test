// RESPONSIBILITY: Define source-level test coverage for billing invoices using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_invoices/tests/SuperadminBillingInvoicesQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BILLING_INVOICES_QUERY_KEYS } from '../api/superadmin_billing_invoices.query_keys';

describe('billing_invoices canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_BILLING_INVOICES_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_billing', 'billing_invoices']);
    expect(SUPERADMIN_BILLING_INVOICES_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_BILLING_INVOICES_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_BILLING_INVOICES_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_BILLING_INVOICES_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
