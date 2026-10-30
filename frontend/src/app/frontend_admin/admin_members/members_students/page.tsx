'use client';
import useAdminMembersStudentsMain from '@/app/frontend_admin/admin_members/members_students/hooks/useAdminMembersStudentsMain';
import AdminMembersStudentsView from '@/app/frontend_admin/admin_members/members_students/components/AdminMembersStudentsView';

/** Canonical route entry; server state and user interactions remain in module-owned hooks. */
export default function AdminMembersStudentsRoute() {
  const model = useAdminMembersStudentsMain();
  return <AdminMembersStudentsView model={model} />;
}
