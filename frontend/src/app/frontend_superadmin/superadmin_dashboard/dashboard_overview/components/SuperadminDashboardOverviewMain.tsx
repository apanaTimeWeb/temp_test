'use client';
/** Responsibility: Superadmin Dashboard Main; owns the dashboard route composition boundary, global telemetry filters, and modular operational sections. */
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Activity, LayoutDashboard, ShieldCheck, RefreshCw, AlertCircle, Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import SuperadminDashboardOverviewFiltersBar from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewFiltersBar';
import SuperadminDashboardOverviewTopKpis from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewTopKpis';
import SuperadminDashboardOverviewPendingRequests from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewPendingRequests';
import SuperadminDashboardOverviewCriticalAlerts from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewCriticalAlerts';
import SuperadminDashboardOverviewInfrastructureHealth from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewInfrastructureHealth';
import SuperadminDashboardOverviewRecentActivityAudit from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewRecentActivityAudit';
import SuperadminDashboardOverviewRecentLibrariesTable from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewRecentLibrariesTable';
import SuperadminDashboardOverviewRecentBranchesTable from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewRecentBranchesTable';
import SuperadminDashboardOverviewRecentActivityFeed from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewRecentActivityFeed';

import { useSuperadminDashboardOverviewAvailability } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/hooks/useSuperadminDashboardOverviewAvailability';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config';
import {
  SUPERADMIN_DASHBOARD_12_KPIS,
  SUPERADMIN_DASHBOARD_INITIAL_DATA,
  SUPERADMIN_DASHBOARD_PENDING_BRANCHES,
  SUPERADMIN_DASHBOARD_PENDING_UPGRADES,
  SUPERADMIN_DASHBOARD_PLATFORM_ALERTS,
  SUPERADMIN_DASHBOARD_INFRA_HEALTH,
  SUPERADMIN_DASHBOARD_ADMIN_LOGINS,
  SUPERADMIN_DASHBOARD_SUPERADMIN_ACTIVITIES,
  SUPERADMIN_DASHBOARD_RECENT_BRANCHES,
  SUPERADMIN_DASHBOARD_OPEN_TICKETS,
  SUPERADMIN_DASHBOARD_INITIAL_ACTIVITIES,
} from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewData';
import type { SuperadminDashboardFilterState } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';

const INITIAL_FILTERS: SuperadminDashboardFilterState = {
  timeRange: '30d',
  account: 'all',
  branch: 'all',
  plan: 'all',
  status: 'all',
};

export default function SuperadminDashboardOverviewMain() {
  const t = useTranslations('SUPERADMIN_DASHBOARD');
  const { available } = useSuperadminDashboardOverviewAvailability();
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<SuperadminDashboardFilterState>(INITIAL_FILTERS);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Filter KPI cards or tables when dimension filters are selected
  const activeKpis = useMemo(() => {
    if (filters.status === 'suspended') {
      return SUPERADMIN_DASHBOARD_12_KPIS.map((kpi) =>
        kpi.icon === 'power_off' ? { ...kpi, alert: '12 Filtered Suspended' } : kpi
      );
    }
    return SUPERADMIN_DASHBOARD_12_KPIS;
  }, [filters]);

  const activeLibraries = useMemo(() => {
    if (filters.plan !== 'all') {
      return SUPERADMIN_DASHBOARD_INITIAL_DATA.recentLibraries.filter(
        (lib) => lib.plan.toLowerCase() === filters.plan.toLowerCase()
      );
    }
    if (filters.status !== 'all') {
      return SUPERADMIN_DASHBOARD_INITIAL_DATA.recentLibraries.filter(
        (lib) => lib.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
    return SUPERADMIN_DASHBOARD_INITIAL_DATA.recentLibraries;
  }, [filters]);

  return (
    <main className="w-full max-w-full min-w-0 pb-12">
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

      {/* ─── Metric Dimension & Time Range Filters ─── */}
      <SuperadminDashboardOverviewFiltersBar
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* ─── 12 Top KPI Cards Grid (Clickable to detailed listings) ─── */}
      <SuperadminDashboardOverviewTopKpis cards={activeKpis} />

      {/* ─── Pending Requests: Branch Creation & Upgrade Requests ─── */}
      <SuperadminDashboardOverviewPendingRequests
        branchRequests={SUPERADMIN_DASHBOARD_PENDING_BRANCHES}
        upgradeRequests={SUPERADMIN_DASHBOARD_PENDING_UPGRADES}
      />

      {/* ─── Critical Operational Alerts (Payment Failures, Expiring Subs, Failed Logins, Job Failures) ─── */}
      <SuperadminDashboardOverviewCriticalAlerts alerts={SUPERADMIN_DASHBOARD_PLATFORM_ALERTS} />

      {/* ─── Infrastructure Health (Server, DB, Backup) & Open Support Tickets with SLA ─── */}
      <SuperadminDashboardOverviewInfrastructureHealth
        health={SUPERADMIN_DASHBOARD_INFRA_HEALTH}
        tickets={SUPERADMIN_DASHBOARD_OPEN_TICKETS}
      />

      {/* ─── Latest Admin Logins & Root SuperAdmin Activity Audit ─── */}
      <SuperadminDashboardOverviewRecentActivityAudit
        adminLogins={SUPERADMIN_DASHBOARD_ADMIN_LOGINS}
        superadminActivities={SUPERADMIN_DASHBOARD_SUPERADMIN_ACTIVITIES}
      />

      {/* ─── Recent Tables: Recent Libraries & Recently Created Branches ─── */}
      <section className="space-y-6 mb-6" aria-label="Tenant Registrations and Branch Deployments">
        <SuperadminDashboardOverviewRecentLibrariesTable data={activeLibraries} />
        <SuperadminDashboardOverviewRecentBranchesTable branches={SUPERADMIN_DASHBOARD_RECENT_BRANCHES} />
      </section>

      {/* ─── Platform Activity Event Stream ─── */}
      <section aria-label="Platform Event Audit Log">
        <SuperadminDashboardOverviewRecentActivityFeed items={SUPERADMIN_DASHBOARD_INITIAL_ACTIVITIES} />
      </section>
    </main>
  );
}
