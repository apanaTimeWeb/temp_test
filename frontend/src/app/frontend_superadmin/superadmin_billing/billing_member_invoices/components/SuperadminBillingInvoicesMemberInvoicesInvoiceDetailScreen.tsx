/** Responsibility: Route adapter for the member_invoice_detail screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBillingInvoicesMemberInvoicesInvoiceDetailScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `invoice_detail` inside the member_invoice_detail autonomous module. */
import SuperadminBillingInvoicesMemberInvoicesInvoiceDetailPageClient from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailPageClient';

/**
 * Composes the billing invoices screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBillingInvoicesMemberInvoicesInvoiceDetailScreen({ id }: { id?: string }) {
  return <SuperadminBillingInvoicesMemberInvoicesInvoiceDetailPageClient id={id ?? ''} />;
}
