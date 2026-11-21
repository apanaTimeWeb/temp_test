'use client';
/** Responsibility: renders the superadmin_audit overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminAuditLogsOverviewPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import SuperadminAuditLogsOverviewSemanticTable, { type SemanticColumnDef, type SemanticCellParams } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/components/SuperadminAuditLogsOverviewSemanticTable';
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Eye,
  Download,
  ShieldCheck,
  ScrollText,
  Users,
  AlertCircle,
  PlusCircle,
  Trash2,
  ArrowUpRight,
} from 'lucide-react';
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
  const [pageSize, setPageSize] = useState<number>(SUPERADMIN_AUDIT_LOGS_DEFAULT_PAGE_SIZE);
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

  const colDefs = useMemo<SemanticColumnDef<Log>[]>(() => [
    { headerName: t("COPY.TABLE_COLUMN_TIMESTAMP"), field: 'time', flex: 1.2, minWidth: 150,
      cellClass: () => 'font-mono text-xs text-indigo-300/90' },
    { headerName: t("COPY.TABLE_COLUMN_PERFORMED_BY"), field: 'user', flex: 1, minWidth: 130,
      cellClass: () => 'font-semibold text-slate-100 text-xs' },
    {
      headerName: t("COPY.TABLE_COLUMN_TARGET_ENTITY"), field: 'target', flex: 1.5, minWidth: 160,
      cellRenderer: (p: SemanticCellParams<Log>) => (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">{p.data?.entity}</span>
          <span className="text-xs text-slate-200 font-medium">{p.data?.target}</span>
        </div>
      ),
    },
    {
      headerName: t("COPY.TABLE_COLUMN_ACTION"), field: 'action', flex: 1, minWidth: 130,
      cellRenderer: (p: SemanticCellParams<Log>) => <SuperadminAuditLogsOverviewActionBadge action={p.data?.action ?? ''} />,
    },
    { headerName: t("COPY.TABLE_COLUMN_IP_ADDRESS"), field: 'ip', flex: 0.9, minWidth: 120,
      cellClass: () => 'font-mono text-xs text-indigo-300/80' },
  ], [t]);


  const stats = useMemo(() => {
    const total = SUPERADMIN_AUDIT_LOG_SAMPLE_FIXTURES.length;
    const createdCount = SUPERADMIN_AUDIT_LOG_SAMPLE_FIXTURES.filter((l) => l.action === 'Created').length;
    const deletedCount = SUPERADMIN_AUDIT_LOG_SAMPLE_FIXTURES.filter((l) => l.action === 'Deleted').length;
    const uniqueActors = new Set(SUPERADMIN_AUDIT_LOG_SAMPLE_FIXTURES.map((l) => l.user)).size;
    return { total, createdCount, deletedCount, uniqueActors };
  }, []);

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      {selected && <SuperadminAuditLogsOverviewDetailDrawer log={selected} onClose={closeSelected} />}

      {/* Notice Callout */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200 backdrop-blur-md" role="status">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
        <p className="min-w-0 flex-1 leading-relaxed">
          {t("COPY.SAMPLE_AUDIT_DATA_ONLY_THIS_ARCHIVE_IS_NOT_CONNECTED_TO_A_LIVE_AUDIT_STREAM_THESE_ROWS_DO_NOT_VERIFY_REAL_OPERATIONS")}
        </p>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/80 via-[#0a0d22] to-[#060810] p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
                <ScrollText size={24} aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                {t("COPY.SYSTEM_AUDIT_LOGS_SAMPLE")}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                HMAC SHA-256 Tamper-Proof Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Append-only immutable system ledger tracking administrative operations, tenant data lifecycle changes, and critical security events with cryptographic verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/superadmin/superadmin_security/security_overview"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-[0.98]"
            >
              <ShieldCheck size={14} />
              <span>Security Center</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#0e1338]/90 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Audit Logs</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
              <ScrollText size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-100 tabular-nums">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-1">Immutable WORM storage</div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#06201a]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Created Records</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-inner">
              <PlusCircle size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 tabular-nums">{stats.createdCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Entity inserts & onboardings</div>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-b from-[#220a14]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deleted Records</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shadow-inner">
              <Trash2 size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 tabular-nums">{stats.deletedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Permanent removals & expiries</div>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#1b0d2d]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Distinct Actors</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400 shadow-inner">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-400 tabular-nums">{stats.uniqueActors}</div>
          <div className="text-[11px] text-slate-400 mt-1">Audited administrators</div>
        </div>
      </div>

      {/* Main Audit Logs Table Container */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#0c0f2b] via-[#090b20] to-[#060818] shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="sa-actions-bar flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 border-b border-indigo-500/20 bg-indigo-950/25">
          <div className="flex flex-wrap items-center gap-3">
            <input
              aria-label={t("COPY.SEARCH_AUDIT_SAMPLE_BY_TARGET_OR_USER")}
              type="search"
              placeholder={t("COPY.SEARCH_SAMPLE_BY_TARGET_OR_USER")}
              className="sa-input px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-[#07091a]/80 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 w-56 sm:w-64"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              data-testid="superadmin-audit-logs-audit-logs-overview-search-audit-sample-by-target-or-user-2"
            />
            <label className="sr-only" htmlFor="superadmin-audit-logs-action-filter">{t("COPY.FILTER_SAMPLE_LOGS_BY_ACTION")}</label>
            <select
              id="superadmin-audit-logs-action-filter"
              className="sa-select px-3 py-2 rounded-xl border border-indigo-500/30 bg-[#07091a]/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              data-testid="superadmin-audit-logs-audit-logs-overview-superadmin-audit-logs-action-filter-3"
            >
              {SUPERADMIN_AUDIT_LOGS_OVERVIEW_PAGE_CLIENT_ACTION_OPTIONS.map((action) => (
                <option key={action} value={action}>
                  {action === 'All Actions' ? t('COPY.ALL_ACTIONS') : action === 'Created' ? t('COPY.CREATED') : action === 'Updated' ? t('COPY.UPDATED') : action === 'Deleted' ? t('COPY.DELETED') : t('COPY.FEE_COLLECTED')}
                </option>
              ))}
            </select>
            <span className="text-xs text-indigo-300/80 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20" aria-live="polite">
              {filtered.length} {t("COPY.SAMPLE_ENTRIES")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-400">
              {t("COPY.PAGE_SIZE")}
              <select
                className="sa-select px-2.5 py-1.5 rounded-xl border border-indigo-500/30 bg-[#07091a]/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
                aria-label={t("COPY.PAGE_SIZE")}
                value={pageSize}
                onChange={(event) => { setPageSize(Number(event.currentTarget.value)); setPageIndex(0); }}
                data-testid="superadmin-audit-logs-audit-logs-overview-page-size-4"
              >
                {SUPERADMIN_AUDIT_LOGS_PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="sa-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              onClick={handleExportSampleCsv}
              disabled={filtered.length === 0}
              data-testid="superadmin-audit-logs-audit-logs-overview-export-sample-csv-5"
            >
              <Download size={13} aria-hidden="true" />
              <span>{t("COPY.EXPORT_SAMPLE_CSV")}</span>
            </button>
          </div>
        </div>

        <div className="sa-audit-log-chart overflow-x-auto">
          <SuperadminAuditLogsOverviewSemanticTable<Log>
            rowData={filtered}
            columnDefs={colDefs}
            pagination
            paginationPageSize={pageSize}
            getRowId={({ data }) => data.id}
            onRowClick={setSelected}
            hideFilter
            pageIndex={pageIndex}
            onPageChange={setPageIndex}
          />
        </div>
      </div>
    </div>
  );
}
