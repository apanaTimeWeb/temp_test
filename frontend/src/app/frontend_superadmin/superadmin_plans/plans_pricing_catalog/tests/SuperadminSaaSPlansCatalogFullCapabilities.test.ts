// RESPONSIBILITY: Validate full SaaS Plan Management capabilities per SuperAdmin specification.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SUBSCRIPTIONS_SAMPLE_PLANS } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/mocks/fixtures/SuperadminPlansPricingCatalogMockFixtures';
import { SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/schemas/SuperadminPlansPricingCatalogPlanSchema';

describe('Superadmin SaaS Plans Catalog Full Capabilities Suite', () => {
  it('supplies Starter tier with 1 branch limit, core limits, and standard support', () => {
    const starter = SUPERADMIN_SUBSCRIPTIONS_SAMPLE_PLANS.find((p) => p.name.toLowerCase().includes('starter'));
    expect(starter).toBeDefined();
    expect(starter?.branches).toBe(1);
    expect(starter?.supportLevel).toBe('Standard');
    expect(starter?.freeTrial).toBe(true);
    expect(starter?.storage).toBe('5 GB');
  });

  it('supplies Professional tier with 3 branches limit and priority support', () => {
    const pro = SUPERADMIN_SUBSCRIPTIONS_SAMPLE_PLANS.find((p) => p.name.toLowerCase().includes('pro'));
    expect(pro).toBeDefined();
    expect(pro?.branches).toBe(3);
    expect(pro?.isPopular).toBe(true);
    expect(pro?.supportLevel).toBe('Priority');
    expect(pro?.advancedReports).toBe(true);
  });

  it('supplies Enterprise tier with scaled custom branches, API access, and 24/7 support', () => {
    const ent = SUPERADMIN_SUBSCRIPTIONS_SAMPLE_PLANS.find((p) => p.name.toLowerCase().includes('enterprise'));
    expect(ent).toBeDefined();
    expect(ent?.branches).toBeGreaterThanOrEqual(10);
    expect(ent?.apiAccess).toBe(true);
    expect(ent?.supportLevel).toBe('Dedicated 24/7');
    expect(ent?.backupPolicy).toBe('Realtime');
  });

  it('validates schema with all configurable fields: pricing, quotas, features, and policies', () => {
    const validPlan = {
      name: 'Custom SaaS Plan',
      price: 1499,
      priceHalfYearly: 8094,
      priceAnnual: 14990,
      branches: 2,
      members: 750,
      storage: '20 GB',
      adminUsers: 3,
      staffUsers: 10,
      smsCredits: 2000,
      whatsappCredits: 800,
      apiAccess: true,
      exportAccess: true,
      advancedReports: true,
      backupPolicy: 'Daily' as const,
      supportLevel: 'Priority' as const,
      freeTrial: true,
      trialDays: 14,
      tierType: 'Professional' as const,
    };
    const parsed = SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA.safeParse(validPlan);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid plan pricing <= 0', () => {
    const invalidPlan = {
      name: 'Bad Plan',
      price: -100,
      branches: 1,
      members: 100,
    };
    const parsed = SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA.safeParse(invalidPlan);
    expect(parsed.success).toBe(false);
  });
});
