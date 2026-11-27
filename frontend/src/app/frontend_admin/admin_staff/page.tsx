import { redirect } from 'next/navigation';
import { ADMIN_STAFF_DIRECTORY_CANONICAL_ROUTE } from '@/app/frontend_admin/admin_staff/staff_directory/config/admin_staff_directory.url_config';

export default function AdminStaffPage() {
  redirect(ADMIN_STAFF_DIRECTORY_CANONICAL_ROUTE);
}
