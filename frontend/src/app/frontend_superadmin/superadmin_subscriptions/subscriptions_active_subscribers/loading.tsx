// RESPONSIBILITY: Render the route loading state for subscriptions active subscribers; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_subscriptions/subscriptions_active_subscribers/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSubscriptionsActiveSubscribersListSkeleton from './components/SuperadminSubscriptionsActiveSubscribersListSkeleton';

/**
 * Performs the module loading operation within subscriptions active subscribers; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSubscriptionsActiveSubscribersListSkeleton />;
}
