'use client';
import type { AdminSettingsBranchesViewProps } from '@/app/frontend_admin/admin_settings/settings_branches/types/AdminSettingsBranchesComponentTypes';

// RESPONSIBILITY: AdminSettingsBranchesView component owned by admin_branches; responsibility folder: admin_branches_components_views.
import { useTranslations } from 'next-intl';
import { ArrowLeft, Building2, CheckCircle2, AlertTriangle, Archive } from 'lucide-react';
import useAdminSettingsBranchesMain from '@/app/frontend_admin/admin_settings/settings_branches/hooks/useAdminSettingsBranchesMain';
import AdminSettingsBranchesViewSIDEBARNAVIGATIONSection from '@/app/frontend_admin/admin_settings/settings_branches/components/AdminSettingsBranchesViewSIDEBARNAVIGATIONSection';

export default function AdminSettingsBranchesView({ model }: AdminSettingsBranchesViewProps) {
  const t = useTranslations('ADMIN_BRANCHES');
  const { viewingBranch, setViewingBranch, isDemoMode, branchesLoading, branchesError, retryBranches, branchCounts } = model;
  return (
    <div className="motion-safe:transition-opacity motion-safe:duration-base admin-shared-page-container space-y-6" >
      {isDemoMode ? <p role="status" className="sr-only">{t('DEMO_NOTICE')}</p> : null}
      
      {/* HEADER */}
      <div className="flex items-center gap-4" >
        {viewingBranch && (
          <button type="button" aria-label={t('BACK_TO_LIST')} data-testid="admin_branches-AdminSettingsBranchesView-control-001" className="admin-btn-icon" onClick={() => setViewingBranch(null)}>
            <ArrowLeft size={18}  strokeWidth={2}/>
          </button>
        )}
        <div>
          <h1 className="admin-shared-page-title" >
            {viewingBranch ? t('BRANCH_PREFIX', { name: viewingBranch.name }) : t('PAGE_TITLE')}
          </h1>
          <p className="admin-shared-page-subtitle" >
            {viewingBranch ? t('CODE_MANAGER', { code: viewingBranch.code, manager: viewingBranch.manager }) : t('PAGE_DESCRIPTION')}
          </p>
        </div>
      </div>

      {/* KPI Cards when browsing branch network */}
      {!viewingBranch && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('NAV_MAIN_ALL')}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 size={16} strokeWidth={2.2} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{branchCounts.all}</p>
            <span className="text-xs text-text-muted">Total Network Locations</span>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('STATUS_ACTIVE')}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-bg text-success-text">
                <CheckCircle2 size={16} strokeWidth={2.2} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-success-text">{branchCounts.active}</p>
            <span className="text-xs text-text-muted">Operational & On-Floor</span>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('STATUS_SUSPENDED')}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-bg text-warning-text">
                <AlertTriangle size={16} strokeWidth={2.2} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-warning-text">{branchCounts.suspended}</p>
            <span className="text-xs text-text-muted">Under Maintenance</span>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('STATUS_ARCHIVED')}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-text-secondary">
                <Archive size={16} strokeWidth={2.2} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-text-secondary">{branchCounts.archived}</p>
            <span className="text-xs text-text-muted">Decommissioned</span>
          </div>
        </div>
      )}

      {branchesLoading ? <section role="status" aria-busy="true" aria-label={t('LOADING_BRANCHES')} className="space-y-4 rounded-lg border border-border bg-card p-4 sm:p-6">
            <span className="sr-only">{t('LOADING_BRANCH_RECORDS')}</span>
            <div className="motion-safe:animate-pulse space-y-2">
              <div className="h-7 w-48 max-w-full rounded bg-skeleton-highlight" />
              <div className="h-4 w-72 max-w-full rounded bg-skeleton-base" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }, (_, index) => <div key={`branch-skeleton-${index + 1}`} className="h-12 rounded bg-skeleton-base motion-safe:animate-pulse" />)}
            </div>
          </section> : branchesError ? <section className="rounded-lg border border-danger-text bg-danger-bg p-6" role="alert"><p className="font-semibold text-danger-text">{t('LOAD_ERROR')}</p><p className="mt-1 text-text-secondary">{branchesError}</p><button type="button" className="mt-3 min-h-11 rounded-md border border-border px-3 py-2 text-primary" onClick={() => { void retryBranches(); }}>{t('RETRY')}</button></section> : <AdminSettingsBranchesViewSIDEBARNAVIGATIONSection model={model} />}
    </div>
  );
}


export type { AdminSettingsBranchesViewProps };
