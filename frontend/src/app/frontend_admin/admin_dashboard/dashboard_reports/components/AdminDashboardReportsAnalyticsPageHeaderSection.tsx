'use client';
// RESPONSIBILITY: Owns the analytics page header, data-mode notice, date-range tabs, branch filter, and safe export controls.

import { useTranslations } from 'next-intl';
import { Download, FileText, Mail, Printer, BarChart3, Building2, Calendar, ShieldCheck } from 'lucide-react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_OPTIONS, ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_LABEL_KEYS } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/config/admin_dashboard_reports.url_config';
import type { AdminDashboardReportsAnalyticsRange } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';
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
      {props.isDemoMode ? (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3.5 text-xs font-medium text-blue-700 dark:text-blue-300 shadow-sm backdrop-blur-sm">
          <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>{t('DEMO_BANNER')}</span>
        </div>
      ) : (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs font-medium text-amber-700 dark:text-amber-300 shadow-sm backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span>{t('LIVE_UNAVAILABLE_BANNER')}</span>
        </div>
      )}

      {/* Executive Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-surface to-surface-elevated p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <BarChart3 className="h-3.5 w-3.5" />
                {t('BREADCRUMB')}
              </span>
              <span className="text-xs text-text-muted">• Executive Reporting Suite</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('PAGE_TITLE')}</h1>
            <p className="text-sm text-text-secondary max-w-2xl">{t('PAGE_SUBTITLE')}</p>
          </div>

          {/* Unified Global Time Horizon & Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border/70 bg-surface/90 p-2 shadow-sm backdrop-blur-md">
            {/* Range Tabs */}
            <div
              data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-001"
              className="flex items-center rounded-lg bg-surface-muted/60 p-1 border border-border/50"
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
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                    props.range === option.key
                      ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
                  }`}
                >
                  <Calendar className="h-3 w-3 shrink-0 opacity-70" />
                  {t(ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_LABEL_KEYS[option.key])}
                </button>
              ))}
            </div>

            {/* Branch Filter */}
            <div className="relative">
              <select
                data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-003"
                aria-label={t('BRANCH_FILTER')}
                disabled={!props.isDemoMode}
                value={props.branch}
                onChange={(event) => props.onBranchChange(event.target.value)}
                className="admin-select admin-select-sm text-xs font-medium rounded-lg bg-surface border border-border/70 py-1.5 pl-3 pr-8 shadow-sm hover:border-primary/50 focus:ring-2 focus:ring-primary/20"
              >
                <option value="All Branches">{t('ALL_BRANCHES')}</option>
                {props.branchOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="h-5 w-[1px] bg-border/60 mx-0.5" />

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-004"
                onClick={props.onPrint}
                className="admin-btn-ghost admin-btn-sm text-xs inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1.5 text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors"
                title={t('PRINT_SAVE_PDF')}
              >
                <Printer size={15} strokeWidth={2} aria-hidden="true" />
                <span className="hidden sm:inline">{t('PRINT_SAVE_PDF')}</span>
              </button>

              <button
                type="button"
                data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-005"
                disabled
                title={t('EMAIL_UNAVAILABLE_TITLE')}
                className="admin-btn-ghost admin-btn-sm text-xs inline-flex items-center gap-1.5 rounded-lg border border-border/40 px-2.5 py-1.5 text-text-muted opacity-50 cursor-not-allowed"
              >
                <Mail size={15} strokeWidth={2} aria-hidden="true" />
                <span className="hidden sm:inline">{t('EMAIL')}</span>
              </button>

              <button
                type="button"
                data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-006"
                onClick={props.onPrint}
                className="admin-btn-ghost admin-btn-sm text-xs inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1.5 text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors"
                title={t('PDF_EXPORT')}
              >
                <FileText size={15} strokeWidth={2} aria-hidden="true" />
                <span className="hidden sm:inline">{t('PDF_EXPORT')}</span>
              </button>

              <button
                type="button"
                data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-007"
                disabled={!props.isDemoMode}
                title={props.isDemoMode ? t('CSV_DEMO_TITLE') : t('CSV_LIVE_UNAVAILABLE_TITLE')}
                onClick={props.onExportCsv}
                className="admin-btn-primary admin-btn-sm text-xs inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium shadow-sm"
              >
                <Download size={15} strokeWidth={2} aria-hidden="true" />
                <span>{t('CSV_EXPORT')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { AdminDashboardReportsAnalyticsPageHeaderSectionProps };
