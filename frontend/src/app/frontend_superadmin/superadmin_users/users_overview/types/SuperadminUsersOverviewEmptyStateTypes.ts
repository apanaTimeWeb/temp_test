// RESPONSIBILITY: Define compile-time types for users overview; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_users/users_overview/types/SuperadminUsersOverviewEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminUsersOverviewEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
