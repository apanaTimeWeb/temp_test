// RESPONSIBILITY: Define source-level test coverage for plans promotions using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_plans/plans_promotions/tests/SuperadminPlansPromotionsQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_PLANS_PROMOTIONS_QUERY_KEYS } from '../api/superadmin_plans_promotions.query_keys';

describe('plans_promotions canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_PLANS_PROMOTIONS_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_plans', 'plans_promotions']);
    expect(SUPERADMIN_PLANS_PROMOTIONS_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_PLANS_PROMOTIONS_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_PLANS_PROMOTIONS_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_PLANS_PROMOTIONS_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
