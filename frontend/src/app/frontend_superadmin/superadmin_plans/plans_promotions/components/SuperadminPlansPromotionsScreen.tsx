/** Responsibility: isolated route adapter for the Promo Codes & Offers workflow. */
/** Data-Flow: canonical route props -> SuperadminPlansPromotionsScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminPlansPromotionsPageClient from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/components/SuperadminPlansPromotionsPageClient.tsx';

/**
 * Composes the plans promotions screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminPlansPromotionsScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminPlansPromotionsPageClient />;
}
