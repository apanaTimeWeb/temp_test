// RESPONSIBILITY: Define compile-time types for users member referrals; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_users/users_member_referrals/types/SuperadminUsersOverviewMemberReferralsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminUsersOverviewMemberReferralsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
