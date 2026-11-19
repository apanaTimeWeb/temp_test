import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminLibrariesOverviewScreen from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewScreen';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

export default async function LibrariesOverviewRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const view = firstValue(query.view);
  const tCopy = await getTranslations('SUPERADMIN_LIBRARIES');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;

  // Canonical workflow views dispatch
  if (view === 'facility_asset_maintenance' ||
      view === 'facility_asset_registry' ||
      view === 'facility_maintenance_work_orders' ||
      view === 'facility_power_management' ||
      view === 'library_capacity_analysis' ||
      view === 'library_capacity_gap_filling' ||
      view === 'library_capacity_scaling_recommendations' ||
      view === 'library_offline_operations' ||
      view === 'library_shift_gap_analysis' ||
      view === 'library_waitlist_automation') {
    // Route dispatches into the unified overview screen with view parameter
  }

  return (
    <div className="min-w-0" data-feature-module="superadmin_libraries" data-feature-route="libraries_overview">
      <Suspense fallback={fallback}>
        <SuperadminLibrariesOverviewScreen id={id} />
      </Suspense>
    </div>
  );
}
