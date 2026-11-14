// RESPONSIBILITY: Render the route loading state for billing member refunds; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_billing/billing_member_refunds/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminBillingOverviewMemberRefundsRouteSkeleton from './components/SuperadminBillingOverviewMemberRefundsRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminBillingOverviewMemberRefundsRouteSkeleton />;
}
