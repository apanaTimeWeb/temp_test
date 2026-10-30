'use client';
// RESPONSIBILITY: Owns the analytics page header, data-mode notice, date-range tabs, branch filter, and safe export controls.

import { useTranslations } from 'next-intl';
import { Download, FileText, Mail, Printer } from 'lucide-react';
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
      {props.isDemoMode ? <p role="status" className="rounded-md border border-info-bg bg-info-bg p-3 text-info-text">{t('DEMO_BANNER')}</p> : <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_UNAVAILABLE_BANNER')}</p>}
      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-caption font-medium uppercase tracking-widest text-text-secondary">{t('BREADCRUMB')}</p>
          <h1 className="text-page-title font-bold tracking-tight text-text-primary">{t('PAGE_TITLE')}</h1>
          <p className="mt-1 text-body text-text-secondary">{t('PAGE_SUBTITLE')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-001" className="admin-tab-bar" role="tablist" aria-label={t('REPORT_RANGE_LABEL')} aria-orientation="horizontal" onKeyDown={handleRangeTabKeyDown}>
            {ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_OPTIONS.map((option) => (
              <button type="button" role="tab" id={`admin-reports-range-tab-${option.key}`} aria-controls="admin-reports-range-panel" data-testid={`admin_dashboard_reports-AdminDashboardReportsAnalytics-range-${option.key}`} key={option.key} aria-selected={props.range === option.key} tabIndex={props.range === option.key ? 0 : -1} disabled={!props.isDemoMode} onClick={() => props.onRangeChange(option.key)} className={`admin-tab${props.range === option.key ? ' active' : ''}`}>
                {t(ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_LABEL_KEYS[option.key])}
              </button>
            ))}
          </div>
          <select data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-003" aria-label={t('BRANCH_FILTER')} disabled={!props.isDemoMode} value={props.branch} onChange={(event) => props.onBranchChange(event.target.value)} className="admin-select admin-select-sm">
            <option value="All Branches">{t('ALL_BRANCHES')}</option>
            {props.branchOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <button type="button" data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-004" onClick={props.onPrint} className="admin-btn-ghost admin-btn-sm"><Printer size={18} strokeWidth={2} aria-hidden="true" />{t('PRINT_SAVE_PDF')}</button>
          <button type="button" data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-005" disabled title={t('EMAIL_UNAVAILABLE_TITLE')} className="admin-btn-ghost admin-btn-sm"><Mail size={18} strokeWidth={2} aria-hidden="true" />{t('EMAIL')}</button>
          <button type="button" data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-006" disabled title={t('PDF_UNAVAILABLE_TITLE')} className="admin-btn-ghost admin-btn-sm"><FileText size={18} strokeWidth={2} aria-hidden="true" />{t('PDF_EXPORT')}</button>
          <button type="button" data-testid="admin_dashboard_reports-AdminDashboardReportsAnalytics-control-007" disabled={!props.isDemoMode} title={props.isDemoMode ? t('CSV_DEMO_TITLE') : t('CSV_LIVE_UNAVAILABLE_TITLE')} onClick={props.onExportCsv} className="admin-btn-primary admin-btn-sm"><Download size={18} strokeWidth={2} aria-hidden="true" />{t('CSV_EXPORT')}</button>
        </div>
      </div>
    </section>
  );
}


export type { AdminDashboardReportsAnalyticsPageHeaderSectionProps };
