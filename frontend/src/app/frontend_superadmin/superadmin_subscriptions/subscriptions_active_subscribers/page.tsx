// RESPONSIBILITY: Adapt the canonical route for subscriptions active subscribers to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_subscriptions/subscriptions_active_subscribers/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route for the Active Subscribers workflow. */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminSubscriptionsActiveSubscribersScreen from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/components/SuperadminSubscriptionsActiveSubscribersScreen.tsx';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
/**
 * Resolves the canonical route for subscriptions active subscribers and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminSubscriptionsActiveSubscribersRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations("SUPERADMIN_SUBSCRIPTIONS");
  return <div className="min-w-0" data-feature-module="superadmin_subscriptions" data-feature-route="subscriptions_active_subscribers">
    <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
      <SuperadminSubscriptionsActiveSubscribersScreen id={id} />
    </Suspense>
  </div>;
}
