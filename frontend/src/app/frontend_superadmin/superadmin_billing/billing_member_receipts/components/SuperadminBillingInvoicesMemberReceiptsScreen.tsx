/** Responsibility: Route adapter for the member_receipts screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBillingInvoicesMemberReceiptsScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `receipt` inside the member_receipts autonomous module. */
import SuperadminBillingInvoicesMemberReceiptsPageClient from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/components/SuperadminBillingInvoicesMemberReceiptsPageClient';

/**
 * Composes the billing invoices screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBillingInvoicesMemberReceiptsScreen({ id }: { id?: string }) {
  return <SuperadminBillingInvoicesMemberReceiptsPageClient />;
}
