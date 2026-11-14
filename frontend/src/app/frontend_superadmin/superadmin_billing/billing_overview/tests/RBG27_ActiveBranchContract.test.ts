// RESPONSIBILITY: Define source-level test coverage for billing overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_overview/tests/RBG27_ActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('RBG-27 active route branch contract', () => {
  it('preserves the active route and excludes unreachable sibling render branches', () => {
    const source = readFileSync(new URL('../components/SuperadminBillingOverviewPageClient.tsx', import.meta.url), 'utf8');
    expect(source).toContain("activeTab");
    expect(source).not.toContain("activeTab === 'promos' &&");
  });

  it('removes unreachable sibling artifacts from the active route leaf', () => {
    const source = readFileSync(new URL('../components/SuperadminBillingOverviewPageClient.tsx', import.meta.url), 'utf8');
    expect(source).not.toContain('SuperadminBillingOverviewPromoSchema');
    expect(source).not.toContain('SuperadminBillingPromoFormValues');
    expect(source).not.toContain('SUPERADMIN_BILLING_SAMPLE_PROMOS');
  });
});
