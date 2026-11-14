// RESPONSIBILITY: Render the route loading state for libraries library capacity gap filling; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_library_capacity_gap_filling/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton from './components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton />;
}
