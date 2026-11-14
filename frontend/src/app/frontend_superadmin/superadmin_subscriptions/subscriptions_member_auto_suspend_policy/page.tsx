// RESPONSIBILITY: Canonical route adapter for the autonomous member_auto_suspend_policy workflow.
// FLOW: canonical leaf URL -> standard Suspense fallback -> existing workflow Screen component.
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyScreen from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_auto_suspend_policy/components/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyScreen';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

/** Renders the leaf-owned route; the original parent query-view dispatcher remains as a compatibility path. */
export default async function MemberAutoSuspendPolicyRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations('SUPERADMIN_FINANCE');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  return (
    <div className="min-w-0" data-feature-module="superadmin_subscriptions" data-feature-route="subscriptions_member_auto_suspend_policy">
      <Suspense fallback={fallback}>
        <SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyScreen id={id} />
      </Suspense>
    </div>
  );
}
