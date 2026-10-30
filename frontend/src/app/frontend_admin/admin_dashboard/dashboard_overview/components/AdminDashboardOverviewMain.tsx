// RESPONSIBILITY: Owns the AdminDashboardOverviewMain presentation responsibility for the dashboard_overview module. It does not own cross-module business logic or API transport.
import Link from 'next/link';
import { Armchair, Users, WalletCards, Building2, TrendingUp, BarChart2, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_admin/admin_dashboard/dashboard_overview/config/admin_dashboard_overview.url_config';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';

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

const BRANCH_METRICS: Record<string, { branches: string; branchesSub: string; members: string; membersSub: string; occupancy: string; occupancySub: string; revenue: string; revenueSub: string; }> = {
  all: {
    branches: '3',
    branchesSub: 'All network branches active',
    members: '1,248',
    membersSub: 'Across all 3 branches',
    occupancy: '84.2%',
    occupancySub: 'Peak shift utilization',
    revenue: '₹4,82,500',
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
  const metrics = BRANCH_METRICS[selectedBranchId] ?? BRANCH_METRICS.all;

  const executiveKpis = [
    {
      id: 'kpi-branches',
      title: 'Operating Branches',
      value: metrics.branches,
      subtext: metrics.branchesSub,
      Icon: Building2,
      trend: selectedBranchId === 'all' ? '+1 this quarter' : 'Branch Active',
    },
    {
      id: 'kpi-members',
      title: 'Active Members',
      value: metrics.members,
      subtext: metrics.membersSub,
      Icon: Users,
      trend: '+12% vs last month',
    },
    {
      id: 'kpi-occupancy',
      title: 'Seat Occupancy',
      value: metrics.occupancy,
      subtext: metrics.occupancySub,
      Icon: Armchair,
      trend: 'Optimal capacity',
    },
    {
      id: 'kpi-revenue',
      title: 'Monthly Collections',
      value: metrics.revenue,
      subtext: metrics.revenueSub,
      Icon: WalletCards,
      trend: '96% on-time fee recovery',
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 text-text-primary sm:p-6 lg:p-8">
      <header className="border-b border-border pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {t('LIBRARY_OVERVIEW_EYEBROW')}
        </p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              {t('LIBRARY_OVERVIEW_TITLE')}
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-text-secondary">
              {t('LIBRARY_OVERVIEW_DESCRIPTION')}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-secondary/10 text-text-secondary border border-border">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                Branch Scope: <strong className="text-text-primary font-semibold">{selectedBranch ? `${selectedBranch.name} (${selectedBranch.code})` : 'All Branches (Network View)'}</strong>
              </span>
            </div>
          </div>
          <Link
            href={ADMIN_ROUTES.DASHBOARD_REPORTS}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-text-primary shadow-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <BarChart2 className="h-4 w-4 text-text-secondary" aria-hidden="true" />
            <span>{t('VIEW_FULL_REPORTS')}</span>
            <ArrowRight className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* Executive Multi-Branch Overview KPI Cards */}
      <section
        aria-label={t('KPI_SECTION_LABEL')}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {executiveKpis.map((kpi) => {
          const KpiIcon = kpi.Icon;
          return (
            <article
              key={kpi.id}
              className="rounded-xl border border-border bg-card p-4 shadow-2xs transition-shadow hover:shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">{kpi.title}</span>
                <span className="rounded-md bg-secondary/10 p-1.5 text-text-secondary">
                  <KpiIcon className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-text-primary">{kpi.value}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
                <span>{kpi.subtext}</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{kpi.trend}</span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Core Operational Workspace Hubs */}
      <section
        aria-label={t('LIBRARY_DESTINATIONS')}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {destinations.map(({ key, Icon, href }) => (
          <article
            key={key}
            className="rounded-xl border border-border bg-card p-5"
          >
            <Icon className="h-6 w-6 text-text-secondary" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold">
              {t(`LIBRARY_${key}_TITLE`)}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {t(`LIBRARY_${key}_UNAVAILABLE`)}
            </p>
            <Link
              href={href}
              className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-border px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t('LIBRARY_OPEN_DESTINATION')}
            </Link>
          </article>
        ))}
      </section>

      <aside
        role="status"
        className="rounded-xl border border-border bg-card p-4 text-sm text-text-secondary"
      >
        <h2 className="font-semibold text-text-primary">
          {t('LIBRARY_DATA_PENDING_TITLE')}
        </h2>
        <p className="mt-1">{t('LIBRARY_DATA_PENDING_DESCRIPTION')}</p>
      </aside>
    </main>
  );
}
