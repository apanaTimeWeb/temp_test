// RESPONSIBILITY: Render the route loading state for billing member payments; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_billing/billing_member_payments/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminBillingOverviewMemberPaymentsRouteSkeleton from './components/SuperadminBillingOverviewMemberPaymentsRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminBillingOverviewMemberPaymentsRouteSkeleton />;
}
