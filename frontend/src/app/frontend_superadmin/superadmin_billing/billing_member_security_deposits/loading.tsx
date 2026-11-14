// RESPONSIBILITY: Render the route loading state for billing member security deposits; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_billing/billing_member_security_deposits/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminBillingOverviewMemberSecurityDepositsRouteSkeleton from './components/SuperadminBillingOverviewMemberSecurityDepositsRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminBillingOverviewMemberSecurityDepositsRouteSkeleton />;
}
