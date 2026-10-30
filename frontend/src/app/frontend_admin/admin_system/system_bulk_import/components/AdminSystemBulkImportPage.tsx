'use client';
// Responsibility: AdminSystemBulkImportPage component owned by admin_system; responsibility folder: admin_system_components_views.

import useBulkImportPage from '@/app/frontend_admin/admin_system/system_bulk_import/hooks/useAdminSystemBulkImportPage';
import AdminSystemBulkImportPageView from '@/app/frontend_admin/admin_system/system_bulk_import/components/AdminSystemBulkImportPageView';

// RESPONSIBILITY: Owns orchestration only; the interactive state model is in the module hook and presentation is in the module view.
export function AdminSystemBulkImportPage() {
  const model = useBulkImportPage();
  return <AdminSystemBulkImportPageView model={model} />;
}
