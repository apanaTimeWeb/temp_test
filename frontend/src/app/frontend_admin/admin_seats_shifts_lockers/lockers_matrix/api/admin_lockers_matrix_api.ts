import { apiFetch } from "@/app/frontend_admin/lib/api";
import { parseApiResponseData } from "@/app/frontend_admin/lib/apiSchema";
import { ADMIN_LOCKERS_URLS } from "@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/config/admin_lockers_matrix_lockers_url_config_source_routes";
import { AdminLockersLockerListSchema, AdminLockersSeatListSchema } from "@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/schemas/AdminLockersMatrixApiSchema";

export async function fetchAdminLockersLockers() {
  const payload = await apiFetch<unknown>(ADMIN_LOCKERS_URLS.LOCKERS);
  return parseApiResponseData(payload, AdminLockersLockerListSchema);
}

export async function fetchAdminLockersSeatMatrix() {
  const payload = await apiFetch<unknown>(ADMIN_LOCKERS_URLS.SEAT_MATRIX);
  return parseApiResponseData(payload, AdminLockersSeatListSchema);
}

/** Stable query-key namespace for admin_lockers_matrix; declaration does not imply a live query is wired. */
export const adminLockersMatrixQueryKeys = {
  all: ['admin_lockers_matrix'] as const,
  lists: () => [...adminLockersMatrixQueryKeys.all, 'lists'] as const,
  list: (filters: Readonly<Record<string, unknown>> = {}) => [...adminLockersMatrixQueryKeys.lists(), filters] as const,
  details: () => [...adminLockersMatrixQueryKeys.all, 'details'] as const,
  detail: (id: string) => [...adminLockersMatrixQueryKeys.details(), id] as const,
} as const;
