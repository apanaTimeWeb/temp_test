// RESPONSIBILITY: Render the route loading state for libraries facility power management; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_facility_power_management/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton from './components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton />;
}
