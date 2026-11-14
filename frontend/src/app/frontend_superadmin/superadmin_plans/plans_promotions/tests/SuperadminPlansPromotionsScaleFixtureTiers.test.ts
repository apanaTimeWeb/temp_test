// RESPONSIBILITY: Define source-level test coverage for promotion-shaped local scale fixtures; execution is host-runtime dependent.
// FLOW: Test runner -> module-owned promotion fixture tiers -> promo-card shape and immutability assertions.
import { describe, expect, it } from 'vitest';
import {
  createPromotionsScaleFixtureTier,
  MOCK_SCALE_TIER_1_SMALL,
  MOCK_SCALE_TIER_2_STANDARD,
  MOCK_SCALE_TIER_3_STRESS,
} from '../mocks/fixtures/superadmin_plans_promotions.scale-stress-fixtures';
import { SUPERADMIN_BILLING_SAMPLE_PROMOS } from '../mocks/fixtures/SuperadminPlansPromotionsSampleMockFixtures';
import type { SuperadminBillingPromoSample } from '../types/SuperadminPlansPromotionsTypes';
import { readFileSync } from 'node:fs';

const PAGE_CLIENT = new URL('../components/SuperadminPlansPromotionsPageClient.tsx', import.meta.url);

function assertPromotionCardShape(promo: SuperadminBillingPromoSample) {
  expect(typeof promo.id).toBe('string');
  expect(typeof promo.code).toBe('string');
  expect(typeof promo.discount).toBe('string');
  expect(typeof promo.expiry).toBe('string');
  expect(Number.isFinite(promo.uses)).toBe(true);
  expect(Number.isFinite(promo.maxUses)).toBe(true);
  expect(promo.uses).toBeGreaterThanOrEqual(0);
  expect(promo.uses).toBeLessThanOrEqual(promo.maxUses);
  expect(['Active', 'Expired']).toContain(promo.status);
}

describe('plans_promotions deterministic scale fixture tiers', () => {
  it('provides promotion-shaped 10, 100, and 500 record tiers', () => {
    expect(MOCK_SCALE_TIER_1_SMALL).toHaveLength(10);
    expect(MOCK_SCALE_TIER_2_STANDARD).toHaveLength(100);
    expect(MOCK_SCALE_TIER_3_STRESS).toHaveLength(500);
    for (const tier of [MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS]) {
      expect(new Set(tier.map((promo) => promo.id)).size).toBe(tier.length);
      tier.forEach(assertPromotionCardShape);
    }
  });

  it('derives scale rows from promotion fixtures without mutating their source records', () => {
    const sourceSnapshot = JSON.stringify(SUPERADMIN_BILLING_SAMPLE_PROMOS);
    const derived = createPromotionsScaleFixtureTier(1);
    derived[0].code = 'MUTATED_DERIVED_ROW';
    expect(JSON.stringify(SUPERADMIN_BILLING_SAMPLE_PROMOS)).toBe(sourceSnapshot);
    expect(MOCK_SCALE_TIER_3_STRESS[0].code).toBe('SCALE-0001');
  });

  it('keeps the stress tier compatible with the active promotion card list contract', () => {
    const page = readFileSync(PAGE_CLIENT, 'utf8');
    expect(page).toContain('promos.map(p => (');
    for (const field of ['p.code', 'p.discountAmountMinor', 'p.discountCurrencyCode', 'p.expiry', 'p.uses', 'p.maxUses', 'p.status']) {
      expect(page).toContain(field);
    }
  });
});
