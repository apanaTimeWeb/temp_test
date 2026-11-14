// FLOW: Feature source -> superadmin_users/users_roles_permissions/types/SuperadminUsersRolesPermissionsTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: define only the read-only role-permission matrix data shape consumed by this leaf. */

export interface SuperadminRolePermissionRow {
  module: string;
  superadmin: boolean;
  admin: boolean;
  manager: boolean;
}

/** Public props for the illustrative, read-only Roles & Permissions matrix. */
export interface SuperadminUsersContentProps {
  rolePermissions: readonly SuperadminRolePermissionRow[];
}
