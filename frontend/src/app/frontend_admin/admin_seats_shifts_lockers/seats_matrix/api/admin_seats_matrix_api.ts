import { apiFetch } from "@/app/frontend_admin/lib/api";
import { parseApiResponseData } from "@/app/frontend_admin/lib/apiSchema";
import { ADMIN_SEAT_MATRIX_URLS } from "@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/config/admin_seats_matrix.url_config";
import { AdminSeatMatrixLockerListSchema, AdminSeatMatrixSeatListSchema } from "@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/schemas/AdminSeatsMatrixApiSchema";

export async function fetchAdminSeatMatrixLockers() {
  const payload = await apiFetch<unknown>(ADMIN_SEAT_MATRIX_URLS.LOCKERS);
  return parseApiResponseData(payload, AdminSeatMatrixLockerListSchema);
}

export async function fetchAdminSeatMatrixSeatMatrix() {
  const payload = await apiFetch<unknown>(ADMIN_SEAT_MATRIX_URLS.SEAT_MATRIX);
  return parseApiResponseData(payload, AdminSeatMatrixSeatListSchema);
}

// Feature-scoped TanStack Query cache keys belong to this entity-family API contract.
/** Feature-scoped TanStack Query keys for admin_seat_matrix. Keep server-state cache ownership inside this feature. */

