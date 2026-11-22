// RESPONSIBILITY: Adapt the canonical route for analytics financials to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_analytics/analytics_financials/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route for the Financials workflow. */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminAnalyticsFinancialsScreen from '@/app/frontend_superadmin/superadmin_analytics/analytics_financials/components/SuperadminAnalyticsFinancialsScreen.tsx';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
/**
 * Resolves the canonical route for analytics financials and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminReportsFinancialsRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations("SUPERADMIN_REPORTS");
  return <div className="min-w-0" data-feature-module="superadmin_analytics" data-feature-route="analytics_financials">
    <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
      <SuperadminAnalyticsFinancialsScreen id={id} />
    </Suspense>
  </div>;
}
