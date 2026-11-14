/** Responsibility: Route adapter for the member_invoices screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBillingInvoicesMemberInvoicesScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `invoice` inside the member_invoices autonomous module. */
import SuperadminBillingInvoicesMemberInvoicesPageClient from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/components/SuperadminBillingInvoicesMemberInvoicesPageClient';

/**
 * Composes the billing invoices screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBillingInvoicesMemberInvoicesScreen({ id }: { id?: string }) {
  return <SuperadminBillingInvoicesMemberInvoicesPageClient />;
}
