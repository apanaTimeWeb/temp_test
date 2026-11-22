// RESPONSIBILITY: Define compile-time types for dashboard overview; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminDashboardOverviewEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
