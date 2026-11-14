import { notFound, redirect } from 'next/navigation';
// RESPONSIBILITY: Resolve the canonical subscriptions_overview route and dispatch internal workflow views without creating sibling route modules.
// FLOW: Canonical URL -> query view dispatcher -> owner-local workflow navigation -> selected screen -> leaf components/hooks.
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminSubscriptionsOverviewScreen from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewScreen';
import SuperadminSubscriptionsOverviewWorkflowNavigation from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewWorkflowNavigation';




type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

/**
 * Resolves the canonical route for subscriptions overview and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SubscriptionsOverviewRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const view = firstValue(query.view);
  const tCopy = await getTranslations('SUPERADMIN_FINANCE');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  if (view === "member_auto_suspend_policy") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_subscriptions/subscriptions_member_auto_suspend_policy" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "member_renewals") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_subscriptions/subscriptions_member_renewals" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "member_subscriptions") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_subscriptions/subscriptions_member_subscriptions" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view && !['member_auto_suspend_policy', 'member_renewals', 'member_subscriptions'].includes(view)) notFound();
  return (
    <div className="min-w-0" data-feature-module="superadmin_subscriptions" data-feature-route="subscriptions_overview">
      <SuperadminSubscriptionsOverviewWorkflowNavigation currentView={view} />
      <Suspense fallback={fallback}>
        <SuperadminSubscriptionsOverviewScreen id={id} />
      </Suspense>
    </div>
  );
}
