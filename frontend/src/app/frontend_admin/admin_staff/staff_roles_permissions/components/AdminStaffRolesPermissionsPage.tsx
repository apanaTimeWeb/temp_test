'use client';
// RESPONSIBILITY: AdminStaffRolesPermissionsPage presentation component owned by admin_staff_roles_permissions; responsibility folder: admin_staff_roles_permissions_components_views.

import { useTranslations } from 'next-intl';
import { CheckCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import AdminStaffRolesPermissionsMatrixTable from '@/app/frontend_admin/admin_staff/staff_roles_permissions/components/AdminStaffRolesPermissionsMatrixTable';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import useAdminStaffRolesPermissionsState from '@/app/frontend_admin/admin_staff/staff_roles_permissions/hooks/useAdminStaffRolesPermissionsState';
import { saveAdminStaffRolesPermissionsDemoState } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/mocks/AdminStaffRolesPermissionsDemoState';

/** Shows permission definitions and an explicitly local demo preview; live permission edits require an approved host contract.
 * ACCESS_ROLES_NOTICE: Authorization remains a host/backend responsibility.
 */
export default function AdminStaffRolesPermissionsPage() {
  const t = useTranslations('ADMIN_STAFF_ROLES_PERMISSIONS');
  const demoMode = isFrontendDemoModeEnabled();
  const { permsQuery, perms, setPerms } = useAdminStaffRolesPermissionsState();

  const toggle = (moduleIndex: number, actionIndex: number, roleKey: string) => {
    if (!demoMode) return;
    setPerms((current) => current.map((module, currentModuleIndex) => currentModuleIndex === moduleIndex
      ? {
          ...module,
          actions: module.actions.map((action, currentActionIndex) => currentActionIndex === actionIndex
            ? { ...action, roles: { ...action.roles, [roleKey]: !action.roles[roleKey] } }
            : action),
        }
      : module));
  };

  const save = () => {
    if (!isFrontendDemoModeEnabled()) {
      toast.error(t('SAVE_HELP_BLOCKED'), { id: 'admin-permissions-save-blocked' });
      return;
    }
    saveAdminStaffRolesPermissionsDemoState(perms);
    toast.success(t('SAVE_DEMO_TOAST'), { id: 'admin-permissions-save-demo-only' });
  };

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <div className="space-y-6">
        <header className="admin-page-header">
          <div>
            <p className="admin-breadcrumb">{t('BREADCRUMB')}</p>
            <h1 className="admin-page-title">{t('PAGE_TITLE')}</h1>
            <p className="admin-page-subtitle">{t('PAGE_SUBTITLE')}</p>
          </div>
          <button
            type="button"
            className="admin-btn-primary min-h-11"
            onClick={save}
            disabled={!demoMode || permsQuery.isPending || permsQuery.isError || perms.length === 0}
            aria-describedby="admin-permissions-save-help"
          >
            <CheckCircle size={18} strokeWidth={2} /> {t('SAVE_CHANGES')}
          </button>
        </header>

        <p id="admin-permissions-save-help" className="text-sm text-text-secondary" role="status">
          {demoMode ? t('SAVE_HELP_DEMO') : t('SAVE_HELP_BLOCKED')}
        </p>

        {permsQuery.isError ? (
          <div role="alert" className="rounded-lg border border-border bg-card p-6 text-danger-text">
            <p>{demoMode ? t('LOAD_ERROR') : t('LIVE_UNAVAILABLE')}</p>
            <button type="button" className="mt-3 min-h-11 rounded border border-border px-3 py-2 text-primary" onClick={() => { void permsQuery.refetch(); }}>
              {t('RETRY')}
            </button>
          </div>
        ) : permsQuery.isPending ? (
          <div role="status" aria-live="polite" className="rounded-lg border border-border bg-card p-8 text-center text-text-secondary">
            {t('LOADING')}
          </div>
        ) : perms.length === 0 ? (
          <AdminEmptyState showIcon={false} title={t('EMPTY_TITLE')} description={t('EMPTY_DESCRIPTION')} />
        ) : (
          <AdminStaffRolesPermissionsMatrixTable modules={perms} demoMode={demoMode} onToggle={toggle} />
        )}
      </div>
    </>
  );
}
