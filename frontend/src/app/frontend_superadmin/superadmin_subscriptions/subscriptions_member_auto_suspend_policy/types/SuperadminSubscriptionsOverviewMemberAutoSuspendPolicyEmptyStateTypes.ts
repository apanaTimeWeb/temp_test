// RESPONSIBILITY: Define compile-time types for subscriptions member auto suspend policy; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_subscriptions/subscriptions_member_auto_suspend_policy/types/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
