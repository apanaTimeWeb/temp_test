// RESPONSIBILITY: Render the route loading state for billing invoices; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_billing/billing_invoices/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminBillingInvoicesListSkeleton from './components/SuperadminBillingInvoicesListSkeleton';

/**
 * Performs the module loading operation within billing invoices; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminBillingInvoicesListSkeleton />;
}
