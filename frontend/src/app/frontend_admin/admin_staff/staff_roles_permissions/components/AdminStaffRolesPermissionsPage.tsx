'use client';
// RESPONSIBILITY: AdminStaffRolesPermissionsPage presentation component owned by admin_staff_roles_permissions; responsibility folder: admin_staff_roles_permissions_components_views.

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle, Search, Shield, KeyRound, Lock, CheckCircle2 } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

  const kpis = useMemo(() => {
    let totalActions = 0;
    let enabledActions = 0;
    perms.forEach((mod) => {
      totalActions += mod.actions.length;
      mod.actions.forEach((act) => {
        if (act.roles && Object.values(act.roles).some(Boolean)) {
          enabledActions += 1;
        }
      });
    });
    return {
      moduleCount: perms.length,
      actionCount: totalActions,
      enabledCount: enabledActions,
    };
  }, [perms]);

  const filteredPerms = useMemo(() => {
    if (!searchQuery.trim()) return perms;
    const q = searchQuery.toLowerCase().trim();
    return perms
      .map((m) => {
        const matchesModule = m.module.toLowerCase().includes(q);
        const matchedActions = m.actions.filter(
          (a) => matchesModule || a.label.toLowerCase().includes(q) || a.key.toLowerCase().includes(q)
        );
        return {
          ...m,
          actions: matchedActions,
        };
      })
      .filter((m) => m.actions.length > 0);
  }, [perms, searchQuery]);

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

  const handleToggle = (filteredModIdx: number, filteredActIdx: number, roleKey: string) => {
    const mod = filteredPerms[filteredModIdx];
    if (!mod) return;
    const act = mod.actions[filteredActIdx];
    if (!act) return;
    const origModIdx = perms.findIndex((m) => m.module === mod.module);
    if (origModIdx === -1) return;
    const origActIdx = perms[origModIdx].actions.findIndex((a) => a.key === act.key);
    if (origActIdx === -1) return;
    toggle(origModIdx, origActIdx, roleKey);
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

        {/* Permission KPI Summary Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Modules</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield size={16} strokeWidth={2.2} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{kpis.moduleCount}</p>
            <span className="text-xs text-text-muted">Domain Areas</span>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Actions</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-bg text-info-text">
                <KeyRound size={16} strokeWidth={2.2} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-info-text">{kpis.actionCount}</p>
            <span className="text-xs text-text-muted">Granular Permissions</span>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Active Rules</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-bg text-success-text">
                <CheckCircle2 size={16} strokeWidth={2.2} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-success-text">{kpis.enabledCount}</p>
            <span className="text-xs text-text-muted">Enabled for Manager</span>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Model</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-bg text-purple-text">
                <Lock size={16} strokeWidth={2.2} />
              </div>
            </div>
            <p className="mt-2 text-xl font-bold tracking-tight text-purple-text">RBAC</p>
            <span className="text-xs text-text-muted">Role Based Access</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p id="admin-permissions-save-help" className="text-sm text-text-secondary" role="status">
            {demoMode ? t('SAVE_HELP_DEMO') : t('SAVE_HELP_BLOCKED')}
          </p>
          <div className="relative min-w-[260px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search permissions by action or module..."
              className="w-full rounded-lg border border-border bg-card py-1.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

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
        ) : filteredPerms.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-text-secondary">
            No permissions found matching "{searchQuery}".
          </div>
        ) : (
          <AdminStaffRolesPermissionsMatrixTable modules={filteredPerms} demoMode={demoMode} onToggle={handleToggle} />
        )}
      </div>
    </>
  );
}
