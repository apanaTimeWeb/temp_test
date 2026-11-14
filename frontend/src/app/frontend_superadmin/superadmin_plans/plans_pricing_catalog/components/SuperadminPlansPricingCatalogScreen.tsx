/** Responsibility: isolated route adapter for the SaaS Pricing Plans workflow. */
/** Data-Flow: canonical route props -> SuperadminPlansPricingCatalogScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminPlansPricingCatalogPageClient from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/components/SuperadminPlansPricingCatalogPageClient.tsx';

/**
 * Composes the plans pricing catalog screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminPlansPricingCatalogScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminPlansPricingCatalogPageClient />;
}
