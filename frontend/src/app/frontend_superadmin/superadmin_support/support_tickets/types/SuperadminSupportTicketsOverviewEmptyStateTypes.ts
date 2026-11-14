// RESPONSIBILITY: Define compile-time types for support tickets; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSupportTicketsOverviewEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
