// RESPONSIBILITY: Render the route loading state for libraries library waitlist automation; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_library_waitlist_automation/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton from './components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton />;
}
