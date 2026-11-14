// RESPONSIBILITY: Render the route loading state for billing member late fees; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_billing/billing_member_late_fees/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminBillingOverviewMemberLateFeesRouteSkeleton from './components/SuperadminBillingOverviewMemberLateFeesRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminBillingOverviewMemberLateFeesRouteSkeleton />;
}
