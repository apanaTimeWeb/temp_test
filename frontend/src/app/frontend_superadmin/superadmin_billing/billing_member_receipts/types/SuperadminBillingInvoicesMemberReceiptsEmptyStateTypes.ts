// RESPONSIBILITY: Define compile-time types for billing member receipts; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_billing/billing_member_receipts/types/SuperadminBillingInvoicesMemberReceiptsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminBillingInvoicesMemberReceiptsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
