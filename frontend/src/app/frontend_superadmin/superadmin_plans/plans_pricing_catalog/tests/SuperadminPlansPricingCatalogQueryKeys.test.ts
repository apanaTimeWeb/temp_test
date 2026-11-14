// RESPONSIBILITY: Define source-level test coverage for plans pricing catalog using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_plans/plans_pricing_catalog/tests/SuperadminPlansPricingCatalogQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_PLANS_PRICING_CATALOG_QUERY_KEYS } from '../api/superadmin_plans_pricing_catalog.query_keys';

describe('plans_pricing_catalog canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_PLANS_PRICING_CATALOG_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_plans', 'plans_pricing_catalog']);
    expect(SUPERADMIN_PLANS_PRICING_CATALOG_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_PLANS_PRICING_CATALOG_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_PLANS_PRICING_CATALOG_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_PLANS_PRICING_CATALOG_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
