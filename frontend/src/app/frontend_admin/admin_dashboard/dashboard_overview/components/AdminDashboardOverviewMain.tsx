'use client';
// RESPONSIBILITY: Owns the AdminDashboardOverviewMain presentation responsibility for the dashboard_overview module. It does not own cross-module business logic or API transport.
import AdminDashboardBranchLeaderboard,{
type AdminDashboardTimeRange,
} from '@/app/frontend_admin/admin_dashboard/dashboard_overview/components/AdminDashboardBranchLeaderboard';
import { AdminDashboardOverviewDestinations } from '@/app/frontend_admin/admin_dashboard/dashboard_overview/components/AdminDashboardOverviewDestinations';
import { AdminDashboardOperationsPulse } from '@/app/frontend_admin/admin_dashboard/dashboard_overview/components/AdminDashboardOperationsPulse';
import { AdminDashboardOverviewKpis } from '@/app/frontend_admin/admin_dashboard/dashboard_overview/components/AdminDashboardOverviewKpis';
import {
ADMIN_DASHBOARD_BRANCH_METRICS,
ADMIN_DASHBOARD_DESTINATIONS,
} from '@/app/frontend_admin/admin_dashboard/dashboard_overview/constants/AdminDashboardOverviewConstants';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import {
Armchair,
Building2,
Clock,
CreditCard,
LayoutGrid,
Receipt,
RefreshCw,
Users,
WalletCards,
X
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo,useState } from 'react';
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
      toast.success('Central network dashboard metrics synchronized', { id: 'admin-dashboard-sync-overview' });
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
      theme: 'bg-info-bg text-info-text border border-info',
    },
    {
      id: 'kpi-members',
      title: 'Active Members',
      periodBadge: periodLabel,
      value: rawMetrics.members,
      subtext: rawMetrics.membersSub,
      Icon: Users,
      trend: '+12% vs last month',
      theme: 'bg-success-bg text-success-text border border-success',
    },
    {
      id: 'kpi-occupancy',
      title: 'Seat Occupancy',
      periodBadge: periodLabel,
      value: rawMetrics.occupancy,
      subtext: rawMetrics.occupancySub,
      Icon: Armchair,
      trend: 'Optimal capacity',
      theme: 'bg-primary-subtle text-primary border border-border-focus',
    },
    {
      id: 'kpi-revenue',
      title: timeRange === 'today' ? 'Collections Today' : timeRange === 'this_week' ? 'Collections (Week)' : timeRange === 'custom' ? 'Collections (Custom)' : 'Monthly Collections',
      periodBadge: periodLabel,
      value: dynamicRevenue.value,
      subtext: dynamicRevenue.subtext,
      Icon: WalletCards,
      trend: '96% on-time fee recovery',
      theme: 'bg-warning-bg text-warning-text border border-warning',
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
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card motion-safe:transition-colors space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary">
              {t('LIBRARY_OVERVIEW_TITLE')}
            </h1>
          </div>

          {/* Right Header Fast Action */}
          <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
            <button
              type="button"
              onClick={handleSyncOverview}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 min-h-10 px-4 rounded-xl border border-border bg-primary-subtle text-xs font-bold text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
              title="Sync Central Analytics"
            >
              <RefreshCw size={14} className={isSyncing ? 'motion-safe:animate-spin text-primary' : 'text-primary'} aria-hidden="true" />
              <span>{isSyncing ? 'Syncing...' : 'Sync Central'}</span>
            </button>
          </div>
        </div>

        {/* ── Quick Administrative Actions Strip (Matching Manager Design) ── */}
        <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary mr-1">
              Quick Actions:
            </span>
            <Link
              href={ADMIN_ROUTES.MEMBERS_DIRECTORY}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-bold shadow-card motion-safe:transition-colors cursor-pointer"
            >
              <Users size={13} aria-hidden="true" />
              <span>Members Directory</span>
            </Link>
            <Link
              href={ADMIN_ROUTES.SEATS_MATRIX}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-info-bg text-info-text border border-info hover:opacity-90 text-xs font-semibold motion-safe:transition-opacity cursor-pointer"
            >
              <LayoutGrid size={13} aria-hidden="true" />
              <span>Seat Matrix</span>
            </Link>
            <Link
              href={ADMIN_ROUTES.FINANCE_PAYMENTS}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success-bg text-success-text border border-success hover:opacity-90 text-xs font-semibold motion-safe:transition-opacity cursor-pointer"
            >
              <CreditCard size={13} aria-hidden="true" />
              <span>Finance Collections</span>
            </Link>
            <Link
              href={ADMIN_ROUTES.ACCOUNTS_DAILY_SETTLEMENT}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-bg text-purple border border-border hover:opacity-90 text-xs font-semibold motion-safe:transition-opacity cursor-pointer"
            >
              <Receipt size={13} aria-hidden="true" />
              <span>Daily Settlement</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Global Time Horizon Segmented Pill Bar ── */}
      <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary shrink-0" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Analytics Time Horizon:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented Time Horizon Pills */}
          <div className="inline-flex bg-input p-1 rounded-xl border border-border flex-wrap gap-1">
            {timeHorizonOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTimeRange(opt.id)}
                className={`min-h-8 px-3.5 py-1 text-xs font-bold rounded-lg motion-safe:transition-colors cursor-pointer ${
                  timeRange === opt.id
                    ? 'bg-primary text-on-primary shadow-card'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom Date Range Picker */}
          {timeRange === 'custom' && (
            <div className="flex items-center gap-2 flex-wrap text-xs bg-card p-1.5 rounded-xl border border-border">
              <label className="flex items-center gap-1.5 text-text-secondary">
                <span className="text-xs font-semibold">From:</span>
                <input maxLength={100}
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2.5 py-1 bg-input border border-border rounded-lg text-xs text-text-primary outline-none focus:border-border-focus"
                />
              </label>
              <label className="flex items-center gap-1.5 text-text-secondary">
                <span className="text-xs font-semibold">To:</span>
                <input maxLength={100}
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2.5 py-1 bg-input border border-border rounded-lg text-xs text-text-primary outline-none focus:border-border-focus"
                />
              </label>
              {(customStartDate || customEndDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomStartDate('');
                    setCustomEndDate('');
                  }}
                  className="p-1 text-text-secondary hover:text-danger-text rounded motion-safe:transition-colors"
                  title="Clear custom dates"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Executive Multi-Branch Overview KPI Cards ── */}
      <AdminDashboardOverviewKpis kpis={executiveKpis} sectionLabel={t('KPI_SECTION_LABEL')} />

      {/* ── Network Operations & Action Pulse ── */}
      <AdminDashboardOperationsPulse />

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
        className="sr-only"
      >
        <h2>
          {t('LIBRARY_DATA_PENDING_TITLE')}
        </h2>
        <p>{t('LIBRARY_DATA_PENDING_DESCRIPTION')}</p>
      </aside>
    </div>
  );
}
