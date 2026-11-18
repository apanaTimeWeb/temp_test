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
            <ArrowLeft size={18} strokeWidth={2} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Active - Emerald */}
          <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
            <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
              <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="relative z-10 flex items-start justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">{t('STATUS_ACTIVE')}</span>
              <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
                <CheckCircle2 size={18} strokeWidth={2.2} />
              </div>
            </div>
            <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-400 tabular-nums">{branchCounts.active}</p>
            <span className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 block text-xs font-medium text-slate-400">Operational & On-Floor</span>
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
