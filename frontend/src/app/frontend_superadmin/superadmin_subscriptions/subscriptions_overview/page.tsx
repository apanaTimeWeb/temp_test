// RESPONSIBILITY: Resolve the canonical subscriptions_overview route.
// FLOW: Canonical URL -> SuperadminSubscriptionsOverviewScreen.
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminSubscriptionsOverviewScreen from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewScreen';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

export default async function SubscriptionsOverviewRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations('SUPERADMIN_FINANCE');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  return (
    <div className="min-w-0" data-feature-module="superadmin_subscriptions" data-feature-route="subscriptions_overview">
      <Suspense fallback={fallback}>
        <SuperadminSubscriptionsOverviewScreen id={id} />
      </Suspense>
    </div>
  );
}
