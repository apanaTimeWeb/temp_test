// RESPONSIBILITY: Render the route loading state for libraries facility asset maintenance; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_facility_asset_maintenance/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminLibrariesOverviewFacilityAssetMaintenanceRouteSkeleton from './components/SuperadminLibrariesOverviewFacilityAssetMaintenanceRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminLibrariesOverviewFacilityAssetMaintenanceRouteSkeleton />;
}
