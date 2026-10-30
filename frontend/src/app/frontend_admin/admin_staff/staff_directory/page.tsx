'use client';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import useAdminStaffDirectory from '@/app/frontend_admin/admin_staff/staff_directory/hooks/useAdminStaffDirectory';
import AdminStaffDirectoryViewSIDEBARNAVIGATIONSection from '@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryViewSIDEBARNAVIGATIONSection';

/** Canonical staff directory route and shell; API-backed state remains in its feature hook.
 * STAFF_DIRECTORY_NOTICE: Permissions and access are managed under /admin/admin_staff/staff_roles_permissions.
 */
export default function AdminStaffDirectoryRoute() {
  const model = useAdminStaffDirectory();
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const { viewingManager, setViewingManager, isDemoMode, isLoading, hasLoadError, retryLoadManagers } = model;
  return (
    <div className="motion-safe:transition-opacity motion-safe:duration-base admin-shared-page-container" >
      {isDemoMode && <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('DEMO_WARNING')}</p>}
      {isLoading && <p role="status" aria-live="polite" className="mb-4 rounded-md border border-border bg-card p-3 text-text-secondary">{t('LOADING')}</p>}
      {hasLoadError && <div role="alert" className="mb-4 rounded-md border border-danger-text bg-danger-bg p-3"><p className="text-danger-text">{t('LOAD_ERROR')}</p><button type="button" className="admin-btn-outline mt-2 min-h-11" onClick={() => { void retryLoadManagers(); }}>{t('RETRY_LOAD')}</button></div>}
      
      {/* HEADER */}
      <div className="admin-shared-toolbar" >
        {viewingManager && (
          <button type="button" aria-label={t('BACK_TO_LIST')} title={t('BACK_TO_LIST')} data-testid="admin_staff_directory-AdminStaffDirectoryView-control-001" className="admin-btn-icon" onClick={() => setViewingManager(null)}>
            <ArrowLeft size={18}  strokeWidth={2}/>
          </button>
        )}
        <div>
          <h1 className="admin-shared-page-title" >
            {viewingManager ? t('MANAGER_TITLE', { name: viewingManager.name }) : t('PAGE_TITLE')}
          </h1>
          <p className="admin-shared-page-subtitle" >
            {viewingManager ? t('MANAGER_DETAIL_SUMMARY', { id: viewingManager.id, branch: viewingManager.branch }) : t('PAGE_SUBTITLE')}
          </p>
        </div>
      </div>

      <AdminStaffDirectoryViewSIDEBARNAVIGATIONSection model={model} />
    </div>
  );
}
