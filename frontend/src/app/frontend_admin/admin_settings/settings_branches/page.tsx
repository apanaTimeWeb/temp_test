'use client';
import useAdminSettingsBranchesMain from '@/app/frontend_admin/admin_settings/settings_branches/hooks/useAdminSettingsBranchesMain';
import AdminSettingsBranchesView from '@/app/frontend_admin/admin_settings/settings_branches/components/AdminSettingsBranchesView';

/** Canonical route entry; internal branch tabs remain within the existing route. */
export default function AdminSettingsBranchesRoute() {
  const model = useAdminSettingsBranchesMain();
  return <AdminSettingsBranchesView model={model} />;
}
