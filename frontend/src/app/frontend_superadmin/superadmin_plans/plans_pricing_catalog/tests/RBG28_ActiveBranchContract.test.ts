// RESPONSIBILITY: Define source-level test coverage for plans pricing catalog using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_plans/plans_pricing_catalog/tests/RBG28_ActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('RBG-28 active route branch contract', () => {
  it('preserves the active route and excludes unreachable sibling render branches', () => {
    const source = readFileSync(new URL('../components/SuperadminPlansPricingCatalogPageClient.tsx', import.meta.url), 'utf8');
    expect(source).toContain("activeTab");
    expect(source).not.toContain("activeTab === 'Active Subscribers' &&");
  });

  it('removes unreachable sibling artifacts from the active route leaf', () => {
    const source = readFileSync(new URL('../components/SuperadminPlansPricingCatalogPageClient.tsx', import.meta.url), 'utf8');
    expect(source).not.toContain('SuperadminPlansPricingCatalogSemanticTable');
    expect(source).not.toContain('useSuperadminPlansPricingCatalogSemanticTableState');
  });
});
