'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BarChart3, Clock, CalendarRange, RotateCw, Download, MapPin, Sparkles } from 'lucide-react';
import { ManagerDashboardReportsKpiGrid } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_sections/ManagerDashboardReportsKpiGrid';
import { ManagerDashboardReportsChartsGrid } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_charts/ManagerDashboardReportsChartsGrid';
import { ManagerDashboardReportsTablesGrid } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_table_parts/ManagerDashboardReportsTablesGrid';
import { MANAGER_REPORTS_DATE_RANGES } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/constants/ManagerDashboardReportsConstants';
import { useManagerReports } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/hooks/useManagerDashboardReports';
import { ManagerDashboardReportsContractBlockedError } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/api/manager_dashboard_reports.api';
import type { ManagerDashboardReportsDateRange } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';

export default function ManagerDashboardReportsPage() {
  const tManagerUi = useTranslations('manager.manager_reports.ui');
  const [dateRange, setDateRange] = useState<ManagerDashboardReportsDateRange>('This Month');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-10-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-10-31');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const query = useManagerReports(dateRange);

  const activeDateScope = isCustomMode ? 'Custom Range' : dateRange;

  const handleExportCsv = () => {
    if (!query.data) return;
    const headers = `Report Scope: ${activeDateScope}\nReport Metric,Value,Trend\n`;
    const rows = query.data.kpiCards.map((c) => `"${c.title}","${c.value}","${c.trend || ''}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manager_reports_${activeDateScope.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (query.isPending) {
    return (
      <div className="mgr-page mgr-reports-theme" role="status" aria-live="polite" aria-busy="true">
        <span className="sr-only">{tManagerUi('loading_reports')}</span>
        <div aria-hidden="true" className="motion-safe:animate-pulse motion-reduce:animate-none space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="mgr-skeleton mgr-skeleton-title h-8 w-48 mb-2" />
            <div className="mgr-skeleton mgr-skeleton-line h-4 w-72" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-card p-5 h-32 flex flex-col justify-between">
                <div className="mgr-skeleton mgr-skeleton-line h-4 w-24" />
                <div className="mgr-skeleton mgr-skeleton-value h-8 w-32" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 h-64" />
            <div className="rounded-2xl border border-border bg-card p-6 h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (query.isError) {
    const contractBlocked = query.error instanceof ManagerDashboardReportsContractBlockedError;
    return (
      <div
        className="mgr-page-state mgr-reports-theme p-8 text-center"
        role={contractBlocked ? 'status' : 'alert'}
        data-testid="manager-reports-contract-state"
      >
        <p className="mgr-page-subtitle text-danger font-semibold text-base">
          {contractBlocked ? tManagerUi('reports_api_contract_not_supplied') : tManagerUi('unable_to_load_reports')}
        </p>
        {!contractBlocked && (
          <button
            type="button"
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover shadow-xs transition-all"
            onClick={() => void query.refetch()}
          >
            {tManagerUi('retry')}
          </button>
        )}
      </div>
    );
  }

  const data = query.data;
  if (!data) {
    return (
      <div className="mgr-page-state mgr-reports-theme p-8 text-center" role="status">
        {tManagerUi('no_report_data_available')}
      </div>
    );
  }

  const hasReportData =
    data.kpiCards.length +
    data.occupancyData.length +
    data.growthData.length +
    data.attendanceData.length +
    data.absenteesChartData.length +
    data.complaintsData.length +
    data.absenteeRows.length +
    data.conversionRows.length +
    data.seatRows.length +
    data.lockerRows.length +
    data.maintenanceRows.length >
    0;

  return (
    <div className="mgr-page mgr-reports-theme space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mgr-breadcrumb">{tManagerUi('manager_reports')}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                <BarChart3 size={11} />
                Analytics Engine
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-highlight text-muted-foreground border border-border">
                <MapPin size={11} className="text-primary" />
                Central Branch
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {tManagerUi('reports')}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {tManagerUi('operational_overview_finance_reports_blocked')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => void query.refetch()}
              disabled={query.isFetching}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-surface-hover hover:border-primary/50 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              title="Refresh reports data"
            >
              <RotateCw size={13} className={query.isFetching ? 'animate-spin text-primary' : 'text-muted-foreground'} />
              <span>{query.isFetching ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border hover:border-primary/50 text-foreground text-xs font-bold hover:bg-surface-hover shadow-xs transition-all cursor-pointer"
            >
              <Download size={14} className="text-primary" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Global Time Horizon Segmented Filter Bar */}
        <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock size={13} className="text-primary" />
              {tManagerUi('date_range')}:
            </span>
            <div className="inline-flex items-center rounded-xl bg-surface-highlight/40 border border-border p-1 gap-1">
              {MANAGER_REPORTS_DATE_RANGES.map((range) => {
                const isSelected = !isCustomMode && dateRange === range;
                const label =
                  range === 'This Week'
                    ? tManagerUi('range_this_week')
                    : range === 'This Month'
                      ? tManagerUi('range_this_month')
                      : tManagerUi('range_last_30_days');

                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => {
                      setIsCustomMode(false);
                      setDateRange(range);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${isCustomMode
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                  }`}
              >
                <CalendarRange size={13} />
                <span>Custom Range</span>
              </button>
            </div>

            {/* Hidden native select to preserve any legacy/form test runners */}
            <select
              id="manager-reports-date-range"
              className="sr-only"
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value as ManagerDashboardReportsDateRange)}
            >
              {MANAGER_REPORTS_DATE_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          {isCustomMode ? (
            <div className="flex items-center gap-2 bg-card border border-primary/30 p-1.5 rounded-xl text-xs shadow-xs animate-in fade-in duration-200">
              <span className="text-muted-foreground font-medium pl-1">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="rounded-lg bg-surface-highlight border border-border px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-muted-foreground font-medium">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="rounded-lg bg-surface-highlight border border-border px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ) : (
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Analyzing all shifts and modules for {dateRange.toLowerCase()}</span>
            </div>
          )}
        </div>
      </div>

      {!hasReportData ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center" role="status">
          <p className="text-sm text-muted-foreground">{tManagerUi('no_report_data_available')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <ManagerDashboardReportsKpiGrid cards={data.kpiCards} dateRange={activeDateScope} />
          <ManagerDashboardReportsChartsGrid data={data} />
          <ManagerDashboardReportsTablesGrid data={data} />
        </div>
      )}
    </div>
  );
}
