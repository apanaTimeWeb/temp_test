// RESPONSIBILITY: Render the route loading state for analytics library growth; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_analytics/analytics_library_growth/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminAnalyticsLibraryGrowthListSkeleton from './components/SuperadminAnalyticsLibraryGrowthListSkeleton';

/**
 * Performs the module loading operation within analytics library growth; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminAnalyticsLibraryGrowthListSkeleton />;
}
