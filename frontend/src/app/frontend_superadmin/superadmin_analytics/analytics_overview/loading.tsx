// RESPONSIBILITY: Render the route loading state for analytics overview; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_analytics/analytics_overview/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminAnalyticsOverviewListSkeleton from './components/SuperadminAnalyticsOverviewListSkeleton';

/**
 * Performs the module loading operation within analytics overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminAnalyticsOverviewListSkeleton />;
}
