import { ADMIN_SEAT_MATRIX_URLS } from "@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/config/admin_seats_matrix.url_config";
import { AdminSeatMatrixSeatListSchema } from "@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/schemas/AdminSeatsMatrixApiSchema";
import { apiFetch } from "@/app/frontend_admin/lib/api";
import { parseApiResponseData } from "@/lib/apiSchema";

export async function fetchAdminSeatMatrixSeatMatrix() {
  const payload = await apiFetch<unknown>(ADMIN_SEAT_MATRIX_URLS.SEAT_MATRIX);
  return parseApiResponseData(payload, AdminSeatMatrixSeatListSchema);
}

