// RESPONSIBILITY: Define compile-time types for subscriptions active subscribers; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_subscriptions/subscriptions_active_subscribers/types/SuperadminSubscriptionsActiveSubscribersEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSubscriptionsActiveSubscribersEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
