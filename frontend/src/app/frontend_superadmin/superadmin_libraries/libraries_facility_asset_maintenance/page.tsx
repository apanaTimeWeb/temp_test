// RESPONSIBILITY: Canonical route adapter for the autonomous facility_asset_maintenance workflow.
// FLOW: canonical leaf URL -> standard Suspense fallback -> existing workflow Screen component.
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminLibrariesOverviewFacilityAssetMaintenanceScreen from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/components/SuperadminLibrariesOverviewFacilityAssetMaintenanceScreen';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

/** Renders the leaf-owned route; the original parent query-view dispatcher remains as a compatibility path. */
export default async function FacilityAssetMaintenanceRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations('SUPERADMIN_SETUP_WIZARD');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  return (
    <div className="min-w-0" data-feature-module="superadmin_libraries" data-feature-route="libraries_facility_asset_maintenance">
      <Suspense fallback={fallback}>
        <SuperadminLibrariesOverviewFacilityAssetMaintenanceScreen id={id} />
      </Suspense>
    </div>
  );
}
