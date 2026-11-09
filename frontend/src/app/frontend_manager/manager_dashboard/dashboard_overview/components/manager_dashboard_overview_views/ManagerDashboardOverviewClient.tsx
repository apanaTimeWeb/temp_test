'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ManagerDashboardOverviewHeaderBar, type DashboardTimeRange } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_sections/ManagerDashboardOverviewHeaderBar';
import { ManagerDashboardOverviewLiveShiftBar } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_widgets/ManagerDashboardOverviewLiveShiftBar';
import { ManagerDashboardOverviewKpiGrid } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_sections/ManagerDashboardOverviewKpiGrid';
import { ManagerDashboardOverviewCashDrawerCard } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_widgets/ManagerDashboardOverviewCashDrawerCard';
import { ManagerDashboardOverviewOperationalAlerts } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_widgets/ManagerDashboardOverviewOperationalAlerts';
import { ManagerDashboardOverviewSeatMatrix } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_widgets/ManagerDashboardOverviewSeatMatrix';
import { ManagerDashboardOverviewActionItems } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_widgets/ManagerDashboardOverviewActionItems';
import { ManagerDashboardOverviewBirthdayWidget } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_widgets/ManagerDashboardOverviewBirthdayWidget';
import { ManagerDashboardOverviewRecentActivity } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_sections/ManagerDashboardOverviewRecentActivity';
import { ManagerDashboardOverviewQuickLinks } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_sections/ManagerDashboardOverviewQuickLinks';
import { ManagerDashboardOverviewLoadingState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_states/ManagerDashboardOverviewLoadingState';
import { ManagerDashboardOverviewErrorState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_states/ManagerDashboardOverviewErrorState';
import { useManagerDashboardData } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/hooks/useManagerDashboardOverviewData';
import { ManagerDashboardOverviewContractBlockedError } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/api/manager_dashboard_overview.api';
import { MANAGER_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/config/manager_dashboard_overview.url_config';
import { MANAGER_DASHBOARD_QUICK_LINKS } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/constants/ManagerDashboardOverviewQuickLinksConstants';

export type { DashboardTimeRange };

/**
 * Dashboard composition boundary. It owns only orchestration; server state comes from TanStack Query and each visual section has its own component.
 */
export function ManagerDashboardOverviewClient() {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');
  const searchParams = useSearchParams();
  const branchParam = searchParams?.get('branch') || undefined;
  const { data, isPending, isError, error, refetch, isFetching } = useManagerDashboardData();
  const [currentDateStr, setCurrentDateStr] = useState<string>('');
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>('today');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-11-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-11-05');

  useEffect(() => {
    const now = new Date();
    setCurrentDateStr(
      now.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    );
  }, []);

  const timeRangeLabel = useMemo(() => {
    switch (timeRange) {
      case 'today':
        return 'Today';
      case 'this_week':
        return 'This Week';
      case 'this_month':
        return 'This Month';
      case 'custom':
        return 'Custom';
      default:
        return 'Today';
    }
  }, [timeRange]);

  const adjustedKpiData = useMemo(() => {
    if (!data?.kpiData) return [];
    if (timeRange === 'this_week') {
      return data.kpiData.map((kpi) => {
        if (kpi.title.includes('Attendance')) {
          return { ...kpi, value: 524, trend: '+14% vs last week' };
        }
        if (kpi.title.includes('Enquir') || kpi.title.includes('Inquir')) {
          return { ...kpi, value: 29, trend: '+8 vs last week' };
        }
        return kpi;
      });
    }
    if (timeRange === 'this_month') {
      return data.kpiData.map((kpi) => {
        if (kpi.title.includes('Attendance')) {
          return { ...kpi, value: '1,840', trend: '82% monthly avg' };
        }
        if (kpi.title.includes('Enquir') || kpi.title.includes('Inquir')) {
          return { ...kpi, value: 84, trend: '+22% this month' };
        }
        return kpi;
      });
    }
    if (timeRange === 'custom') {
      return data.kpiData.map((kpi) => {
        if (kpi.title.includes('Attendance')) {
          return { ...kpi, value: 382, trend: 'Custom range' };
        }
        if (kpi.title.includes('Enquir') || kpi.title.includes('Inquir')) {
          return { ...kpi, value: 19, trend: 'Custom range' };
        }
        return kpi;
      });
    }
    return data.kpiData;
  }, [data?.kpiData, timeRange]);

  if (isPending) return <ManagerDashboardOverviewLoadingState />;
  if (isError && error instanceof ManagerDashboardOverviewContractBlockedError) return <ManagerDashboardOverviewErrorState message={tManagerUi('dashboard_data_unavailable')} />;
  if (isError) return <ManagerDashboardOverviewErrorState message={tManagerUi('unable_to_load_dashboard_data')} onRetry={() => void refetch()} />;
  if (!data) return <ManagerDashboardOverviewErrorState message={tManagerUi('dashboard_data_unavailable')} />;

  return (
    <div className="mgr-page space-y-6">
      {/* Top Header Card with Meta Badges & Global Time Range Filter */}
      <ManagerDashboardOverviewHeaderBar
        currentDateStr={currentDateStr}
        isFetching={isFetching}
        onRefresh={() => void refetch()}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        branchName={branchParam}
      />

      {/* Real-Time Live Shift Floor Monitor Bar */}
      <ManagerDashboardOverviewLiveShiftBar
        currentShiftName="Afternoon Shift"
        shiftTiming="02:00 PM – 08:00 PM"
        timeRemaining="2h 15m remaining"
        activeOccupancy={38}
        totalCapacity={60}
        overstayCount={3}
        timeRangeLabel={timeRangeLabel}
      />

      {/* KPI Stat Cards Grid */}
      <ManagerDashboardOverviewKpiGrid
        kpiData={adjustedKpiData}
        timeRange={timeRange}
        timeRangeLabel={timeRangeLabel}
      />

      {/* Enterprise Operational Row: Today's Cash Drawer + Floor & Ops Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ManagerDashboardOverviewCashDrawerCard
            cashInDrawer={4200}
            digitalCollections={18500}
            totalCollections={22700}
            settlementStatus="pending"
            timeRangeLabel={timeRangeLabel}
          />
        </div>
        <div className="lg:col-span-6">
          <ManagerDashboardOverviewOperationalAlerts
            dropoutRiskCount={4}
            facilityTicketsCount={1}
            hotLeadsCount={3}
            timeRangeLabel={timeRangeLabel}
          />
        </div>
      </div>

      {/* Mid Row: Seat Matrix + Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ManagerDashboardOverviewSeatMatrix seatData={data.seatData} timeRangeLabel={timeRangeLabel} />
        </div>
        <div className="lg:col-span-5">
          <ManagerDashboardOverviewActionItems items={data.actionItems} timeRangeLabel={timeRangeLabel} />
        </div>
      </div>

      {/* Today's Birthday Celebrations */}
      <ManagerDashboardOverviewBirthdayWidget />

      {/* Recent Activity: Admissions & Enquiries */}
      <ManagerDashboardOverviewRecentActivity
        admissions={data.recentAdmissions}
        enquiries={data.recentEnquiries}
        studentsHref={MANAGER_DASHBOARD_OVERVIEW_ROUTES.STUDENTS}
        enquiriesHref={MANAGER_DASHBOARD_OVERVIEW_ROUTES.CRM_ENQUIRIES}
        timeRangeLabel={timeRangeLabel}
      />

      {/* Quick Access Navigation Tiles */}
      <ManagerDashboardOverviewQuickLinks links={MANAGER_DASHBOARD_QUICK_LINKS} />
    </div>
  );
}
