// RESPONSIBILITY: Render the route loading state for libraries library capacity analysis; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_library_capacity_analysis/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminLibrariesOverviewLibraryCapacityAnalysisRouteSkeleton from './components/SuperadminLibrariesOverviewLibraryCapacityAnalysisRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminLibrariesOverviewLibraryCapacityAnalysisRouteSkeleton />;
}
