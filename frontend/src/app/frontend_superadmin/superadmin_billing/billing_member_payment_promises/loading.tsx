// RESPONSIBILITY: Render the route loading state for billing member payment promises; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_billing/billing_member_payment_promises/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminBillingOverviewMemberPaymentPromisesRouteSkeleton from './components/SuperadminBillingOverviewMemberPaymentPromisesRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminBillingOverviewMemberPaymentPromisesRouteSkeleton />;
}
