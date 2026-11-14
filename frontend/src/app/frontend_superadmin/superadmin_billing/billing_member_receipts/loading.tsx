// RESPONSIBILITY: Render the route loading state for billing member receipts; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_billing/billing_member_receipts/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminBillingInvoicesMemberReceiptsRouteSkeleton from './components/SuperadminBillingInvoicesMemberReceiptsRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminBillingInvoicesMemberReceiptsRouteSkeleton />;
}
