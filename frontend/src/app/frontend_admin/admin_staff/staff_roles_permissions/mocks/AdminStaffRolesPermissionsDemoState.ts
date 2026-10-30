import { AdminStaffRolesPermissionsApiResponseSchema } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/schemas/AdminStaffRolesPermissionsSchema';
import type { z } from 'zod';
import type { AdminStaffRolesPermissionsModule } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/types/AdminStaffRolesPermissionsTypes';

/** Synthetic permission matrix for deterministic API/UI tests only. */
export const ADMIN_STAFF_ROLES_PERMISSIONS_API_FIXTURE: z.infer<typeof AdminStaffRolesPermissionsApiResponseSchema> = [
  { module: 'members', actions: [{ label: 'View members', key: 'members.read', roles: { admin: true, manager: false, trainer: false } }] },
];

function clonePermissions(value: readonly AdminStaffRolesPermissionsModule[]): AdminStaffRolesPermissionsModule[] {
  return value.map((module) => ({
    ...module,
    actions: module.actions.map((action) => ({ ...action, roles: { ...action.roles } })),
  }));
}

let demoPermissions = clonePermissions(ADMIN_STAFF_ROLES_PERMISSIONS_API_FIXTURE);

/** Return an isolated view of mutable in-memory preview state. */
export function getAdminStaffRolesPermissionsDemoState(): AdminStaffRolesPermissionsModule[] {
  return clonePermissions(demoPermissions);
}

/** Commit a preview-only state transition for subsequent mounts in this browser session. */
export function saveAdminStaffRolesPermissionsDemoState(value: readonly AdminStaffRolesPermissionsModule[]): void {
  demoPermissions = clonePermissions(value);
}

/** Test-only reset; no browser storage or network state is touched. */
export function resetAdminStaffRolesPermissionsDemoState(): void {
  demoPermissions = clonePermissions(ADMIN_STAFF_ROLES_PERMISSIONS_API_FIXTURE);
}
