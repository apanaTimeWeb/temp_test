// RESPONSIBILITY: Render the route loading state for billing member invoices; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_billing/billing_member_invoices/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton from './components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton />;
}
