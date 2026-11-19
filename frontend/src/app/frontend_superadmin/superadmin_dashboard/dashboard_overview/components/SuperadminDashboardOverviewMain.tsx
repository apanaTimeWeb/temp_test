'use client';
/** Responsibility: Superadmin Dashboard Main; owns the dashboard route composition boundary and responsive layout. */
import Link from 'next/link';
import { Activity, LayoutDashboard, ShieldCheck, RefreshCw, AlertCircle, Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import SuperadminDashboardOverviewKpiCard from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewKpiCard';
import SuperadminDashboardOverviewSystemHealthPanel from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewSystemHealthPanel';
import SuperadminDashboardOverviewActionItemsPanel from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewActionItemsPanel';
import SuperadminDashboardOverviewRecentLibrariesTable from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewRecentLibrariesTable';
import SuperadminDashboardOverviewRecentActivityFeed from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewRecentActivityFeed';
import { useSuperadminDashboardOverviewAvailability } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/hooks/useSuperadminDashboardOverviewAvailability';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config';
import { SUPERADMIN_DASHBOARD_INITIAL_DATA, SUPERADMIN_DASHBOARD_INITIAL_ACTIVITIES } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewData';
import { useState } from 'react';

export default function SuperadminDashboardOverviewMain() {
  const t = useTranslations('SUPERADMIN_DASHBOARD');
  const { available } = useSuperadminDashboardOverviewAvailability();
  const [refreshing, setRefreshing] = useState(false);

  const data = SUPERADMIN_DASHBOARD_INITIAL_DATA;
  const activities = SUPERADMIN_DASHBOARD_INITIAL_ACTIVITIES;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <main className="w-full max-w-full min-w-0 pb-10">
      {/* ─── Hero / Header Banner ─── */}
      <div className="w-full max-w-full min-w-0 rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#1a1f4e] to-indigo-900/60 p-5 sm:p-6 shadow-lg transition-all mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Titles & Meta Chips */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                <ShieldCheck size={11} className="text-indigo-400" />
                Super Admin Scope
              </span>
            </div>

            <div>
              <div className="sa-breadcrumb text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <span>{t('COPY.LIBRARY_OS')}</span>
                <span>/</span>
                <span>{t('COPY.SUPER_ADMIN')}</span>
                <span>/</span>
                <span className="text-indigo-300 font-medium">{t('COPY.DASHBOARD')}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <LayoutDashboard className="text-indigo-400 shrink-0" size={28} />
                {t('COPY.PLATFORM_OVERVIEW')}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Global management console monitoring multi-tenant infrastructure, active subscriptions, revenue metrics, and system security health.
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh telemetry metrics"
              className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <RefreshCw size={14} className={`text-indigo-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.AUDIT_LOGS}
              className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 transition-all shadow-sm active:scale-95 cursor-pointer"
              data-testid="superadmin-dashboard-dashboard_overview-link-1"
            >
              <Activity size={14} className="text-indigo-400" />
              <span>{t('COPY.VIEW_AUDIT_LOGS')}</span>
            </Link>

            <Link
              href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.LIBRARIES_ONBOARDING}
              className="inline-flex items-center gap-1.5 min-h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Building2 size={15} className="text-white" />
              <span>Onboard Tenant</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Preview / Contract Status Alert */}
      {!available && (
        <div
          data-testid="dashboard-overview-api-unavailable"
          className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs sm:text-sm text-amber-200 flex items-center justify-between gap-3 shadow-xs"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertCircle size={17} className="text-amber-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-amber-300 mr-2">{t('COPY.DASHBOARD_READ_CONTRACT_UNAVAILABLE_TITLE')}:</span>
              <span className="text-amber-200/90">{t('COPY.DASHBOARD_READ_CONTRACT_UNAVAILABLE_MESSAGE')}</span>
            </div>
          </div>
          <span className="shrink-0 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Preview Mode
          </span>
        </div>
      )}

      {/* ─── Top KPI Cards Grid (Fully Responsive: mob 1-col, tab 2-col, laptop 4-col) ─── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6" aria-label="Key Performance Indicators">
        {data.kpiCards.map((kpi) => (
          <SuperadminDashboardOverviewKpiCard key={kpi.title || kpi.icon} {...kpi} />
        ))}
      </section>

      {/* ─── Middle Section: System Health (7-col) + Action Items (5-col) ─── */}
      <section className="grid grid-cols-12 gap-5 lg:gap-6 mb-6" aria-label="System Health and Actions">
        <SuperadminDashboardOverviewSystemHealthPanel data={data.systemHealth} />
        <SuperadminDashboardOverviewActionItemsPanel data={data.actionItems} />
      </section>

      {/* ─── Bottom Section: Recent Libraries Table ─── */}
      <section className="mb-6" aria-label="Recent Tenant Registrations">
        <SuperadminDashboardOverviewRecentLibrariesTable data={data.recentLibraries} />
      </section>

      {/* ─── Bottom Section: Recent Activity Timeline Feed ─── */}
      <section aria-label="Platform Event Audit Log">
        <SuperadminDashboardOverviewRecentActivityFeed items={activities} />
      </section>
    </main>
  );
}
