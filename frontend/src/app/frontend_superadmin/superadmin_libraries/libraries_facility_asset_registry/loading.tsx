// RESPONSIBILITY: Render the route loading state for libraries facility asset registry; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_facility_asset_registry/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton from './components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton />;
}
