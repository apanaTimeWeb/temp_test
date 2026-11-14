// RESPONSIBILITY: Render the route loading state for subscriptions member auto suspend policy; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_subscriptions/subscriptions_member_auto_suspend_policy/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyRouteSkeleton from './components/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyRouteSkeleton />;
}
