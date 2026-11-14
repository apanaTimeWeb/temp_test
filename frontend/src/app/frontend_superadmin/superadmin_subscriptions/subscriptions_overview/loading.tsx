// RESPONSIBILITY: Render the route loading state for subscriptions overview; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_subscriptions/subscriptions_overview/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSubscriptionsOverviewListSkeleton from './components/SuperadminSubscriptionsOverviewListSkeleton';

/**
 * Performs the module loading operation within subscriptions overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSubscriptionsOverviewListSkeleton />;
}
