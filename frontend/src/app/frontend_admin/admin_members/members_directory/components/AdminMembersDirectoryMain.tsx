'use client';

import AdminMembersDirectoryView from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryView';
import useAdminMembersDirectoryMain from '@/app/frontend_admin/admin_members/members_directory/hooks/useAdminMembersDirectoryMain';

export default function AdminMembersDirectoryMain() {
  const model = useAdminMembersDirectoryMain();
  return <AdminMembersDirectoryView model={model} />;
}
