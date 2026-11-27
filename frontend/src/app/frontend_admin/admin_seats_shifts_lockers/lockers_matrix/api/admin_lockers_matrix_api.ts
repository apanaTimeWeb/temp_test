import { ADMIN_LOCKERS_URLS } from "@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/config/admin_lockers_matrix_lockers_url_config_source_routes";
import { AdminLockersLockerListSchema } from "@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/schemas/AdminLockersMatrixApiSchema";
import { apiFetch } from "@/app/frontend_admin/lib/api";
import { parseApiResponseData } from "@/lib/apiSchema";

export async function fetchAdminLockersLockers() {
  const payload = await apiFetch<unknown>(ADMIN_LOCKERS_URLS.LOCKERS);
  return parseApiResponseData(payload, AdminLockersLockerListSchema);
}
