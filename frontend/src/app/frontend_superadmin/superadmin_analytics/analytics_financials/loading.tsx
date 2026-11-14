// RESPONSIBILITY: Render the route loading state for analytics financials; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_analytics/analytics_financials/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminAnalyticsFinancialsListSkeleton from './components/SuperadminAnalyticsFinancialsListSkeleton';

/**
 * Performs the module loading operation within analytics financials; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminAnalyticsFinancialsListSkeleton />;
}
