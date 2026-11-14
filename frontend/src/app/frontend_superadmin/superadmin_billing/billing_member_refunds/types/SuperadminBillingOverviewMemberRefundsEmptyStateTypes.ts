// RESPONSIBILITY: Define compile-time types for billing member refunds; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_billing/billing_member_refunds/types/SuperadminBillingOverviewMemberRefundsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminBillingOverviewMemberRefundsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
