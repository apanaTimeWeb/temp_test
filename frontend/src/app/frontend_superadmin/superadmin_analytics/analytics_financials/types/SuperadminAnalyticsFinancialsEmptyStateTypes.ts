// RESPONSIBILITY: Define compile-time types for analytics financials; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_analytics/analytics_financials/types/SuperadminAnalyticsFinancialsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminAnalyticsFinancialsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
