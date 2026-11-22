// RESPONSIBILITY: Define compile-time types for analytics library growth; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_analytics/analytics_library_growth/types/SuperadminAnalyticsLibraryGrowthEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminAnalyticsLibraryGrowthEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
