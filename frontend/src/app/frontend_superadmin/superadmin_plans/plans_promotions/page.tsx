// RESPONSIBILITY: Adapt the canonical route for plans promotions to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_plans/plans_promotions/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route for the Promo Codes & Offers workflow. */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminPlansPromotionsScreen from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/components/SuperadminPlansPromotionsScreen.tsx';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
/**
 * Resolves the canonical route for plans promotions and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminBillingPromoCodesRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations("SUPERADMIN_BILLING");
  return <div className="min-w-0" data-feature-module="superadmin_plans" data-feature-route="plans_promotions">
    <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
      <SuperadminPlansPromotionsScreen id={id} />
    </Suspense>
  </div>;
}
