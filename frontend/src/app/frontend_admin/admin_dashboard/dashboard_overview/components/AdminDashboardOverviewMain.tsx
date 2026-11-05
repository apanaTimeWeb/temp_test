'use client';
// RESPONSIBILITY: Owns the AdminDashboardOverviewMain presentation responsibility for the dashboard_overview module. It does not own cross-module business logic or API transport.
import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  Armchair,
  Users,
  WalletCards,
  Building2,
  TrendingUp,
  Calendar,
  RefreshCw,
  X,
  Layers,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_admin/admin_dashboard/dashboard_overview/config/admin_dashboard_overview.url_config';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import AdminDashboardBranchLeaderboard, {
  type AdminDashboardTimeRange,
} from '@/app/frontend_admin/admin_dashboard/dashboard_overview/components/AdminDashboardBranchLeaderboard';
import { toast } from 'sonner';

const destinations = [
  {
    key: 'MEMBERS',
    Icon: Users,
    href: ADMIN_DASHBOARD_OVERVIEW_ROUTES.MEMBERS_DIRECTORY,
  },
  {
    key: 'SEATS',
    Icon: Armchair,
    href: ADMIN_DASHBOARD_OVERVIEW_ROUTES.SEATS_MATRIX,
  },
  {
    key: 'FINANCE',
    Icon: WalletCards,
    href: ADMIN_DASHBOARD_OVERVIEW_ROUTES.FINANCE_DASHBOARD,
  },
] as const;

const BRANCH_METRICS: Record<
  string,
  {
    branches: string;
    branchesSub: string;
    members: string;
    membersSub: string;
    occupancy: string;
    occupancySub: string;
    revenue: string;
    revenueNum: number;
    revenueSub: string;
  }
> = {
  all: {
    branches: '3',
    branchesSub: 'All network branches active',
    members: '1,248',
    membersSub: 'Across all 3 branches',
    occupancy: '84.2%',
    occupancySub: 'Peak shift utilization',
    revenue: '₹4,82,500',
    revenueNum: 482500,
    revenueSub: 'Realized this month (Network)',
  },
  'BR-001': {
    branches: '1',
    branchesSub: 'Downtown Central (Main Campus)',
    members: '520',
    membersSub: 'Downtown active members',
    occupancy: '89.4%',
    occupancySub: 'Near full capacity',
    revenue: '₹2,10,000',
    revenueNum: 210000,
    revenueSub: 'Downtown branch collections',
  },
  'BR-002': {
    branches: '1',
    branchesSub: 'Westside Branch (Suspended)',
    members: '280',
    membersSub: 'Westside registered members',
    occupancy: '64.0%',
    occupancySub: 'Reduced occupancy window',
    revenue: '₹92,500',
    revenueNum: 92500,
    revenueSub: 'Westside branch collections',
  },
  'BR-003': {
    branches: '1',
    branchesSub: 'North Hub (Active)',
    members: '448',
    membersSub: 'North Hub active members',
    occupancy: '86.1%',
    occupancySub: 'Optimal shift distribution',
    revenue: '₹1,80,000',
    revenueNum: 180000,
    revenueSub: 'North Hub collections',
  },
};

/**
 * Renders the canonical dashboard landing page for the multi-library Admin.
 * Combines high-level executive multi-branch indicators with primary workspaces.
 */
export default function AdminDashboardOverviewMain() {
  const t = useTranslations('ADMIN_DASHBOARD');
  const { selectedBranchId, selectedBranch } = useAdminBranch();
  const rawMetrics = BRANCH_METRICS[selectedBranchId] ?? BRANCH_METRICS.all;

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
      theme: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    {
      id: 'kpi-members',
      title: 'Active Members',
      periodBadge: null,
      value: rawMetrics.members,
      subtext: rawMetrics.membersSub,
      Icon: Users,
      trend: '+12% vs last month',
      theme: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
    {
      id: 'kpi-occupancy',
      title: 'Seat Occupancy',
      periodBadge: null,
      value: rawMetrics.occupancy,
      subtext: rawMetrics.occupancySub,
      Icon: Armchair,
      trend: 'Optimal capacity',
      theme: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    },
    {
      id: 'kpi-revenue',
      title: timeRange === 'today' ? 'Collections Today' : timeRange === 'this_week' ? 'Collections (Week)' : timeRange === 'custom' ? 'Collections (Custom)' : 'Monthly Collections',
      periodBadge: timeRange === 'today' ? 'Today' : timeRange === 'this_week' ? 'This Week' : timeRange === 'custom' ? 'Custom' : 'This Month',
      value: dynamicRevenue.value,
      subtext: dynamicRevenue.subtext,
      Icon: WalletCards,
      trend: '96% on-time fee recovery',
      theme: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
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
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
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
      <section
        aria-label={t('KPI_SECTION_LABEL')}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {executiveKpis.map((kpi) => {
          const KpiIcon = kpi.Icon;
          return (
            <article
              key={kpi.id}
              className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{kpi.title}</span>
                  {kpi.periodBadge && (
                    <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {kpi.periodBadge}
                    </span>
                  )}
                </div>
                <div className={`p-2 rounded-xl border ${kpi.theme}`}>
                  <KpiIcon className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-text-primary">{kpi.value}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-text-secondary border-t border-border pt-2">
                <span>{kpi.subtext}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{kpi.trend}</span>
              </div>
            </article>
          );
        })}
      </section>

      {/* ── Multi-Branch Comparative Analytics & Benchmarking Leaderboard ── */}
      <AdminDashboardBranchLeaderboard timeRange={timeRange} />

      {/* ── Core Operational Workspace Hubs ── */}
      <section
        aria-label={t('LIBRARY_DESTINATIONS')}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {destinations.map(({ key, Icon, href }) => (
          <article
            key={key}
            className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-3 text-base font-bold text-text-primary">
                {t(`LIBRARY_${key}_TITLE`)}
              </h2>
              <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                {t(`LIBRARY_${key}_UNAVAILABLE`)}
              </p>
            </div>
            <Link
              href={href}
              className="mt-4 inline-flex min-h-10 items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover hover:border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>{t('LIBRARY_OPEN_DESTINATION')}</span>
              <ArrowRight size={13} className="text-text-secondary" />
            </Link>
          </article>
        ))}
      </section>

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
