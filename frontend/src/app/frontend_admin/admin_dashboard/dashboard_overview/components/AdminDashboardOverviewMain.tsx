'use client';
// RESPONSIBILITY: Owns the AdminDashboardOverviewMain presentation responsibility for the dashboard_overview module. It does not own cross-module business logic or API transport.
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Armchair,
  Users,
  WalletCards,
  Building2,
  Calendar,
  RefreshCw,
  X,
  CreditCard,
  LayoutGrid,
  Receipt,
  UserPlus,
  Clock,
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
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
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

  const periodLabel = timeRange === 'today' ? 'Today' : timeRange === 'this_week' ? 'This Week' : timeRange === 'custom' ? 'Custom Range' : 'This Month';

  const executiveKpis = [
    {
      id: 'kpi-branches',
      title: 'Operating Branches',
      periodBadge: periodLabel,
      value: rawMetrics.branches,
      subtext: rawMetrics.branchesSub,
      Icon: Building2,
      trend: selectedBranchId === 'all' ? '+1 this quarter' : 'Branch Active',
      theme: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
    },
    {
      id: 'kpi-members',
      title: 'Active Members',
      periodBadge: periodLabel,
      value: rawMetrics.members,
      subtext: rawMetrics.membersSub,
      Icon: Users,
      trend: '+12% vs last month',
      theme: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'kpi-occupancy',
      title: 'Seat Occupancy',
      periodBadge: periodLabel,
      value: rawMetrics.occupancy,
      subtext: rawMetrics.occupancySub,
      Icon: Armchair,
      trend: 'Optimal capacity',
      theme: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    },
    {
      id: 'kpi-revenue',
      title: timeRange === 'today' ? 'Collections Today' : timeRange === 'this_week' ? 'Collections (Week)' : timeRange === 'custom' ? 'Collections (Custom)' : 'Monthly Collections',
      periodBadge: periodLabel,
      value: dynamicRevenue.value,
      subtext: dynamicRevenue.subtext,
      Icon: WalletCards,
      trend: '96% on-time fee recovery',
      theme: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    },
  ];

  const timeHorizonOptions: Array<{ id: AdminDashboardTimeRange; label: string }> = [
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="w-full space-y-6 text-text-primary">
      {/* ── Executive Header Banner ── */}
      <div className="rounded-2xl border border-indigo-500/20 bg-card p-5 sm:p-6 shadow-card transition-all space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-indigo-400 uppercase tracking-wider">
                {t('LIBRARY_OVERVIEW_EYEBROW')}
              </span>
              <span className="text-border">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Multi-Branch Network
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <Building2 size={12} className="text-indigo-400" />
                Scope: <strong className="text-white">{selectedBranch ? `${selectedBranch.name} (${selectedBranch.code})` : 'All Branches (Network View)'}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t('LIBRARY_OVERVIEW_TITLE')}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {t('LIBRARY_OVERVIEW_DESCRIPTION')}
            </p>
          </div>

          {/* Right Header Fast Action */}
          <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
            <button
              type="button"
              onClick={handleSyncOverview}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 min-h-10 px-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
              title="Sync Central Analytics"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin text-indigo-400' : 'text-indigo-400'} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Central'}</span>
            </button>
          </div>
        </div>

        {/* ── Quick Administrative Actions Strip (Matching Manager Design) ── */}
        <div className="pt-4 border-t border-indigo-500/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              Quick Actions:
            </span>
            <Link
              href={ADMIN_ROUTES.MEMBERS_DIRECTORY}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-950/40 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <UserPlus size={13} />
              <span>Members Directory</span>
            </Link>
            <Link
              href={ADMIN_ROUTES.SEATS_MATRIX}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 text-xs font-semibold transition-all cursor-pointer"
            >
              <LayoutGrid size={13} />
              <span>Seat Matrix</span>
            </Link>
            <Link
              href={ADMIN_ROUTES.FINANCE_PAYMENTS}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs font-semibold transition-all cursor-pointer"
            >
              <CreditCard size={13} />
              <span>Finance Collections</span>
            </Link>
            <Link
              href={ADMIN_ROUTES.ACCOUNTS_DAILY_SETTLEMENT}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 text-xs font-semibold transition-all cursor-pointer"
            >
              <Receipt size={13} />
              <span>Daily Settlement</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Global Time Horizon Segmented Pill Bar ── */}
      <div className="rounded-2xl border border-indigo-500/20 bg-card p-3.5 sm:p-4 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-indigo-400 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Analytics Time Horizon:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented Time Horizon Pills */}
          <div className="inline-flex bg-slate-900/70 p-1 rounded-xl border border-indigo-500/20 flex-wrap gap-1">
            {timeHorizonOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTimeRange(opt.id)}
                className={`min-h-8 px-3.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  timeRange === opt.id
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-950/50'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom Date Range Picker */}
          {timeRange === 'custom' && (
            <div className="flex items-center gap-2 flex-wrap text-xs bg-slate-900/80 p-1.5 rounded-xl border border-indigo-500/30">
              <label className="flex items-center gap-1.5 text-slate-300">
                <span className="text-xs font-semibold">From:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2.5 py-1 bg-[#0b0c20] border border-indigo-500/30 rounded-lg text-xs text-white outline-none focus:border-indigo-400"
                />
              </label>
              <label className="flex items-center gap-1.5 text-slate-300">
                <span className="text-xs font-semibold">To:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2.5 py-1 bg-[#0b0c20] border border-indigo-500/30 rounded-lg text-xs text-white outline-none focus:border-indigo-400"
                />
              </label>
              {(customStartDate || customEndDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomStartDate('');
                    setCustomEndDate('');
                  }}
                  className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors"
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
        className="rounded-2xl border border-indigo-500/15 bg-card/60 p-4 text-xs text-slate-400 backdrop-blur-sm"
      >
        <h2 className="font-bold text-white text-sm">
          {t('LIBRARY_DATA_PENDING_TITLE')}
        </h2>
        <p className="mt-1 leading-relaxed">{t('LIBRARY_DATA_PENDING_DESCRIPTION')}</p>
      </aside>
    </div>
  );
}
