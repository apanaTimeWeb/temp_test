// RESPONSIBILITY: Define compile-time types for billing overview; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_billing/billing_overview/types/SuperadminBillingOverviewEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminBillingOverviewEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
