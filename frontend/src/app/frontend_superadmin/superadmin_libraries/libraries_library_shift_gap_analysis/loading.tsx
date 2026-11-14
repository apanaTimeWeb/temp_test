// RESPONSIBILITY: Render the route loading state for libraries library shift gap analysis; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_library_shift_gap_analysis/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminLibrariesOverviewLibraryShiftGapAnalysisRouteSkeleton from './components/SuperadminLibrariesOverviewLibraryShiftGapAnalysisRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminLibrariesOverviewLibraryShiftGapAnalysisRouteSkeleton />;
}
