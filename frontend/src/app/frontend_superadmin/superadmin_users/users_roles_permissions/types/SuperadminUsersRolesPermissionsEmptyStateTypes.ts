// RESPONSIBILITY: Define compile-time types for users roles permissions; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_users/users_roles_permissions/types/SuperadminUsersRolesPermissionsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminUsersRolesPermissionsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
