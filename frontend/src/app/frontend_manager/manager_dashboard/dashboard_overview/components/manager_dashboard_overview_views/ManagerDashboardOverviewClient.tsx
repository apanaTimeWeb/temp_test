'use client';
import { useTranslations } from 'next-intl';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { ManagerDashboardOverviewKpiGrid } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_sections/ManagerDashboardOverviewKpiGrid';
import { ManagerDashboardOverviewSeatMatrix } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_widgets/ManagerDashboardOverviewSeatMatrix';
import { ManagerDashboardOverviewActionItems } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_widgets/ManagerDashboardOverviewActionItems';
import { ManagerDashboardOverviewBirthdayWidget } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_widgets/ManagerDashboardOverviewBirthdayWidget';
import { ManagerDashboardOverviewRecentActivity } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_sections/ManagerDashboardOverviewRecentActivity';
import { ManagerDashboardOverviewQuickLinks, type ManagerDashboardOverviewQuickLink } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_sections/ManagerDashboardOverviewQuickLinks';
import { ManagerDashboardOverviewLoadingState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_states/ManagerDashboardOverviewLoadingState';
import { ManagerDashboardOverviewErrorState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_states/ManagerDashboardOverviewErrorState';
import { useManagerDashboardData } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/hooks/useManagerDashboardOverviewData';
import { ManagerDashboardOverviewContractBlockedError } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/api/manager_dashboard_overview.api';
import { MANAGER_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/config/manager_dashboard_overview.url_config';
import { MANAGER_DASHBOARD_QUICK_LINKS } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/constants/ManagerDashboardOverviewQuickLinksConstants';



/**
 * Dashboard composition boundary. It owns only orchestration; server state comes from TanStack Query and each visual section has its own component.
 */
export function ManagerDashboardOverviewClient() {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');
  const { data, isPending, isError, error, refetch } = useManagerDashboardData();

  if (isPending) return <ManagerDashboardOverviewLoadingState />;
  if (isError && error instanceof ManagerDashboardOverviewContractBlockedError) return <ManagerDashboardOverviewErrorState message={tManagerUi('dashboard_data_unavailable')} />;
  if (isError) return <ManagerDashboardOverviewErrorState message={tManagerUi('unable_to_load_dashboard_data')} onRetry={() => void refetch()} />;
  if (!data) return <ManagerDashboardOverviewErrorState message={tManagerUi('dashboard_data_unavailable')} />;

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <p className="mgr-breadcrumb">{tManagerUi('manager_dashboard_8ccadd')}</p>
          <h1 className="mgr-page-title">{tManagerUi('manager_dashboard')}</h1>
          <p className="mgr-page-subtitle">{tManagerUi('good_morning_manager_aaj_ka_quick_overview')}</p>
        </div>
        <Link href={MANAGER_DASHBOARD_OVERVIEW_ROUTES.REPORTS} className="mgr-btn-ghost mgr-btn-sm"><TrendingUp size={18} /> {tManagerUi('view_reports')}</Link>
      </div>
      <ManagerDashboardOverviewKpiGrid kpiData={data.kpiData} />
      <div className="mgr-section-gap">
        <ManagerDashboardOverviewBirthdayWidget />
      </div>
      <div className="mgr-dashboard-row2 mgr-section-gap">
        <ManagerDashboardOverviewSeatMatrix seatData={data.seatData} />
        <ManagerDashboardOverviewActionItems items={data.actionItems} />
      </div>
      <ManagerDashboardOverviewRecentActivity admissions={data.recentAdmissions} enquiries={data.recentEnquiries} studentsHref={MANAGER_DASHBOARD_OVERVIEW_ROUTES.STUDENTS} enquiriesHref={MANAGER_DASHBOARD_OVERVIEW_ROUTES.CRM_ENQUIRIES} />
      <ManagerDashboardOverviewQuickLinks links={MANAGER_DASHBOARD_QUICK_LINKS} />
    </div>
  );
}
