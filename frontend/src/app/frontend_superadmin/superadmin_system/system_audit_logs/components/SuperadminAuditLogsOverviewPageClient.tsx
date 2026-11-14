'use client';
/** Responsibility: renders the superadmin_audit overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminAuditLogsOverviewPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import SuperadminAuditLogsOverviewSemanticTable, { type SemanticColumnDef, type SemanticCellParams } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/components/SuperadminAuditLogsOverviewSemanticTable';
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Eye, Download } from 'lucide-react';
import { buildSuperadminAuditLogsSampleCsv } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/utils/SuperadminAuditLogsOverviewExportUtilities';
import SuperadminAuditLogsOverviewActionBadge from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/components/SuperadminAuditLogsOverviewActionBadge';
import SuperadminAuditLogsOverviewDetailDrawer from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/components/SuperadminAuditLogsOverviewDetailDrawer';
import { SUPERADMIN_AUDIT_LOG_SAMPLE_FIXTURES } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/mocks/fixtures/SuperadminAuditLogsOverviewAuditLogSampleMockFixtures';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_AUDIT_LOGS_OVERVIEW_PAGE_CLIENT_ACTION_OPTIONS, SUPERADMIN_AUDIT_LOGS_PAGE_SIZE_OPTIONS, SUPERADMIN_AUDIT_LOGS_DEFAULT_PAGE_SIZE } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/constants/SuperadminAuditLogsOverviewStaticConstants';
import type { Log } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewPageClientComponentTypes';



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
 * Renders the `superadmin_audit` view owned by `SuperadminAuditLogsOverviewPageClient`.
 * Owns local UI state for `actionFilter`, `searchTerm`, `pageIndex`, `pageSize`, `urlReady`, `selected` and related form/selection state.
 * Effect lifecycle boundaries are `[]`, `[actionFilter, pageIndex, pageSize, urlReady]`, `[actionFilter, searchTerm, urlReady]`; listeners/timers/focus are cleaned up by their owning effects.
 */
export default function SuperadminAuditLogsOverviewPageClient() {
  const t = useTranslations('SUPERADMIN_AUDIT_LOGS');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(SUPERADMIN_AUDIT_LOGS_DEFAULT_PAGE_SIZE);
  const [urlReady, setUrlReady] = useState(false);
  const [selected, setSelected] = useState<Log | null>(null);
  const previousFilterKeyRef = useRef<string | null>(null);


  

  // Effect contract: keep local filter state synchronized with browser back/forward navigation and remove the listener on cleanup; dependency set [] (intentional mount-only effect) is the deliberate re-run boundary.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialAction = params.get('action') ?? 'All Actions';
    setActionFilter(SUPERADMIN_AUDIT_LOGS_OVERVIEW_PAGE_CLIENT_ACTION_OPTIONS.includes(initialAction) ? initialAction : 'All Actions');
    setSearchTerm(''); // Free-text search can contain identifiers; keep it local and out of the URL.
    const parsedPage = Number.parseInt(params.get('page') ?? '1', 10);
    const parsedPageSize = Number.parseInt(params.get('pageSize') ?? String(SUPERADMIN_AUDIT_LOGS_DEFAULT_PAGE_SIZE), 10);
    setPageIndex(Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage - 1 : 0);
    setPageSize(SUPERADMIN_AUDIT_LOGS_PAGE_SIZE_OPTIONS.includes(parsedPageSize as (typeof SUPERADMIN_AUDIT_LOGS_PAGE_SIZE_OPTIONS)[number]) ? parsedPageSize : SUPERADMIN_AUDIT_LOGS_DEFAULT_PAGE_SIZE);
    setUrlReady(true);
    const handlePopState = () => {
      const next = new URLSearchParams(window.location.search);
      const nextAction = next.get('action') ?? 'All Actions';
      const nextPage = Number.parseInt(next.get('page') ?? '1', 10);
      const nextPageSize = Number.parseInt(next.get('pageSize') ?? String(SUPERADMIN_AUDIT_LOGS_DEFAULT_PAGE_SIZE), 10);
      setActionFilter(SUPERADMIN_AUDIT_LOGS_OVERVIEW_PAGE_CLIENT_ACTION_OPTIONS.includes(nextAction) ? nextAction : 'All Actions');
      setPageIndex(Number.isFinite(nextPage) && nextPage > 0 ? nextPage - 1 : 0);
      setPageSize(SUPERADMIN_AUDIT_LOGS_PAGE_SIZE_OPTIONS.includes(nextPageSize as (typeof SUPERADMIN_AUDIT_LOGS_PAGE_SIZE_OPTIONS)[number]) ? nextPageSize : SUPERADMIN_AUDIT_LOGS_DEFAULT_PAGE_SIZE);
      setSearchTerm('');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Effect contract: serialize the current filter or view state into the URL only after initial URL hydration; dependency set [actionFilter, pageIndex, pageSize, urlReady] is the deliberate re-run boundary.
  useEffect(() => {
    if (!urlReady) return;
    const url = new URL(window.location.href);
    if (actionFilter === 'All Actions') url.searchParams.delete('action');
    else url.searchParams.set('action', actionFilter);
    url.searchParams.delete('search'); // Remove legacy free-text search values from the URL.
    if (pageIndex > 0) url.searchParams.set('page', String(pageIndex + 1));
    else url.searchParams.delete('page');
    if (pageSize !== SUPERADMIN_AUDIT_LOGS_DEFAULT_PAGE_SIZE) url.searchParams.set('pageSize', String(pageSize));
    else url.searchParams.delete('pageSize');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [actionFilter, pageIndex, pageSize, urlReady]);

  // Effect contract: synchronize the effect-owned state or browser subscription with its explicit reactive dependencies; dependency set [actionFilter, searchTerm, urlReady] is the deliberate re-run boundary.
  useEffect(() => {
    if (!urlReady) return;
    const filterKey = `${actionFilter}\u0000${searchTerm}`;
    if (previousFilterKeyRef.current === null) {
      previousFilterKeyRef.current = filterKey;
      return;
    }
    if (previousFilterKeyRef.current !== filterKey) {
      previousFilterKeyRef.current = filterKey;
      setPageIndex(0);
    }
  }, [actionFilter, searchTerm, urlReady]);


  const filtered = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
    return SUPERADMIN_AUDIT_LOG_SAMPLE_FIXTURES.filter((log) => {
      const matchesAction = actionFilter === 'All Actions' || log.action === actionFilter;
      const searchable = `${log.id} ${log.time} ${log.user} ${log.entity} ${log.target} ${log.action} ${log.ip}`.toLocaleLowerCase();
      return matchesAction && (!normalizedSearch || searchable.includes(normalizedSearch));
    });
  }, [actionFilter, searchTerm]);

  const handleExportSampleCsv = useCallback(() => {
    if (filtered.length === 0) return;
    const csv = buildSuperadminAuditLogsSampleCsv(filtered, { noticeHeader: t('COPY.CSV_NOTICE_HEADER'), noticeText: t('COPY.CSV_SAMPLE_NOTICE') });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = 'superadmin-audit-logs-SAMPLE.csv';
    anchor.setAttribute('aria-label', t('COPY.DOWNLOAD_SAMPLE_CSV_ARIA_LABEL'));
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }, [filtered, t]);

  const closeSelected = useCallback(() => setSelected(null), []);

  const colDefs = useMemo<SemanticColumnDef[]>(() => [
    { headerName: t("COPY.TABLE_COLUMN_TIMESTAMP"), field: 'time', flex: 1.2, minWidth: 150,
      cellClass: () => 'sa-cell-mono-muted' },
    { headerName: t("COPY.TABLE_COLUMN_PERFORMED_BY"), field: 'user', flex: 1, minWidth: 130,
      cellClass: () => 'sa-cell-primary-medium' },
    {
      headerName: t("COPY.TABLE_COLUMN_TARGET_ENTITY"), field: 'target', flex: 1.5, minWidth: 160,
      cellRenderer: (p: SemanticCellParams<Log>) => (
        <div>
          <span className="text-xs font-semibold text-secondary mr-1.5">{p.data?.entity}:</span>
          <span className="text-sm text-primary">{p.data?.target}</span>
        </div>
      ),
    },
    {
      headerName: t("COPY.TABLE_COLUMN_ACTION"), field: 'action', flex: 1, minWidth: 130,
      cellRenderer: (p: SemanticCellParams<Log>) => <SuperadminAuditLogsOverviewActionBadge action={p.data?.action ?? ''} />,
    },
    { headerName: t("COPY.TABLE_COLUMN_IP_ADDRESS"), field: 'ip', flex: 0.9, minWidth: 120,
      cellClass: () => 'sa-cell-mono-muted-sm' },
    {
      headerName: t("COPY.TABLE_COLUMN_VIEW"), field: 'id', flex: 0.5, minWidth: 70, sortable: false, filter: false,
      cellRenderer: (p: SemanticCellParams<Log>) => (
        <button type="button" className="sa-btn-icon sa-btn-icon--reveal" aria-label={t("COPY.VIEW_SAMPLE_AUDIT_ENTRY_ARIA_LABEL", { id: p.data?.id ?? t('COPY.UNKNOWN') })} onClick={e => { e.stopPropagation(); if (p.data) setSelected(p.data); }} data-testid={`superadmin-audit-logs-audit-logs-overview-view-sample-audit-entry-aria-label-1-${getSuperadminInteractiveTestIdSuffix(p.data)}`}>
          <Eye size={15} />
        </button>
      ),
    },
  ], [t]);


  return (
    <>
      {selected && <SuperadminAuditLogsOverviewDetailDrawer log={selected} onClose={closeSelected} />}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>{t("COPY.LIBRARY_OS")}</span><span>/</span><span>{t("COPY.SUPER_ADMIN")}</span><span>/</span><span>{t("COPY.AUDIT_LOGS")}</span>
        </div>
        <h1 className="sa-page-title">{t("COPY.SYSTEM_AUDIT_LOGS_SAMPLE")}</h1>
        <p className="text-sm text-secondary" role="note">{t("COPY.SAMPLE_AUDIT_DATA_ONLY_THIS_ARCHIVE_IS_NOT_CONNECTED_TO_A_LIVE_AUDIT_STREAM_THESE_ROWS_DO_NOT_VERIFY_REAL_OPERATIONS")}</p>
      </div>

      <div className="sa-card overflow-hidden">
        <div className="sa-actions-bar">
          <input aria-label={t("COPY.SEARCH_AUDIT_SAMPLE_BY_TARGET_OR_USER")} type="search" placeholder={t("COPY.SEARCH_SAMPLE_BY_TARGET_OR_USER")} className="sa-input w-64"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}  data-testid="superadmin-audit-logs-audit-logs-overview-search-audit-sample-by-target-or-user-2"/>
          <label className="sr-only" htmlFor="superadmin-audit-logs-action-filter">{t("COPY.FILTER_SAMPLE_LOGS_BY_ACTION")}</label>
          <select id="superadmin-audit-logs-action-filter" className="sa-select" value={actionFilter} onChange={e => setActionFilter(e.target.value)} data-testid="superadmin-audit-logs-audit-logs-overview-superadmin-audit-logs-action-filter-3">
            {SUPERADMIN_AUDIT_LOGS_OVERVIEW_PAGE_CLIENT_ACTION_OPTIONS.map((action) => <option key={action} value={action}>{action === 'All Actions' ? t('COPY.ALL_ACTIONS') : action === 'Created' ? t('COPY.CREATED') : action === 'Updated' ? t('COPY.UPDATED') : action === 'Deleted' ? t('COPY.DELETED') : t('COPY.FEE_COLLECTED')}</option>)}
          </select>
          <span className="text-xs text-secondary" aria-live="polite">{filtered.length} {t("COPY.SAMPLE_ENTRIES")}</span>
          <label className="flex items-center gap-2 text-xs text-secondary">{t("COPY.PAGE_SIZE")}<select className="sa-select" aria-label={t("COPY.PAGE_SIZE")} value={pageSize} onChange={(event) => { setPageSize(Number(event.currentTarget.value)); setPageIndex(0); }} data-testid="superadmin-audit-logs-audit-logs-overview-page-size-4">{SUPERADMIN_AUDIT_LOGS_PAGE_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
          <button type="button" className="sa-btn-primary" onClick={handleExportSampleCsv} disabled={filtered.length === 0} data-testid="superadmin-audit-logs-audit-logs-overview-export-sample-csv-5">
            <Download size={14} aria-hidden="true" /> {t("COPY.EXPORT_SAMPLE_CSV")}
          </button>
        </div>
        <div className="sa-audit-log-chart">
          <SuperadminAuditLogsOverviewSemanticTable rowData={filtered} columnDefs={colDefs} pagination paginationPageSize={pageSize} getRowId={({ data }) => data.id} onRowClick={setSelected} hideFilter pageIndex={pageIndex} onPageChange={setPageIndex} />
        </div>
      </div>
    </>
  );
}
