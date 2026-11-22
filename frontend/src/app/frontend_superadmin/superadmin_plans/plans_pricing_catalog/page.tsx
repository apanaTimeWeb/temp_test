// RESPONSIBILITY: Adapt the canonical route for plans pricing catalog to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_plans/plans_pricing_catalog/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route for the SaaS Pricing Plans workflow. */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminPlansPricingCatalogScreen from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/components/SuperadminPlansPricingCatalogScreen.tsx';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
/**
 * Resolves the canonical route for plans pricing catalog and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminSubscriptionsPricingPlansRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations("SUPERADMIN_SUBSCRIPTIONS");
  return <div className="min-w-0" data-feature-module="superadmin_plans" data-feature-route="plans_pricing_catalog">
    <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
      <SuperadminPlansPricingCatalogScreen id={id} />
    </Suspense>
  </div>;
}
