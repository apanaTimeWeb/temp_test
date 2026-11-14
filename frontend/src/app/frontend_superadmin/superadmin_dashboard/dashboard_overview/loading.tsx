// RESPONSIBILITY: Render the route loading state for dashboard overview; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_dashboard/dashboard_overview/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminDashboardOverviewListSkeleton from './components/SuperadminDashboardOverviewListSkeleton';

/**
 * Performs the module loading operation within dashboard overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminDashboardOverviewListSkeleton />;
}
