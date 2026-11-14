// RESPONSIBILITY: Define compile-time types for subscriptions member subscriptions; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_subscriptions/subscriptions_member_subscriptions/types/SuperadminSubscriptionsOverviewMemberSubscriptionsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSubscriptionsOverviewMemberSubscriptionsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
