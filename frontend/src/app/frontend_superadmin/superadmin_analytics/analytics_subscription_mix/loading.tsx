// RESPONSIBILITY: Render the route loading state for analytics subscription mix; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_analytics/analytics_subscription_mix/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminAnalyticsSubscriptionMixListSkeleton from './components/SuperadminAnalyticsSubscriptionMixListSkeleton';

/**
 * Performs the module loading operation within analytics subscription mix; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminAnalyticsSubscriptionMixListSkeleton />;
}
