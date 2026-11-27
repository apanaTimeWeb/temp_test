import AdminStaffDirectoryMain from '@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryMain';

/** Canonical Server Component route entry delegating interactive staff directory management to client view.
 * STAFF_DIRECTORY_NOTICE: Permissions and access are managed under /admin/admin_staff/staff_roles_permissions.
 */
export default function AdminStaffDirectoryRoute() {
  return <AdminStaffDirectoryMain />;
}
