// Canonical domain shell: direct submodule routes own all business screens.
import { redirect } from 'next/navigation';
import { ADMIN_STAFF_DIRECTORY_CANONICAL_ROUTE } from './staff_directory/config/admin_staff_directory.url_config';

export default function AdminStaffPage() {
  redirect(ADMIN_STAFF_DIRECTORY_CANONICAL_ROUTE);
}
