'use client';
/** Responsibility: Superadmin Dashboard Recent Libraries Table; displays recent tenant registrations with plan/status badges, avatar chips, and action links. */
import type { SemanticCellParams as ICellRendererParams, SemanticColumnDef as ColDef } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewSemanticTable';
import SuperadminDashboardOverviewSemanticTable from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewSemanticTable';
import { useMemo } from 'react';
import Link from 'next/link';
import type { SuperadminDashboardRecentLibrariesTableProps, SuperadminDashboardRecentLibrary as Library } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { ExternalLink, Building2 } from 'lucide-react';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config";
import { useTranslations } from 'next-intl';

const PLAN_STYLES: Record<string, string> = {
  Enterprise: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  Pro:        'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  Starter:    'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Basic:      'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

const STATUS_STYLES: Record<string, { badge: string; dot?: string; label: string }> = {
  active: {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
    label: 'Active',
  },
  setup: {
    badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    dot: 'bg-sky-400',
    label: 'In Setup',
  },
  inactive: {
    badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    dot: 'bg-rose-400',
    label: 'Inactive',
  },
};

/**
 * Performs the superadmin dashboard overview recent libraries table operation within dashboard overview.
 */
export default function SuperadminDashboardOverviewRecentLibrariesTable({ data }: SuperadminDashboardRecentLibrariesTableProps) {
  const t = useTranslations('SUPERADMIN_DASHBOARD');

  const colDefs = useMemo<ColDef<Library>[]>(() => [
    {
      headerName: t('COPY.LIBRARY'),
      field: 'name',
      flex: 2,
      minWidth: 180,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shrink-0 shadow-xs">
            {p.data?.initials}
          </div>
          <div>
            <span className="font-semibold text-white text-sm block leading-tight">{p.data?.name}</span>
            {p.data?.city && <span className="text-[11px] text-slate-400 block mt-0.5">{p.data.city}</span>}
          </div>
        </div>
      ),
    },
    {
      headerName: t('COPY.OWNER'),
      field: 'owner',
      flex: 1.5,
      minWidth: 140,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        <span className="text-slate-200 text-xs sm:text-sm font-medium">{p.data?.owner}</span>
      ),
    },
    {
      headerName: 'Branches',
      field: 'branches' as keyof Library,
      flex: 1.1,
      minWidth: 120,
      cellRenderer: (p: ICellRendererParams<Library>) => {
        const count = p.data?.branches ?? 1;
        return (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              <Building2 size={12} className="text-indigo-400" />
              <span>{count} {count > 1 ? 'Branches' : 'Branch'}</span>
            </span>
          </div>
        );
      },
    },
    {
      headerName: t('COPY.STUDENTS'),
      field: 'students',
      flex: 0.9,
      minWidth: 100,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        <span className="font-bold text-white text-xs sm:text-sm">{p.data?.students?.toLocaleString() ?? 0} seats</span>
      ),
    },
    {
      headerName: t('COPY.PLAN'),
      field: 'plan',
      flex: 0.8,
      minWidth: 100,
      cellRenderer: (p: ICellRendererParams<Library>) => {
        const plan = p.data?.plan ?? 'Basic';
        const cls = PLAN_STYLES[plan] ?? PLAN_STYLES.Basic;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border uppercase tracking-wider ${cls}`}>
            {plan}
          </span>
        );
      },
    },
    {
      headerName: t('COPY.STATUS'),
      field: 'status',
      flex: 0.9,
      minWidth: 110,
      cellRenderer: (p: ICellRendererParams<Library>) => {
        const status = p.data?.status ?? 'inactive';
        const config = STATUS_STYLES[status] ?? STATUS_STYLES.inactive;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
            <span>{config.label}</span>
          </span>
        );
      },
    },
    {
      headerName: t('COPY.JOINED'),
      field: 'joinedAt',
      flex: 0.9,
      minWidth: 100,
      cellRenderer: (p: ICellRendererParams<Library>) => {
        const value = p.data?.joinedAt ?? '';
        if (value === '2 hours ago') return <span className="text-xs text-slate-400">{t('COPY.TWO_HOURS_AGO')}</span>;
        if (value === '3 days ago') return <span className="text-xs text-slate-400">{t('COPY.THREE_DAYS_AGO')}</span>;
        if (value === '1 week ago') return <span className="text-xs text-slate-400">{t('COPY.ONE_WEEK_AGO')}</span>;
        if (value === '2 weeks ago') return <span className="text-xs text-slate-400">{t('COPY.TWO_WEEKS_AGO')}</span>;
        if (value === '1 month ago') return <span className="text-xs text-slate-400">{t('COPY.ONE_MONTH_AGO')}</span>;
        return <span className="text-xs text-slate-400">{value || t('COPY.ILLUSTRATIVE_TIME')}</span>;
      },
    },
    {
      headerName: 'Action',
      field: 'name',
      flex: 0.8,
      minWidth: 90,
      sortable: false,
      filter: false,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        <Link
          href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.LIBRARIES}
          className="inline-flex min-h-8 px-2.5 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 transition-all shadow-xs"
          title={`Manage ${p.data?.name}`}
        >
          <span>Manage</span>
        </Link>
      ),
    },
  ], [t]);

  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md overflow-hidden">
      {/* Table Header */}
      <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30">
            <Building2 size={18} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Recent Library Accounts</h2>
            <p className="text-xs text-slate-400">Newly onboarded tenant partners</p>
          </div>
        </div>

        <Link
          href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.LIBRARIES}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 transition-all shadow-sm active:scale-95 cursor-pointer"
          data-testid="superadmin-dashboard-dashboard_overview-link-1"
        >
          <span>{t("COPY.VIEW_ALL")}</span>
          <ExternalLink size={13} className="text-indigo-400" />
        </Link>
      </div>

      {/* Semantic Table */}
      <div className="sa-dashboard-recent-libraries-chart">
        <SuperadminDashboardOverviewSemanticTable<Library>
          rowData={data}
          columnDefs={colDefs}
          rowHeight={54}
          headerHeight={46}
          suppressCellFocus={true}
          suppressPaginationPanel={true}
        />
      </div>
    </div>
  );
}
