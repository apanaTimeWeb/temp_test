// RESPONSIBILITY: Define compile-time types for users directory; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_users/users_directory/types/SuperadminUsersDirectoryEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminUsersDirectoryEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
