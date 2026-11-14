// RESPONSIBILITY: Define compile-time types for subscriptions overview; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_subscriptions/subscriptions_overview/types/SuperadminSubscriptionsOverviewEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSubscriptionsOverviewEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
