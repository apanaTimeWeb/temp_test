'use client';
// RESPONSIBILITY: Owns the AdminDashboardOverviewMain presentation responsibility for the dashboard_overview module. It does not own cross-module business logic or API transport.
import { useState, useMemo } from 'react';
import {
  Armchair,
  Users,
  WalletCards,
  Building2,
  Calendar,
  RefreshCw,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import AdminDashboardBranchLeaderboard, {
  type AdminDashboardTimeRange,
} from '@/app/frontend_admin/admin_dashboard/dashboard_overview/components/AdminDashboardBranchLeaderboard';
import { AdminDashboardOverviewKpis } from '@/app/frontend_admin/admin_dashboard/dashboard_overview/components/AdminDashboardOverviewKpis';
import { AdminDashboardOverviewDestinations } from '@/app/frontend_admin/admin_dashboard/dashboard_overview/components/AdminDashboardOverviewDestinations';
import {
  ADMIN_DASHBOARD_DESTINATIONS,
  ADMIN_DASHBOARD_BRANCH_METRICS,
} from '@/app/frontend_admin/admin_dashboard/dashboard_overview/constants/AdminDashboardOverviewConstants';
import { toast } from 'sonner';

/**
 * Renders the canonical dashboard landing page for the multi-library Admin.
 * Combines high-level executive multi-branch indicators with primary workspaces.
 */
export default function AdminDashboardOverviewMain() {
  const t = useTranslations('ADMIN_DASHBOARD');
  const { selectedBranchId, selectedBranch } = useAdminBranch();
  const rawMetrics = ADMIN_DASHBOARD_BRANCH_METRICS[selectedBranchId] ?? ADMIN_DASHBOARD_BRANCH_METRICS.all;

  // Global Time Horizon State
  const [timeRange, setTimeRange] = useState<AdminDashboardTimeRange>('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncOverview = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Central network dashboard metrics synchronized');
    }, 600);
  };

  const dynamicRevenue = useMemo(() => {
    const base = rawMetrics.revenueNum;
    if (timeRange === 'today') {
      const val = Math.round(base * 0.04);
      return { value: `₹${val.toLocaleString('en-IN')}`, subtext: 'Realized today (Network)' };
    }
    if (timeRange === 'this_week') {
      const val = Math.round(base * 0.26);
      return { value: `₹${val.toLocaleString('en-IN')}`, subtext: 'Realized this week (Network)' };
    }
    return { value: rawMetrics.revenue, subtext: rawMetrics.revenueSub };
  }, [rawMetrics, timeRange]);

  const executiveKpis = [
    {
      id: 'kpi-branches',
      title: 'Operating Branches',
      periodBadge: null,
      value: rawMetrics.branches,
      subtext: rawMetrics.branchesSub,
      Icon: Building2,
      trend: selectedBranchId === 'all' ? '+1 this quarter' : 'Branch Active',
      theme: 'bg-warning-bg text-warning-text border-border',
    },
    {
      id: 'kpi-members',
      title: 'Active Members',
      periodBadge: null,
      value: rawMetrics.members,
      subtext: rawMetrics.membersSub,
      Icon: Users,
      trend: '+12% vs last month',
      theme: 'bg-info-bg text-info-text border-border',
    },
    {
      id: 'kpi-occupancy',
      title: 'Seat Occupancy',
      periodBadge: null,
      value: rawMetrics.occupancy,
      subtext: rawMetrics.occupancySub,
      Icon: Armchair,
      trend: 'Optimal capacity',
      theme: 'bg-surface-highlight text-primary border-border',
    },
    {
      id: 'kpi-revenue',
      title: timeRange === 'today' ? 'Collections Today' : timeRange === 'this_week' ? 'Collections (Week)' : timeRange === 'custom' ? 'Collections (Custom)' : 'Monthly Collections',
      periodBadge: timeRange === 'today' ? 'Today' : timeRange === 'this_week' ? 'This Week' : timeRange === 'custom' ? 'Custom' : 'This Month',
      value: dynamicRevenue.value,
      subtext: dynamicRevenue.subtext,
      Icon: WalletCards,
      trend: '96% on-time fee recovery',
      theme: 'bg-success-bg text-success-text border-border',
    },
  ];

  const timeHorizonOptions: Array<{ id: AdminDashboardTimeRange; label: string }> = [
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'custom', label: 'Custom Range' },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 text-text-primary sm:p-6 lg:p-8">
      {/* ── Executive Header Banner ── */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-semibold text-primary uppercase tracking-wider">
                {t('LIBRARY_OVERVIEW_EYEBROW')}
              </span>
              <span className="text-border">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-success-bg text-success-text border border-border">
                <Building2 size={12} />
                Multi-Branch Network
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-secondary/10 text-text-secondary border border-border">
                Scope: <strong className="text-text-primary">{selectedBranch ? `${selectedBranch.name} (${selectedBranch.code})` : 'All Branches (Network View)'}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              {t('LIBRARY_OVERVIEW_TITLE')}
            </h1>

            <p className="text-sm text-text-secondary">
              {t('LIBRARY_OVERVIEW_DESCRIPTION')}
            </p>
          </div>

          {/* Right Header Fast Action */}
          <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
            <button
              type="button"
              onClick={handleSyncOverview}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-border hover:bg-surface-hover motion-safe:transition-all shadow-sm active:scale-95 disabled:opacity-60"
              title="Sync Central Analytics"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin text-primary' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Central'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Global Time Horizon Segmented Pill Bar ── */}
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Analytics Time Horizon:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Time Horizon Pills */}
          <div className="inline-flex bg-muted/60 p-1 rounded-xl border border-border flex-wrap">
            {timeHorizonOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTimeRange(opt.id)}
                className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all ${
                  timeRange === opt.id
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom Date Range Picker */}
          {timeRange === 'custom' && (
            <div className="flex items-center gap-2 flex-wrap text-xs bg-muted/40 p-1.5 rounded-lg border border-border">
              <label className="flex items-center gap-1 text-text-secondary">
                <span>From:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2 py-1 bg-card border border-border rounded text-xs text-text-primary outline-none focus:border-primary"
                />
              </label>
              <label className="flex items-center gap-1 text-text-secondary">
                <span>To:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2 py-1 bg-card border border-border rounded text-xs text-text-primary outline-none focus:border-primary"
                />
              </label>
              {(customStartDate || customEndDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomStartDate('');
                    setCustomEndDate('');
                  }}
                  className="p-1 text-text-secondary hover:text-destructive"
                  title="Clear custom dates"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Executive Multi-Branch Overview KPI Cards ── */}
      <AdminDashboardOverviewKpis kpis={executiveKpis} sectionLabel={t('KPI_SECTION_LABEL')} />

      {/* ── Multi-Branch Comparative Analytics & Benchmarking Leaderboard ── */}
      <AdminDashboardBranchLeaderboard timeRange={timeRange} />

      {/* ── Core Operational Workspace Hubs ── */}
      <AdminDashboardOverviewDestinations
        destinations={ADMIN_DASHBOARD_DESTINATIONS}
        sectionLabel={t('LIBRARY_DESTINATIONS')}
        openLabel={t('LIBRARY_OPEN_DESTINATION')}
        getTitle={(key) => t(`LIBRARY_${key}_TITLE`)}
        getUnavailable={(key) => t(`LIBRARY_${key}_UNAVAILABLE`)}
      />

      <aside
        role="status"
        className="rounded-xl border border-border bg-card p-4 text-xs text-text-secondary"
      >
        <h2 className="font-semibold text-text-primary">
          {t('LIBRARY_DATA_PENDING_TITLE')}
        </h2>
        <p className="mt-1">{t('LIBRARY_DATA_PENDING_DESCRIPTION')}</p>
      </aside>
    </main>
  );
}
