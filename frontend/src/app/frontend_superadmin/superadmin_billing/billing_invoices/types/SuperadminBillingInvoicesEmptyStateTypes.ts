// RESPONSIBILITY: Define compile-time types for billing invoices; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminBillingInvoicesEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
