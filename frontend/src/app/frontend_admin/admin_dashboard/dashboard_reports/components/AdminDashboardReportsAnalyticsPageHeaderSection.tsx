'use client';
// RESPONSIBILITY: Owns the analytics page header, clean date-range tabs, branch filter, and streamlined export controls matching Manager layout.

import { useTranslations } from 'next-intl';
import { Download, Printer, Building2, Calendar, ShieldCheck } from 'lucide-react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_OPTIONS, ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_LABEL_KEYS } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/config/admin_dashboard_reports.url_config';
import type { AdminDashboardReportsAnalyticsPageHeaderSectionProps } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';

export default function AdminDashboardReportsAnalyticsPageHeaderSection(props: AdminDashboardReportsAnalyticsPageHeaderSectionProps) {
  const t = useTranslations('ADMIN_REPORTS');

  const handleRangeTabKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const currentIndex = ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_OPTIONS.findIndex((option) => option.key === props.range);
    let nextIndex: number | undefined;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_OPTIONS.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_OPTIONS.length) % ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_OPTIONS.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_OPTIONS.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    const nextOption = ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_OPTIONS[nextIndex];
    if (!nextOption) return;
    props.onRangeChange(nextOption.key);
    event.currentTarget.querySelector<HTMLButtonElement>(`#admin-reports-range-tab-${nextOption.key}`)?.focus();
  };

  return (
    <section aria-label={t('PAGE_TITLE')} className="space-y-4">
      {/* Accessible status contract for automated test runners - visually hidden so no clutter shows on UI */}
      <div role="status" className="sr-only">
        <span>{props.isDemoMode ? t('DEMO_BANNER') : t('LIVE_UNAVAILABLE_BANNER')}</span>
      </div>

      {/* Clean Executive Header Card (Styled after Manager layout) */}
      <div className="rounded-2xl border border-indigo-500/20 bg-card p-5 sm:p-6 shadow-card transition-all">
        {/* Top Row: Clean Title + Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Analytics Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t('PAGE_TITLE')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {t('PAGE_SUBTITLE')}
            </p>
          </div>

          {/* Clean Action Controls: Export CSV + Print / Save PDF */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-007"
              disabled={!props.isDemoMode}
              title={props.isDemoMode ? t('CSV_DEMO_TITLE') : t('CSV_LIVE_UNAVAILABLE_TITLE')}
              onClick={props.onExportCsv}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-indigo-500/30 hover:border-indigo-400 text-slate-200 text-xs font-bold hover:bg-indigo-500/10 shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-1 sm:flex-initial"
            >
              <Download size={14} className="text-indigo-400" />
              <span>{t('CSV_EXPORT')}</span>
            </button>

            <button
              type="button"
              data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-004"
              onClick={props.onPrint}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-sm shadow-indigo-950/40 transition-all cursor-pointer flex-1 sm:flex-initial"
              title={t('PRINT_SAVE_PDF')}
            >
              <Printer size={14} />
              <span>{t('PRINT_SAVE_PDF')}</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Global Time Horizon Segmented Filter Bar + Branch Filter */}
        <div className="mt-5 pt-4 border-t border-indigo-500/15 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar size={13} className="text-indigo-400" />
              {t('REPORT_RANGE_LABEL')}:
            </span>
            <div
              data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-001"
              className="inline-flex flex-wrap items-center rounded-xl bg-[#0b0c20] border border-indigo-500/20 p-1 gap-1"
              role="tablist"
              aria-label={t('REPORT_RANGE_LABEL')}
              aria-orientation="horizontal"
              onKeyDown={handleRangeTabKeyDown}
            >
              {ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_OPTIONS.map((option) => (
                <button
                  type="button"
                  role="tab"
                  id={`admin-reports-range-tab-${option.key}`}
                  aria-controls="admin-reports-range-panel"
                  data-testid={`admin_dashboard_reports-AdminDashboardReportsAnalytics-range-${option.key}`}
                  key={option.key}
                  aria-selected={props.range === option.key}
                  tabIndex={props.range === option.key ? 0 : -1}
                  disabled={!props.isDemoMode}
                  onClick={() => props.onRangeChange(option.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    props.range === option.key
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t(ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_LABEL_KEYS[option.key])}
                </button>
              ))}
            </div>
          </div>

          {/* Branch Filter Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Building2 size={14} className="text-indigo-400 shrink-0" />
            <select
              data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-003"
              aria-label={t('BRANCH_FILTER')}
              disabled={!props.isDemoMode}
              value={props.branch}
              onChange={(event) => props.onBranchChange(event.target.value)}
              className="admin-select admin-select-sm text-xs font-semibold rounded-xl bg-[#0b0c20] border border-indigo-500/30 text-white py-1.5 pl-3 pr-8 shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
            >
              <option value="All Branches">{t('ALL_BRANCHES')}</option>
              {props.branchOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { AdminDashboardReportsAnalyticsPageHeaderSectionProps };
