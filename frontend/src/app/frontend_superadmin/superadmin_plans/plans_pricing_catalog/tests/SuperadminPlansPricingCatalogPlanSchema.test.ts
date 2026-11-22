// RESPONSIBILITY: Exercise every maximum bound in the canonical plans-pricing-catalog plan schema.
// FLOW: Vitest -> canonical plan schema -> accepted boundary and rejected over-bound values.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/schemas/SuperadminPlansPricingCatalogPlanSchema';

const validPlan = { name: 'Starter', price: 999, branches: 1, members: 150, storage: '1GB' };

describe('canonical subscription plan schema upper bounds', () => {
  it('accepts a 60-character plan name and rejects 61 characters', () => {
    expect(SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA.safeParse({ ...validPlan, name: 'N'.repeat(60) }).success).toBe(true);
    expect(SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA.safeParse({ ...validPlan, name: 'N'.repeat(61) }).success).toBe(false);
  });

  it('accepts the maximum price and rejects a value above it', () => {
    expect(SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA.safeParse({ ...validPlan, price: 1_000_000 }).success).toBe(true);
    expect(SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA.safeParse({ ...validPlan, price: 1_000_001 }).success).toBe(false);
  });

  it('accepts 10,000 branches and rejects 10,001', () => {
    expect(SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA.safeParse({ ...validPlan, branches: 10_000 }).success).toBe(true);
    expect(SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA.safeParse({ ...validPlan, branches: 10_001 }).success).toBe(false);
  });

  it('accepts 10,000,000 members and rejects 10,000,001', () => {
    expect(SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA.safeParse({ ...validPlan, members: 10_000_000 }).success).toBe(true);
    expect(SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA.safeParse({ ...validPlan, members: 10_000_001 }).success).toBe(false);
  });

  it('accepts 40 storage characters and rejects 41', () => {
    expect(SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA.safeParse({ ...validPlan, storage: 'S'.repeat(40) }).success).toBe(true);
    expect(SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA.safeParse({ ...validPlan, storage: 'S'.repeat(41) }).success).toBe(false);
  });
});
