'use client';
/** Responsibility: renders the superadmin_analytics overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminAnalyticsOverviewPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/config/superadmin_analytics_overview.url_config.ts';
import SuperadminAnalyticsOverviewSemanticTable, { type SemanticColumnDef, type SemanticCellParams } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/components/SuperadminAnalyticsOverviewSemanticTable';
import { SUPERADMIN_ANALYTICS_OVERVIEW_ROUTES as __SUPERADMIN_ANALYTICS_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_analytics/analytics_overview/config/superadmin_analytics_overview.url_config";
import { useSuperadminAnalyticsOverviewUrlFilter } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/hooks/useSuperadminAnalyticsOverviewUrlFilter';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Calendar, Download, Eye, Filter, Users, X } from 'lucide-react';
import SuperadminAnalyticsOverviewAnalyticsChart from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/components/SuperadminAnalyticsOverviewAnalyticsChart';
import { SUPERADMIN_REPORT_TENANT_FIXTURES, type SuperadminReportTenant } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/mocks/fixtures/SuperadminAnalyticsOverviewMockFixtures';
import type { SuperadminReportsDateRange, SuperadminReportsTab, SuperadminReportsTenantFilter } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/types/SuperadminAnalyticsOverviewTypes';
import { useLocale, useTranslations } from 'next-intl';
import { SUPERADMIN_REPORTS_OVERVIEW_PAGE_CLIENT_SELECTOR } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/constants/SuperadminAnalyticsOverviewStaticConstants';

import { SUPERADMIN_REPORTS_OVERVIEW_PAGE_CLIENT_REPORT_TABS } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/constants/SuperadminAnalyticsOverviewStaticConstants';
import { SUPERADMIN_REPORTS_OVERVIEW_PAGE_CLIENT_DATE_RANGES } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/constants/SuperadminAnalyticsOverviewStaticConstants';






import { formatSuperadminReportsMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/utils/SuperadminAnalyticsOverviewFormatters';
/** Derives a stable, non-index row identity for repeated interactive table controls. */
function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

/**
 * Renders the `superadmin_analytics` view owned by `SuperadminAnalyticsOverviewPageClient`.
 * Owns local UI state for `activeTab`, `dateRange`, `tenantFilter`, `selectedTenant`.
 * Effect lifecycle boundaries are `[selectedTenant]`; listeners/timers/focus are cleaned up by their owning effects.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminAnalyticsOverviewPageClient() {
  const locale = useLocale();
  const tCopy = useTranslations('SUPERADMIN_REPORTS');
  
  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
    "Financials": SUPERADMIN_NAVIGATION_ROUTES.analytics_financials,
    "Tenant Growth": SUPERADMIN_NAVIGATION_ROUTES.analytics_library_growth,
    "Subscription Mix": SUPERADMIN_NAVIGATION_ROUTES.analytics_subscription_mix
    };
    const route = routes[key];
    if (route) { const target = new URL(route, window.location.origin); const query = new URLSearchParams(window.location.search); query.delete('view'); query.forEach((value, key) => { if (!target.searchParams.has(key)) target.searchParams.append(key, value); }); window.location.assign(target.pathname + target.search + target.hash); }
  };
const router = useRouter();
  const [activeTab] = useState<SuperadminReportsTab>('Financials');
  const [dateRange, setDateRange] = useSuperadminAnalyticsOverviewUrlFilter<SuperadminReportsDateRange>('dateRange', 'Last 6 Months', SUPERADMIN_REPORTS_OVERVIEW_PAGE_CLIENT_DATE_RANGES);
  const [tenantFilter, setTenantFilter] = useSuperadminAnalyticsOverviewUrlFilter<SuperadminReportsTenantFilter>('tenantStatus', 'All', ['All', 'Active', 'Churn Risk']);
  const [selectedTenant, setSelectedTenant] = useState<SuperadminReportTenant | null>(null);
  const tenantDialogRef = useRef<HTMLElement>(null);
  const filteredTenants = useMemo(() => tenantFilter === 'All' ? SUPERADMIN_REPORT_TENANT_FIXTURES : SUPERADMIN_REPORT_TENANT_FIXTURES.filter(tenant => tenant.status === tenantFilter), [tenantFilter]);

  // Effect contract: attach keyboard handling for the active interactive surface and remove it during cleanup; dependency set [selectedTenant] is the deliberate re-run boundary.
  useEffect(() => {
    if (!selectedTenant) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    
    
    const controls = () => Array.from<HTMLElement>(tenantDialogRef.current?.querySelectorAll<HTMLElement>(SUPERADMIN_REPORTS_OVERVIEW_PAGE_CLIENT_SELECTOR) ?? []);
    controls()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setSelectedTenant(null); return; }
      if (event.key !== 'Tab') return;
      const items = controls(); const first = items[0]; const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); previouslyFocused?.focus(); };
  }, [selectedTenant]);

  const totalMrr = SUPERADMIN_REPORT_TENANT_FIXTURES.reduce((total, tenant) => total + tenant.mrr, 0);
  const activeTenants = SUPERADMIN_REPORT_TENANT_FIXTURES.filter(tenant => tenant.status === 'Active').length;
  const churnRisk = SUPERADMIN_REPORT_TENANT_FIXTURES.filter(tenant => tenant.status === 'Churn Risk').length;
  const columns = useMemo<SemanticColumnDef<SuperadminReportTenant>[]>(() => [
    { field: 'id', headerName: tCopy("COPY.LIBRARY_ID"), minWidth: 120 },
    { field: 'name', headerName: tCopy("COPY.TABLE_COLUMN_LIBRARY_NAME"), flex: 2, minWidth: 190 },
    { field: 'plan', headerName: tCopy("COPY.TABLE_COLUMN_CURRENT_PLAN"), flex: 1, minWidth: 140 },
    { field: 'mrr', headerName: tCopy("COPY.TABLE_COLUMN_MRR"), flex: 1, minWidth: 120, valueFormatter: params => typeof params.value === 'number' ? tCopy('COPY.FINANCIAL_DETAIL_ONLY') : '—' },
    { field: 'students', headerName: tCopy("COPY.TABLE_COLUMN_STUDENTS"), flex: 1, minWidth: 110 },
    { field: 'status', headerName: tCopy("COPY.STATUS"), flex: 1, minWidth: 120, cellRenderer: (params: SemanticCellParams<SuperadminReportTenant, string>) => <span className={params.value === 'Active' ? 'text-success' : 'text-warning'}>{params.value === 'Active' ? tCopy('COPY.TENANT_STATUS_ACTIVE') : params.value === 'Churn Risk' ? tCopy('COPY.TENANT_STATUS_CHURN_RISK') : tCopy('COPY.TENANT_STATUS_UNKNOWN')}</span> },
    { headerName: tCopy("COPY.TABLE_COLUMN_ACTION"), minWidth: 110, sortable: false, filter: false, cellRenderer: (params: SemanticCellParams<SuperadminReportTenant>) => <button type="button" className="sa-btn-ghost sa-btn-ghost--sm" aria-label={tCopy("COPY.VIEW_SAMPLE_TENANT_DETAILS_ARIA_LABEL", { name: params.data?.name ?? tCopy('COPY.TENANT') })} onClick={() => params.data && setSelectedTenant(params.data)} data-testid={`superadmin-reports-reports-overview-view-sample-tenant-details-aria-label-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}><Eye size={14} aria-hidden="true" /> {tCopy("COPY.VIEW")}</button> },
  ], [locale, tCopy]);

  const handleExport = () => window.print();

  return (
    <div className="sa-page-animate space-y-6 pb-12">
      <div className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">
        {tCopy("COPY.PREVIEW_ONLY_ALL_CHARTS_KPIS_AND_TENANT_ROWS_ON_THIS_PAGE_USE_SYNTHETIC_SAMPLE_DATA_A_VERIFIED_REPORTING_API_CONTRACT_WAS_NOT_INCLUDED_IN_THE_SUPPLIED_PACKAGE")}
      </div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="sa-breadcrumb"><span>{tCopy("COPY.LIBRARY_OS")}</span><span>/</span><span>{tCopy("COPY.SUPER_ADMIN")}</span><span>/</span><span>{tCopy("COPY.REPORTS_ANALYTICS")}</span></div>
          <h1 className="sa-page-title mt-2 flex items-center gap-3"><Activity className="text-primary" size={24} /> {tCopy("COPY.GLOBAL_SAAS_ANALYTICS")}</h1>
          <p className="text-sm text-secondary">{tCopy("COPY.EXPLORE_THE_AVAILABLE_LOCAL_PREVIEW_DATASET_BY_DATE_RANGE_AND_REPORT_TYPE")}</p>
        </div>
        <div className="flex w-full items-center gap-3 md:w-auto">
          <label className="relative flex-1 md:w-48">
            <span className="sr-only">{tCopy("COPY.REPORT_DATE_RANGE")}</span><Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <select aria-label={tCopy("COPY.DATE_RANGE")} className="sa-input pl-9 text-sm" value={dateRange} onChange={event => setDateRange(event.target.value as SuperadminReportsDateRange)} data-testid="superadmin-reports-reports-overview-date-range-2">
              {SUPERADMIN_REPORTS_OVERVIEW_PAGE_CLIENT_DATE_RANGES.map(range => <option key={range} value={range}>{tCopy(({ 'Last 30 Days': 'COPY.DATE_RANGE_LAST_30_DAYS', 'Last 6 Months': 'COPY.DATE_RANGE_LAST_6_MONTHS', 'This Year': 'COPY.DATE_RANGE_THIS_YEAR', 'All Time': 'COPY.DATE_RANGE_ALL_TIME' } as const)[range as SuperadminReportsDateRange])}</option>)}
            </select>
          </label>
          <button type="button" className="sa-btn-primary shrink-0" onClick={handleExport} data-testid="superadmin-reports-reports-overview-print-save-pdf-3"><Download size={16} aria-hidden="true" /><span>{tCopy("COPY.PRINT_SAVE_PDF")}</span></button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="sa-card p-5"><p className="text-xs font-semibold uppercase text-secondary">{tCopy("COPY.MRR_IN_SAMPLE_ROWS")}</p><p className="mt-3 text-2xl font-bold text-primary">{formatSuperadminReportsMajorPreviewCurrency(totalMrr, locale, 'INR')}</p></div>
        <div className="sa-card p-5"><p className="text-xs font-semibold uppercase text-secondary">{tCopy("COPY.ARR_RUN_RATE_EQUIVALENT")}</p><p className="mt-3 text-2xl font-bold text-primary">{formatSuperadminReportsMajorPreviewCurrency(totalMrr * 12, locale, 'INR')}</p></div>
        <div className="sa-card p-5"><div className="flex items-center gap-2"><Users size={16} className="text-success"/><p className="text-xs font-semibold uppercase text-secondary">{tCopy("COPY.ACTIVE_SAMPLE_TENANTS")}</p></div><p className="mt-3 text-2xl font-bold text-primary">{activeTenants}</p></div>
        <div className="sa-card p-5"><p className="text-xs font-semibold uppercase text-secondary">{tCopy("COPY.TENANTS_MARKED_CHURN_RISK")}</p><p className="mt-3 text-2xl font-bold text-warning">{churnRisk}</p></div>
      </div>

      <section className="sa-card overflow-hidden">
        <div className="flex gap-2 overflow-x-auto border-b border-border bg-surface-highlight p-3" role="navigation" aria-label={tCopy("COPY.REPORT_TYPE")}>
          {SUPERADMIN_REPORTS_OVERVIEW_PAGE_CLIENT_REPORT_TABS.map(({ name, icon: Icon }) => <button type="button" key={name} aria-current={activeTab === name ? 'page' : undefined} onClick={() => navigateToWorkflow(name)} className={`flex min-h-11 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold ${activeTab === name ? 'bg-primary text-on-primary' : 'text-secondary hover:bg-surface-hover'}`} data-testid={`superadmin-reports-reports-overview-set-active-tab-4-${String(name)}`}><Icon size={16} aria-hidden="true" />{tCopy(({ Financials: 'COPY.REPORT_TAB_FINANCIALS', 'Tenant Growth': 'COPY.REPORT_TAB_TENANT_GROWTH', 'Subscription Mix': 'COPY.REPORT_TAB_SUBSCRIPTION_MIX' } as const)[name])}</button>)}
        </div>
        <div className="p-4 md:p-6">
          <h2 className="text-base font-semibold">{tCopy(({ Financials: 'COPY.REPORT_TAB_FINANCIALS', 'Tenant Growth': 'COPY.REPORT_TAB_TENANT_GROWTH', 'Subscription Mix': 'COPY.REPORT_TAB_SUBSCRIPTION_MIX' } as const)[activeTab])} — {tCopy(({ 'Last 30 Days': 'COPY.DATE_RANGE_LAST_30_DAYS', 'Last 6 Months': 'COPY.DATE_RANGE_LAST_6_MONTHS', 'This Year': 'COPY.DATE_RANGE_THIS_YEAR', 'All Time': 'COPY.DATE_RANGE_ALL_TIME' } as const)[dateRange])}</h2>
          <p className="mt-1 text-sm text-secondary">{tCopy("COPY.SAMPLE_VALUES_ONLY_THE_REPORT_API_IS_NOT_CONNECTED_IN_THIS_SOURCE_PACKAGE")}</p>
          <div className="mt-4 h-80 min-w-0"><SuperadminAnalyticsOverviewAnalyticsChart activeTab={activeTab} dateRange={dateRange} /></div>
        </div>
      </section>

      <section className="sa-card p-4 md:p-6">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div><h2 className="text-lg font-semibold">{tCopy("COPY.TENANT_PREVIEW_ROWS")}</h2><p className="mt-1 text-sm text-secondary">{tCopy("COPY.VIEWING")} {filteredTenants.length} {tCopy("COPY.SAMPLE_TENANTS")}</p></div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="sa-btn-ghost sa-btn-ghost--sm" onClick={() => setTenantFilter(tenantFilter === 'All' ? 'Active' : tenantFilter === 'Active' ? 'Churn Risk' : 'All')} data-testid="superadmin-reports-reports-overview-filter-5"><Filter size={14} aria-hidden="true" /> {tCopy("COPY.FILTER")} {tenantFilter === 'All' ? tCopy('COPY.TENANT_FILTER_ALL') : tenantFilter === 'Active' ? tCopy('COPY.TENANT_STATUS_ACTIVE') : tCopy('COPY.TENANT_STATUS_CHURN_RISK')}</button>
            <button type="button" className="sa-btn-ghost sa-btn-ghost--sm" onClick={() => router.push(__SUPERADMIN_ANALYTICS_OVERVIEW_ROUTES.MODULE_URLS.LIBRARIES_PAGE)} data-testid="superadmin-reports-reports-overview-view-libraries-6">{tCopy("COPY.VIEW_LIBRARIES")}</button>
          </div>
        </div>
        <div className="h-88 w-full" aria-label={tCopy("COPY.SAMPLE_TENANT_DATA_TABLE")}>
          <SuperadminAnalyticsOverviewSemanticTable<SuperadminReportTenant> rowData={filteredTenants} columnDefs={columns} pagination paginationPageSize={10} getRowId={({ data }) => data.id} onRowClick={setSelectedTenant} />
        </div>
      </section>

      {selectedTenant && <div className="sa-wizard-modal-overlay" onClick={() => setSelectedTenant(null)} data-testid="superadmin-superadmin-reports-overview-page-client-div-line-140">
        <section ref={tenantDialogRef} className="sa-wizard-modal" role="dialog" aria-modal="true" aria-labelledby="tenant-preview-title" onClick={event => event.stopPropagation()} data-testid="superadmin-superadmin-reports-overview-page-client-section-line-141">
          <div className="flex items-center justify-between gap-3"><h2 id="tenant-preview-title" className="sa-wizard-modal-title">{tCopy("COPY.TENANT_PREVIEW")}</h2><button type="button" className="sa-btn-icon" aria-label={tCopy("COPY.CLOSE_TENANT_DETAILS")} onClick={() => setSelectedTenant(null)} data-testid="superadmin-reports-reports-overview-close-tenant-details-7"><X size={18} /></button></div>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"><div><dt className="text-sm text-secondary">{tCopy("COPY.LIBRARY_ID")}</dt><dd>{selectedTenant.id}</dd></div><div><dt className="text-sm text-secondary">{tCopy("COPY.NAME")}</dt><dd>{selectedTenant.name}</dd></div><div><dt className="text-sm text-secondary">{tCopy("COPY.PLAN")}</dt><dd>{selectedTenant.plan}</dd></div><div><dt className="text-sm text-secondary">{tCopy("COPY.MRR_PREVIEW")}</dt><dd>{formatSuperadminReportsMajorPreviewCurrency(selectedTenant.mrr, locale, 'INR')}</dd></div><div><dt className="text-sm text-secondary">{tCopy("COPY.STUDENTS_PREVIEW")}</dt><dd>{selectedTenant.students}</dd></div><div><dt className="text-sm text-secondary">{tCopy("COPY.STATUS")}</dt><dd>{selectedTenant.status === 'Active' ? tCopy('COPY.TENANT_STATUS_ACTIVE') : selectedTenant.status === 'Churn Risk' ? tCopy('COPY.TENANT_STATUS_CHURN_RISK') : tCopy('COPY.TENANT_STATUS_UNKNOWN')}</dd></div></dl>
          <div className="mt-6 flex justify-end"><button type="button" className="sa-btn-ghost" onClick={() => setSelectedTenant(null)} data-testid="superadmin-reports-reports-overview-close-8">{tCopy("COPY.CLOSE")}</button></div>
        </section>
      </div>}
    </div>
  );
}
