'use client';
import useAdminMembersDirectoryMain from '@/app/frontend_admin/admin_members/members_directory/hooks/useAdminMembersDirectoryMain';
import AdminMembersDirectoryView from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryView';

/** Canonical route entry; the module hook owns state and the view owns presentation. */
export default function AdminMembersDirectoryRoute() {
  const model = useAdminMembersDirectoryMain();
  return <AdminMembersDirectoryView model={model} />;
}
