import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminLibrariesOverviewScreen from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewScreen';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

export default async function LibrariesOverviewRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations('SUPERADMIN_LIBRARIES');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  return (
    <div className="min-w-0" data-feature-module="superadmin_libraries" data-feature-route="libraries_overview">
      <Suspense fallback={fallback}>
        <SuperadminLibrariesOverviewScreen id={id} />
      </Suspense>
    </div>
  );
}
