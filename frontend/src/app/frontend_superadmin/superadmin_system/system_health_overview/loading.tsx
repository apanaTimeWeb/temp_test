// RESPONSIBILITY: Render the route loading state for system health overview; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_system/system_health_overview/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSystemHealthOverviewListSkeleton from './components/SuperadminSystemHealthOverviewListSkeleton';

/**
 * Performs the module loading operation within system health overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSystemHealthOverviewListSkeleton />;
}
