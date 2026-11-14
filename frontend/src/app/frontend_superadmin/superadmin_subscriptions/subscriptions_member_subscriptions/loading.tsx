// RESPONSIBILITY: Render the route loading state for subscriptions member subscriptions; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_subscriptions/subscriptions_member_subscriptions/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminSubscriptionsOverviewMemberSubscriptionsRouteSkeleton from './components/SuperadminSubscriptionsOverviewMemberSubscriptionsRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminSubscriptionsOverviewMemberSubscriptionsRouteSkeleton />;
}
