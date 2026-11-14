// RESPONSIBILITY: Render the route loading state for subscriptions member renewals; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_subscriptions/subscriptions_member_renewals/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton from './components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton />;
}
