// RESPONSIBILITY: Render the route loading state for libraries facility maintenance work orders; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_facility_maintenance_work_orders/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton from './components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton />;
}
