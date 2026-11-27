'use client';

import { ButtonLoader,LibraryLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { ManagerDashboardReportsContractBlockedError } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/api/manager_dashboard_reports.api';
import { ManagerDashboardReportsChartsGrid } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_charts/ManagerDashboardReportsChartsGrid';
import { ManagerDashboardReportsKpiGrid } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_sections/ManagerDashboardReportsKpiGrid';
import { ManagerDashboardReportsTablesGrid } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_table_parts/ManagerDashboardReportsTablesGrid';
import { MANAGER_REPORTS_DATE_RANGES } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/constants/ManagerDashboardReportsConstants';
import { useManagerReports } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/hooks/useManagerDashboardReports';
import type { ManagerDashboardReportsDateRange } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';
import { exportManagerDashboardReportsCsv } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/utils/ManagerDashboardReportsCsvExport';
import { CalendarRange, Clock, Download, Printer, RotateCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ManagerDashboardReportsPage() {
  const tManagerUi = useTranslations('manager.manager_reports.ui');
  const [dateRange, setDateRange] = useState<ManagerDashboardReportsDateRange>('This Month');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-10-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-10-31');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const query = useManagerReports(dateRange);

  const activeDateScope = isCustomMode ? 'Custom Range' : dateRange;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportCsv = () => {
    if (!query.data) return;
    exportManagerDashboardReportsCsv(query.data, activeDateScope);
  };

  if (query.isPending) {
    return (
      <div className="mgr-page mgr-reports-theme flex items-center justify-center min-h-[50vh]" role="status" aria-live="polite" aria-busy="true">
        <LibraryLoader size="md" icon="chart-bar" variant="default" />
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
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover shadow-xs transition-all inline-flex items-center gap-1.5"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            {query.isFetching ? <ButtonLoader icon="chart-bar" /> : null}
            <span>{tManagerUi('retry')}</span>
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
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Analytics Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Branch Performance & Reports
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Shift-wise attendance trends, student retention, and branch operational performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 mgr-reports-no-print">
            <button
              type="button"
              onClick={() => void query.refetch()}
              disabled={query.isFetching}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-surface-hover hover:border-primary transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              title="Refresh reports data"
            >
              {query.isFetching ? <ButtonLoader icon="chart-bar" /> : <RotateCw size={13} className="text-muted-foreground" />}
              <span>{query.isFetching ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border hover:border-primary text-foreground text-xs font-bold hover:bg-surface-hover shadow-xs transition-all cursor-pointer"
              title="Download comprehensive multi-table spreadsheet (.csv)"
            >
              <Download size={14} className="text-primary" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-sm shadow-indigo-950/40 transition-all cursor-pointer"
              title="Print formatted executive summary or Save as PDF"
            >
              <Printer size={14} />
              <span>Print / Export PDF</span>
            </button>
          </div>
        </div>

        {/* Global Time Horizon Segmented Filter Bar */}
        <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock size={13} className="text-primary" />
              {tManagerUi('date_range')}:
            </span>
            <div className="inline-flex items-center rounded-xl bg-surface-highlight border border-border p-1 gap-1">
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
            <div className="flex items-center gap-2 bg-card border border-primary p-1.5 rounded-xl text-xs shadow-xs animate-in fade-in duration-200">
              <span className="text-muted-foreground font-medium pl-1">From:</span>
              <input maxLength={100}
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="rounded-lg bg-surface-highlight border border-border px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-muted-foreground font-medium">To:</span>
              <input maxLength={100}
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
          <ManagerDashboardReportsChartsGrid data={data} dateRange={activeDateScope} />
          <ManagerDashboardReportsTablesGrid data={data} dateRange={activeDateScope} />
        </div>
      )}
    </div>
  );
}
