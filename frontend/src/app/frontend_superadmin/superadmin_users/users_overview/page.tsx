import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminUsersOverviewScreen from '@/app/frontend_superadmin/superadmin_users/users_overview/components/SuperadminUsersOverviewScreen';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

export default async function UsersOverviewRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations('SUPERADMIN_FINANCE');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  return (
    <div className="min-w-0" data-feature-module="superadmin_users" data-feature-route="users_overview">
      <Suspense fallback={fallback}>
        <SuperadminUsersOverviewScreen id={id} />
      </Suspense>
    </div>
  );
}
