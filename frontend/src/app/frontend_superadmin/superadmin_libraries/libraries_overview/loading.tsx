// RESPONSIBILITY: Render the route loading state for libraries overview; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_overview/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminLibrariesOverviewListSkeleton from './components/SuperadminLibrariesOverviewListSkeleton';

/**
 * Performs the module loading operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminLibrariesOverviewListSkeleton />;
}
