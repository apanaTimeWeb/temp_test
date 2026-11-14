// RESPONSIBILITY: Render the route loading state for libraries library offline operations; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_library_offline_operations/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminLibrariesOverviewLibraryOfflineOperationsRouteSkeleton from './components/SuperadminLibrariesOverviewLibraryOfflineOperationsRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminLibrariesOverviewLibraryOfflineOperationsRouteSkeleton />;
}
