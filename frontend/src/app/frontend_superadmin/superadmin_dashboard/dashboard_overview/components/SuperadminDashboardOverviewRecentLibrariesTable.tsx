'use client';
/** Responsibility: Superadmin Dashboard Recent Libraries Table; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminDashboardOverviewRecentLibrariesTable formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import type { SemanticCellParams as ICellRendererParams } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewSemanticTable';
import SuperadminDashboardOverviewSemanticTable from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewSemanticTable';

import { useMemo } from 'react';
import Link from 'next/link';
import type { SemanticColumnDef as ColDef } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewSemanticTable';
import type { SuperadminDashboardRecentLibrariesTableProps } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { ExternalLink } from 'lucide-react';


import type { SuperadminDashboardRecentLibrary as Library } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES as __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config";
import { useTranslations } from 'next-intl';
import { SUPERADMIN_DASHBOARD_LIBRARY_STATUS_CONFIG } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewStatusConstants';
import { SUPERADMIN_DASHBOARD_RECENT_LIBRARIES_TABLE_PLAN_CLS } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewStaticConstants';







/**
 * Performs the superadmin dashboard overview recent libraries table operation within dashboard overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminDashboardRecentLibrariesTableProps.
 */
export default function SuperadminDashboardOverviewRecentLibrariesTable({ data }: SuperadminDashboardRecentLibrariesTableProps) {
  const t = useTranslations('SUPERADMIN_DASHBOARD');

  const colDefs = useMemo<ColDef[]>(() => [
    {
      headerName: t('COPY.LIBRARY'), field: 'name', flex: 2, minWidth: 180,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        <div className="flex items-center gap-3">
          <div className="sa-avatar-cell">
            {p.data?.initials}
          </div>
          <span className="font-medium text-primary text-sm">{p.data?.name}</span>
        </div>
      ),
    },
    { headerName: t('COPY.OWNER'), field: 'owner', flex: 1.5, minWidth: 130,
      cellClass: () => 'sa-cell-muted' },
    {
      headerName: t('COPY.STUDENTS'), field: 'students', flex: 0.8, minWidth: 90,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        <span className="font-bold text-primary">{p.data?.students}</span>
      ),
    },
    {
      headerName: t('COPY.PLAN'), field: 'plan', flex: 0.8, minWidth: 100,
      cellRenderer: (p: ICellRendererParams<Library>) => {
        const cls = SUPERADMIN_DASHBOARD_RECENT_LIBRARIES_TABLE_PLAN_CLS[p.data?.plan ?? ''] ?? 'sa-badge--info';
        return <span className={`sa-badge ${cls} text-xs uppercase tracking-tight`}>{p.data?.plan}</span>;
      },
    },
    {
      headerName: t('COPY.STATUS'), field: 'status', flex: 0.9, minWidth: 100,
      cellRenderer: (p: ICellRendererParams<Library>) => {
        const s = SUPERADMIN_DASHBOARD_LIBRARY_STATUS_CONFIG[p.data?.status ?? 'inactive'];
        return <span className={`sa-badge ${s.cls} text-xs uppercase tracking-tight`}>{t(s.labelKey)}</span>;
      },
    },
    { headerName: t('COPY.JOINED'), field: 'joinedAt', flex: 0.9, minWidth: 100,
      cellRenderer: (p: ICellRendererParams<Library>) => { const value = p.data?.joinedAt ?? ''; if (value === '2 hours ago') return t('COPY.TWO_HOURS_AGO'); if (value === '3 days ago') return t('COPY.THREE_DAYS_AGO'); if (value === '1 week ago') return t('COPY.ONE_WEEK_AGO'); if (value === '2 weeks ago') return t('COPY.TWO_WEEKS_AGO'); if (value === '1 month ago') return t('COPY.ONE_MONTH_AGO'); return t('COPY.ILLUSTRATIVE_TIME'); } },
  ], [t]);

  return (
    <div className="sa-card overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-border">
        <h2 className="text-base font-bold text-primary">{t("COPY.RECENTLY_REGISTERED_LIBRARIES")}</h2>
        <Link href={__SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.LIBRARIES} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline" data-testid="superadmin-dashboard-dashboard_overview-link-1">
          {t("COPY.VIEW_ALL")} <ExternalLink size={12} />
        </Link>
      </div>
      <div className="sa-dashboard-recent-libraries-chart">
        <SuperadminDashboardOverviewSemanticTable
         
          rowData={data}
          columnDefs={colDefs}
          rowHeight={52}
          headerHeight={44}
          suppressCellFocus={true}
          suppressPaginationPanel={true}
        />
      </div>
    </div>
  );
}
