// RESPONSIBILITY: Define deterministic promotion-shaped local scale fixtures; these rows are synthetic UI data only.
// FLOW: Promotion UI tests -> promotion scale tiers -> the same promo card field contract used by the active list.
import type { SuperadminBillingPromoSample } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes';
import { SUPERADMIN_BILLING_SAMPLE_PROMOS } from './SuperadminPlansPromotionsSampleMockFixtures';

const sourcePromotions: readonly SuperadminBillingPromoSample[] = SUPERADMIN_BILLING_SAMPLE_PROMOS;

/** Returns independent promotion records with stable, unique local identities. */
export function createPromotionsScaleFixtureTier(count: number): SuperadminBillingPromoSample[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError('Promotion fixture tier size must be a non-negative integer.');
  }
  if (sourcePromotions.length === 0 || count === 0) return [];

  return Array.from({ length: count }, (_, index) => {
    const source = sourcePromotions[index % sourcePromotions.length];
    return {
      ...source,
      id: `scale-promo-${String(index + 1).padStart(4, '0')}`,
      code: `SCALE-${String(index + 1).padStart(4, '0')}`,
      uses: Math.min(source.uses, Math.max(source.maxUses, 1)),
      maxUses: Math.max(source.maxUses, 1),
    };
  });
}

export const MOCK_SCALE_TIER_1_SMALL: readonly SuperadminBillingPromoSample[] = Object.freeze(createPromotionsScaleFixtureTier(10));
export const MOCK_SCALE_TIER_2_STANDARD: readonly SuperadminBillingPromoSample[] = Object.freeze(createPromotionsScaleFixtureTier(100));
export const MOCK_SCALE_TIER_3_STRESS: readonly SuperadminBillingPromoSample[] = Object.freeze(createPromotionsScaleFixtureTier(500));
