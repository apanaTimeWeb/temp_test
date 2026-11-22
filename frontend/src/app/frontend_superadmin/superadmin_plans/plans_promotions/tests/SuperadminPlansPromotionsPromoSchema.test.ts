// RESPONSIBILITY: Define source-level test coverage for plans promotions using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_plans/plans_promotions/tests/SuperadminPlansPromotionsPromoSchema.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SuperadminBillingPromoSchema } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/schemas/SuperadminPlansPromotionsPromoSchema';

const baseValues = { code: 'diwali50', discount: '20%', expiry: '2027-12-31', maxUses: 100 };

describe('plans promotions promo schema', () => {
  it('normalizes codes to uppercase before previewing', () => {
    expect(SuperadminBillingPromoSchema.parse(baseValues).code).toBe('DIWALI50');
  });
  it.each(['20%', '20.5%', '999 Flat', '12.50 flat'])('accepts valid discount value %s', (discount) => {
    expect(SuperadminBillingPromoSchema.safeParse({ ...baseValues, discount }).success).toBe(true);
  });
  it.each(['abc', '101%', '0%', '-5%', '999 flat per month', '0 Flat', '25.999%'])('rejects invalid discount value %s', (discount) => {
    expect(SuperadminBillingPromoSchema.safeParse({ ...baseValues, discount }).success).toBe(false);
  });
});
