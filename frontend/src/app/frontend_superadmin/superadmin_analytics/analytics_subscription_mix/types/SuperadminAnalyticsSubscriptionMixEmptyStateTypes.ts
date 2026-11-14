// RESPONSIBILITY: Define compile-time types for analytics subscription mix; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_analytics/analytics_subscription_mix/types/SuperadminAnalyticsSubscriptionMixEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminAnalyticsSubscriptionMixEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
