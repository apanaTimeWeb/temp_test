// RESPONSIBILITY: Define source-level test coverage for billing invoices using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_invoices/tests/RBG26_ActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('RBG-26 active route branch contract', () => {
  it('preserves the active route and excludes unreachable sibling render branches', () => {
    const source = readFileSync(new URL('../components/SuperadminBillingInvoicesPageClient.tsx', import.meta.url), 'utf8');
    expect(source).toContain("activeTab");
    expect(source).not.toContain("activeTab === 'promos' &&");
  });

  it('removes unreachable sibling artifacts from the active route leaf', () => {
    const source = readFileSync(new URL('../components/SuperadminBillingInvoicesPageClient.tsx', import.meta.url), 'utf8');
    expect(source).not.toContain('SuperadminBillingInvoicesPromoSchema');
    expect(source).not.toContain('SuperadminBillingPromoFormValues');
    expect(source).not.toContain('SUPERADMIN_BILLING_SAMPLE_PROMOS');
  });
});
