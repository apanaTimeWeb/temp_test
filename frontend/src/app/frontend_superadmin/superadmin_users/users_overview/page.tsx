import { notFound, redirect } from 'next/navigation';
// RESPONSIBILITY: Resolve the canonical users_overview route and dispatch internal workflow views without creating sibling route modules.
// FLOW: Canonical URL -> query view dispatcher -> owner-local workflow navigation -> selected screen -> leaf components/hooks.
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminUsersOverviewScreen from '@/app/frontend_superadmin/superadmin_users/users_overview/components/SuperadminUsersOverviewScreen';
import SuperadminUsersOverviewWorkflowNavigation from '@/app/frontend_superadmin/superadmin_users/users_overview/components/SuperadminUsersOverviewWorkflowNavigation';



type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

/**
 * Resolves the canonical route for users overview and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function UsersOverviewRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const view = firstValue(query.view);
  const tCopy = await getTranslations('SUPERADMIN_FINANCE');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  if (view === "member_referrals") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_users/users_member_referrals" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "member_trust_score") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_users/users_member_trust_score" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view && !['member_referrals', 'member_trust_score'].includes(view)) notFound();
  return (
    <div className="min-w-0" data-feature-module="superadmin_users" data-feature-route="users_overview">
      <SuperadminUsersOverviewWorkflowNavigation currentView={view} />
      <Suspense fallback={fallback}>
        <SuperadminUsersOverviewScreen id={id} />
      </Suspense>
    </div>
  );
}
