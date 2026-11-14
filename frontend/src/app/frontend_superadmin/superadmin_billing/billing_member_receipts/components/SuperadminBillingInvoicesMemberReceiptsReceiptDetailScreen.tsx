/** Responsibility: Route adapter for the member_receipt_detail screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBillingInvoicesMemberReceiptsReceiptDetailScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `receipt_detail` inside the member_receipt_detail autonomous module. */
import SuperadminBillingInvoicesMemberReceiptsReceiptDetailPageClient from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/components/SuperadminBillingInvoicesMemberReceiptsReceiptDetailPageClient';

/**
 * Composes the billing invoices screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBillingInvoicesMemberReceiptsReceiptDetailScreen({ id }: { id?: string }) {
  return <SuperadminBillingInvoicesMemberReceiptsReceiptDetailPageClient id={id ?? ''} />;
}
