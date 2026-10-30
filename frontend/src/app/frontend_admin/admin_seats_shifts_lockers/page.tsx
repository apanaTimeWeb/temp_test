// Canonical domain shell: direct submodule routes own all business screens.
import { redirect } from 'next/navigation';
import { ADMIN_SEATS_MATRIX_CANONICAL_ROUTE } from './seats_matrix/config/admin_seats_matrix.url_config';

export default function AdminSeatsShiftsLockersPage() {
  redirect(ADMIN_SEATS_MATRIX_CANONICAL_ROUTE);
}
