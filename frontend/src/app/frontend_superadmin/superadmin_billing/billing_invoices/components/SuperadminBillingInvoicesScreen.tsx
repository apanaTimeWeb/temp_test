/** Responsibility: isolated route adapter for the Invoices & Transactions workflow. */
/** Data-Flow: canonical route props -> SuperadminBillingInvoicesScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminBillingInvoicesPageClient from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesPageClient.tsx';

/**
 * Composes the billing invoices screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBillingInvoicesScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminBillingInvoicesPageClient />;
}
