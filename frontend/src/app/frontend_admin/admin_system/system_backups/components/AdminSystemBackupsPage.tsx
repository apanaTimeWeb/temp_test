// Responsibility: AdminSystemBackupsPage component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import useBackupsPage from '@/app/frontend_admin/admin_system/system_backups/hooks/useAdminSystemBackupsPage';
import AdminSystemBackupsPageView from '@/app/frontend_admin/admin_system/system_backups/components/AdminSystemBackupsPageView';

// RESPONSIBILITY: Owns orchestration only; the interactive state model is in the module hook and presentation is in the module view.
export function AdminSystemBackupsPage() {
  const model = useBackupsPage();
  return <AdminSystemBackupsPageView model={model} />;
}
