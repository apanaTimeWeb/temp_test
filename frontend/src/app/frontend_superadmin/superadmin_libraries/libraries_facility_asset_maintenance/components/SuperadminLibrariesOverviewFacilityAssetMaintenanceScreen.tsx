/** Responsibility: Route adapter for the facility_asset_maintenance screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOverviewFacilityAssetMaintenanceScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `asset_maintenance` inside the facility_asset_maintenance autonomous module. */
import SuperadminAccountingAssetMaintenancePageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/components/SuperadminLibrariesOverviewFacilityAssetMaintenancePageClient';

/**
 * Composes the libraries overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOverviewFacilityAssetMaintenanceScreen({ id }: { id?: string }) {
  return <SuperadminAccountingAssetMaintenancePageClient />;
}
