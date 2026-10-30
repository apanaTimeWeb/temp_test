import { apiFetch } from '@/lib/api';
import { parseApiResponseData } from '@/lib/apiSchema';
import { ADMIN_STAFF_DIRECTORY_API } from '@/app/frontend_admin/admin_staff/staff_directory/config/admin_staff_directory.url_config';
import type { AdminStaffDirectoryManager } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import { AdminStaffDirectoryApiResponseSchema } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';

/** Typed feature-owned transport boundary. Exact backend fields are constrained by the current supplied frontend scope. */
export async function fetchAdminStaffDirectory(): Promise<AdminStaffDirectoryManager[]> {
  const payload = parseApiResponseData(await apiFetch<unknown>(ADMIN_STAFF_DIRECTORY_API.LIST), AdminStaffDirectoryApiResponseSchema);
  return payload.map((manager) => ({ ...manager, id: String(manager.id) }));
}

// Feature-scoped TanStack Query cache keys belong to this entity-family API contract.
/** Feature-scoped TanStack Query keys for admin_staff_directory. Keep server-state cache ownership inside this feature. */

