// Canonical domain shell: direct submodule routes own all business screens.
import { ADMIN_SEATS_MATRIX_CANONICAL_ROUTE } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/config/admin_seats_matrix.url_config';
import { redirect } from 'next/navigation';

export default function AdminSeatsShiftsLockersPage() {
  redirect(ADMIN_SEATS_MATRIX_CANONICAL_ROUTE);
}
