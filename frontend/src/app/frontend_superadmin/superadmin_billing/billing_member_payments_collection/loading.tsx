// RESPONSIBILITY: Render the route loading state for billing member payments collection; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_billing/billing_member_payments_collection/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton from './components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton />;
}
