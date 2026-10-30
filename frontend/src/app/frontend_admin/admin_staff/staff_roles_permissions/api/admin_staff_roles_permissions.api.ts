import type { AdminStaffRolesPermissionsModule } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/types/AdminStaffRolesPermissionsTypes';

/** Explicit external-contract guard: the supplied source contains no verified permission API endpoint. */
export async function fetchAdminStaffRolesPermissions(): Promise<AdminStaffRolesPermissionsModule[]> {
  throw new Error('CONTRACT_MISSING: No verified backend API endpoint is supplied for staff role permissions.');
}

// Feature-scoped TanStack Query cache keys belong to this entity-family API contract.
/** Feature-scoped TanStack Query keys for admin_staff_roles_permissions. Keep server-state cache ownership inside this feature. */

