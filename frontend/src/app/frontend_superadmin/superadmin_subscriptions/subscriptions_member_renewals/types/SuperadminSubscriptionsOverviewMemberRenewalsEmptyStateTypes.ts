// RESPONSIBILITY: Define compile-time types for subscriptions member renewals; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_subscriptions/subscriptions_member_renewals/types/SuperadminSubscriptionsOverviewMemberRenewalsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSubscriptionsOverviewMemberRenewalsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
