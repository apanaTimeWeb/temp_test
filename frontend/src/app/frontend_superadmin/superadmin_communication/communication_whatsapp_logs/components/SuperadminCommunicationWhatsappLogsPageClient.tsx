'use client';
/** Responsibility: Superadmin Communication Whatsapp Logs Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminCommunicationWhatsappLogsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import SuperadminCommunicationWhatsappLogsSemanticTable from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/components/SuperadminCommunicationWhatsappLogsSemanticTable';
import SuperadminCommunicationWhatsappLogsEmptyState from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/components/SuperadminCommunicationWhatsappLogsEmptyState';

import type { SemanticCellParams } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/components/SuperadminCommunicationWhatsappLogsSemanticTable';
type ICellRendererParams = SemanticCellParams<WaLog>;
import type { SuperadminCommunicationWhatsappLog as WaLog } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/types/SuperadminCommunicationWhatsappLogsWhatsappTypes';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_SAMPLE_LOGS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/mocks/fixtures/SuperadminCommunicationWhatsappLogsWhatsappLogMockFixtures';
import { filterSuperadminCommunicationWhatsappLogs } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/utils/SuperadminCommunicationWhatsappLogsWhatsappLogUtilities';
import { maskSensitiveData } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/utils/SuperadminCommunicationWhatsappLogsWhatsappLogUtilities';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Eye,
  X,
  Download,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  MessageSquare,
  Copy,
  Check,
  ShieldCheck,
  FilterX
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_SELECTOR } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/constants/SuperadminCommunicationWhatsappLogsStaticConstants';

import { SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_VALID_STATUSES } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/constants/SuperadminCommunicationWhatsappLogsStaticConstants';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_VALID_TYPES } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/constants/SuperadminCommunicationWhatsappLogsStaticConstants';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_STATUS_BADGE } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/constants/SuperadminCommunicationWhatsappLogsStaticConstants';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_TYPE_BADGE } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/constants/SuperadminCommunicationWhatsappLogsStaticConstants';

/** Derives a stable, non-index row identity for repeated interactive table controls. */
function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

/**
 * Renders the `superadmin_communication` view owned by `SuperadminCommunicationWhatsappLogsPageClient`.
 * Owns local UI state for `typeFilter`, `statusFilter`, `search`, `dateFrom`, `dateTo`, `viewLog` and related form/selection state.
 * Effect lifecycle boundaries are `[]`, `[dateFrom, dateTo, statusFilter, typeFilter, urlStateReady]`, `[viewLog]`; listeners/timers/focus are cleaned up by their owning effects.
 */
export default function SuperadminCommunicationWhatsappLogsPageClient({ id }: { id?: string } = {}) {
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewLog, setViewLog] = useState<WaLog | null>(null);
  const [urlStateReady, setUrlStateReady] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // Effect contract: hydrate URL-backed filter or route state from the current query string on mount; dependency set [] (intentional mount-only effect) is the deliberate re-run boundary.
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedType = urlParams.get('type') ?? 'All';
    const requestedStatus = urlParams.get('status') ?? 'All';
    const requestedDateFrom = urlParams.get('dateFrom') ?? '';
    const requestedDateTo = urlParams.get('dateTo') ?? '';

    const validDate = (value: string) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value);
    setTypeFilter(SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_VALID_TYPES.includes(requestedType) ? requestedType : 'All');
    setStatusFilter(SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_VALID_STATUSES.includes(requestedStatus) ? requestedStatus : 'All');
    // Free-text message/student/phone search may contain PII and is intentionally not restored from the URL.
    urlParams.delete('search');
    setDateFrom(validDate(requestedDateFrom) ? requestedDateFrom : '');
    setDateTo(validDate(requestedDateTo) ? requestedDateTo : '');
    setUrlStateReady(true);
  }, []);

  // Effect contract: serialize the current filter or view state into the URL only after initial URL hydration; dependency set [dateFrom, dateTo, statusFilter, typeFilter, urlStateReady] is the deliberate re-run boundary.
  useEffect(() => {
    if (!urlStateReady) return;
    const url = new URL(window.location.href);
    // Never persist free-text message/student/phone search in the URL.
    url.searchParams.delete('search');

    const filterParamSpecs: ReadonlyArray<readonly [string, string, string]> = [
      ['type', typeFilter, 'All'],
      ['status', statusFilter, 'All'],
      ['dateFrom', dateFrom, ''],
      ['dateTo', dateTo, ''],
    ];
    for (const [key, value, defaultValue] of filterParamSpecs) {
      if (value && value !== defaultValue) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [dateFrom, dateTo, statusFilter, typeFilter, urlStateReady]);

  // Effect contract: manage keyboard focus, Escape/Tab behavior, and focus restoration for the active dialog or drawer; dependency set [viewLog] is the deliberate re-run boundary.
  useEffect(() => {
    if (!viewLog) return;
    lastFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const getFocusable = () =>
      Array.from<HTMLElement>(
        modalRef.current?.querySelectorAll<HTMLElement>(SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_SELECTOR) ?? []
      ).filter((item) => item.offsetParent !== null);
    const first = getFocusable()[0];
    first?.focus();
    const handleModalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setViewLog(null);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        modalRef.current?.focus();
        return;
      }
      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    };
    document.addEventListener('keydown', handleModalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleModalKeyDown);
      lastFocusedElementRef.current?.focus();
    };
  }, [viewLog]);

  const filtered = filterSuperadminCommunicationWhatsappLogs(SUPERADMIN_COMMUNICATION_WHATSAPP_SAMPLE_LOGS, {
    type: typeFilter,
    status: statusFilter,
    search,
    dateFrom,
    dateTo,
  });

  // Calculate live summary metrics
  const stats = useMemo(() => {
    const total = SUPERADMIN_COMMUNICATION_WHATSAPP_SAMPLE_LOGS.length;
    const delivered = SUPERADMIN_COMMUNICATION_WHATSAPP_SAMPLE_LOGS.filter((l) => l.status === 'Delivered').length;
    const pending = SUPERADMIN_COMMUNICATION_WHATSAPP_SAMPLE_LOGS.filter((l) => l.status === 'Pending').length;
    const failed = SUPERADMIN_COMMUNICATION_WHATSAPP_SAMPLE_LOGS.filter((l) => l.status === 'Failed').length;
    const rate = total > 0 ? Math.round((delivered / total) * 100) : 100;
    return { total, delivered, pending, failed, rate };
  }, []);

  const hasActiveFilters = typeFilter !== 'All' || statusFilter !== 'All' || search !== '' || dateFrom !== '' || dateTo !== '';

  const handleResetFilters = () => {
    setTypeFilter('All');
    setStatusFilter('All');
    setSearch('');
    setDateFrom('');
    setDateTo('');
  };

  const handleExportCsv = () => {
    const headers = ['Date Time', 'Phone', 'Student', 'Type', 'Status', 'Error', 'Message'];
    const rows = filtered.map((log) => [
      `"${log.dateTime}"`,
      `"${maskSensitiveData(String(log.phone ?? ''))}"`,
      `"${log.student}"`,
      `"${log.type}"`,
      `"${log.status}"`,
      `"${(log.error ?? '').replace(/"/g, '""')}"`,
      `"${(log.message ?? '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `whatsapp_dispatch_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const colDefs = [
    {
      field: 'dateTime',
      headerName: tCopy('COPY.COLUMN_DATE_TIME'),
      width: 170,
      cellRenderer: (p: ICellRendererParams) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <Clock className="w-3.5 h-3.5 text-sky-400/80" />
          {p.value}
        </span>
      ),
    },
    {
      field: 'phone',
      headerName: tCopy('COPY.COLUMN_PHONE'),
      width: 140,
      cellRenderer: (p: ICellRendererParams) => (
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted/40 border border-border/50 text-foreground">
          {maskSensitiveData(String(p.value ?? ''))}
        </span>
      ),
    },
    {
      field: 'student',
      headerName: tCopy('COPY.COLUMN_STUDENT'),
      flex: 1,
      minWidth: 160,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-semibold">
            {String(p.value ?? 'S').charAt(0)}
          </div>
          <span className="font-semibold text-foreground text-sm">{p.value}</span>
        </div>
      ),
    },
    {
      field: 'type',
      headerName: tCopy('COPY.COLUMN_TYPE'),
      width: 130,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`eng-badge ${(SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_TYPE_BADGE as Record<string, string>)[String(p.value ?? '')] ?? 'eng-badge--outline'} inline-block mt-2 text-xs`}>
          {tCopy(`COPY.${String(p.value).toUpperCase()}`)}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: tCopy('COPY.COLUMN_STATUS'),
      width: 130,
      cellRenderer: (p: ICellRendererParams) => {
        const val = String(p.value ?? '');
        return (
          <span className={`eng-badge ${(SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_STATUS_BADGE as Record<string, string>)[val] ?? 'eng-badge--outline'} inline-flex items-center gap-1 mt-2 text-xs`}>
            {val === 'Delivered' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            {val === 'Failed' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
            {val === 'Pending' && <Clock className="w-3 h-3 text-amber-400" />}
            {val === 'Sent' && <Send className="w-3 h-3 text-sky-400" />}
            {p.value}
          </span>
        );
      },
    },
    {
      field: 'error',
      headerName: tCopy('COPY.COLUMN_ERROR'),
      width: 190,
      cellRenderer: (p: ICellRendererParams) =>
        p.value ? (
          <span className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded px-2 py-0.5 truncate max-w-44 inline-block" title={String(p.value ?? '')}>
            {p.value}
          </span>
        ) : (
          <span className="text-muted-foreground/40 text-xs">—</span>
        ),
    },
    {
      headerName: tCopy('COPY.COLUMN_ACTIONS'),
      width: 100,
      sortable: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="h-full flex items-center">
          <button
            type="button"
            onClick={() => setViewLog(params.data)}
            className="p-1.5 rounded-lg border border-border/60 bg-muted/20 text-muted-foreground hover:bg-emerald-500/15 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
            title={tCopy('COPY.VIEW_MESSAGE')}
            aria-label={tCopy('COPY.VIEW_MESSAGE_FOR_ARIA_LABEL', { student: params.data?.student ?? tCopy('COPY.UNKNOWN_STUDENT') })}
            data-testid={`superadmin-communication-communication-whatsapp-logs-view-message-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}
          >
            <Eye size={16} aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="eng-page min-h-screen space-y-6" data-resource-id={id || undefined}>
      {/* View Message Modal */}
      {viewLog && (
        <div className="eng-overlay fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            ref={modalRef}
            tabIndex={-1}
            className="eng-modal eng-modal--lg bg-card/95 border border-border/80 shadow-2xl rounded-2xl w-full max-w-2xl p-6 relative overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="superadmin-whatsapp-log-detail-title"
          >
            {/* Header Glow */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />

            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="superadmin-whatsapp-log-detail-title" className="text-lg font-bold text-foreground">
                    {tCopy('COPY.MESSAGE_DETAILS')}
                  </h2>
                  <p className="text-xs text-muted-foreground">ID: {viewLog.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewLog(null)}
                className="p-1.5 rounded-lg border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                aria-label={tCopy('COPY.CLOSE_MESSAGE_DETAILS_DIALOG')}
                data-testid="superadmin-communication-communication-whatsapp-logs-close-message-details-dialog-2"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="eng-modal-badge-row my-4 flex items-center gap-2">
              <span className={`eng-badge ${SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_TYPE_BADGE[viewLog.type]}`}>
                {tCopy(`COPY.${String(viewLog.type).toUpperCase()}`)}
              </span>
              <span className={`eng-badge ${SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_STATUS_BADGE[viewLog.status]}`}>
                {tCopy(`COPY.${String(viewLog.status).toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`)}
              </span>
            </div>

            <div className="eng-msg-detail-grid grid grid-cols-3 gap-3 mb-5 p-4 rounded-xl bg-muted/20 border border-border/50 text-xs">
              <div>
                <p className="text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">Recipient Phone</p>
                <p className="font-mono font-medium text-foreground mt-1 text-sm">{viewLog.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">Student Name</p>
                <p className="font-semibold text-foreground mt-1 text-sm">{viewLog.student}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">Sent Timestamp</p>
                <p className="text-foreground mt-1 text-sm font-mono">{viewLog.dateTime}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="eng-label text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {tCopy('COPY.MESSAGE_CONTENT')}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyMessage(viewLog.message)}
                  className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Message
                    </>
                  )}
                </button>
              </div>
              <div className="eng-msg-body-box p-4 rounded-xl bg-[#0b141a] border border-[#202c33] text-sm leading-relaxed text-[#e9edef] font-sans whitespace-pre-wrap shadow-inner relative">
                {viewLog.message}
                <div className="flex justify-end items-center gap-1 text-[11px] text-gray-400 mt-2">
                  <span>{viewLog.dateTime.split(' ')[1] || '12:00'}</span>
                  <span className="text-sky-400 font-bold">✓✓</span>
                </div>
              </div>
            </div>

            {viewLog.error && (
              <div className="eng-warn-box mt-4 p-3 bg-rose-500/10 text-rose-300 rounded-xl border border-rose-500/30 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  {tCopy('COPY.ERROR')} {viewLog.error}
                </span>
              </div>
            )}

            <div className="eng-modal-footer mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewLog(null)}
                className="px-5 py-2 rounded-xl bg-muted/40 hover:bg-muted text-foreground font-medium text-xs border border-border/80 transition-colors"
                data-testid="superadmin-communication-communication-whatsapp-logs-close-3"
              >
                {tCopy('COPY.CLOSE')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/40 via-card/90 to-card/60 border border-emerald-500/20 p-6 shadow-xl backdrop-blur-md">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audit Logging Active</span>
            </div>
            <h1 className="eng-page-title text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <MessageSquare className="w-7 h-7 text-emerald-400" />
              {tCopy('COPY.WHATSAPP_LOGS_2')}
            </h1>
            <p className="eng-page-subtitle text-xs text-muted-foreground mt-1 max-w-2xl">
              {tCopy('COPY.SYNTHETIC_SAMPLE_MESSAGE_LOGS_ONLY_NO_MESSAGES_WERE_SENT_LIVE_MESSAGING_HISTORY_WAS_NOT_SUPPLIED')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border/80 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-foreground text-xs font-medium transition-all shadow-sm"
              title="Export visible records to CSV file"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border/80 hover:border-sky-500/50 hover:bg-sky-500/10 text-foreground text-xs font-medium transition-all shadow-sm"
              title="Print logs summary"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Live KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/40">
          <div className="p-3 rounded-xl bg-card/60 border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total Messages</span>
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">{stats.total}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Showing {filtered.length} matches</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400">Delivered</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-300 mt-1">{stats.delivered}</div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5">{stats.rate}% delivery rate</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-400">Pending</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-amber-300 mt-1">{stats.pending}</div>
            <div className="text-[11px] text-amber-400/80 mt-0.5">In dispatch queue</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-400">Failed</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-rose-300 mt-1">{stats.failed}</div>
            <div className="text-[11px] text-rose-400/80 mt-0.5">Rate errors logged</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-card/80 border border-border/80 p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <span>Filter Dispatch History</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                Active
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="eng-filter-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
          <div className="flex flex-col">
            <label htmlFor="superadmin-whatsapp-log-type-filter" className="eng-label text-xs mb-1 font-semibold text-muted-foreground">
              {tCopy('COPY.MESSAGE_TYPE')}
            </label>
            <select
              id="superadmin-whatsapp-log-type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="eng-select py-2 px-3 bg-muted/30 border border-border/80 rounded-xl text-foreground text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              data-testid="superadmin-communication-communication-whatsapp-logs-superadmin-whatsapp-log-type-filter-4"
            >
              <option value="All">{tCopy('COPY.ALL_TYPES')}</option>
              <option value="welcome">{tCopy('COPY.WELCOME')}</option>
              <option value="fee_reminder">{tCopy('COPY.FEE_REMINDER')}</option>
              <option value="receipt">{tCopy('COPY.RECEIPT')}</option>
              <option value="notice">{tCopy('COPY.NOTICE')}</option>
              <option value="renewal">{tCopy('COPY.RENEWAL')}</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="superadmin-whatsapp-log-status-filter" className="eng-label text-xs mb-1 font-semibold text-muted-foreground">
              {tCopy('COPY.STATUS')}
            </label>
            <select
              id="superadmin-whatsapp-log-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="eng-select py-2 px-3 bg-muted/30 border border-border/80 rounded-xl text-foreground text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              data-testid="superadmin-communication-communication-whatsapp-logs-superadmin-whatsapp-log-status-filter-5"
            >
              <option value="All">{tCopy('COPY.ALL')}</option>
              <option value="Pending">{tCopy('COPY.PENDING')}</option>
              <option value="Sent">{tCopy('COPY.SENT')}</option>
              <option value="Delivered">{tCopy('COPY.DELIVERED')}</option>
              <option value="Failed">{tCopy('COPY.FAILED')}</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="superadmin-whatsapp-log-date-from" className="eng-label text-xs mb-1 font-semibold text-muted-foreground">
              {tCopy('COPY.FROM')}
            </label>
            <input
              id="superadmin-whatsapp-log-date-from"
              type="date"
              max={dateTo || undefined}
              className="eng-input py-2 px-3 bg-muted/30 border border-border/80 rounded-xl text-foreground text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              data-testid="superadmin-communication-communication-whatsapp-logs-superadmin-whatsapp-log-date-from-6"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="superadmin-whatsapp-log-date-to" className="eng-label text-xs mb-1 font-semibold text-muted-foreground">
              {tCopy('COPY.TO')}
            </label>
            <input
              id="superadmin-whatsapp-log-date-to"
              type="date"
              min={dateFrom || undefined}
              className="eng-input py-2 px-3 bg-muted/30 border border-border/80 rounded-xl text-foreground text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              data-testid="superadmin-communication-communication-whatsapp-logs-superadmin-whatsapp-log-date-to-7"
            />
          </div>
          <div className="eng-flex-1 flex flex-col">
            <label htmlFor="superadmin-whatsapp-log-search" className="eng-label text-xs mb-1 font-semibold text-muted-foreground">
              {tCopy('COPY.SEARCH')}
            </label>
            <input
              id="superadmin-whatsapp-log-search"
              className="eng-input py-2 px-3 bg-muted/30 border border-border/80 rounded-xl text-foreground text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              placeholder={tCopy('COPY.SAMPLE_STUDENT_OR_MASKED_PHONE')}
              maxLength={100}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="superadmin-communication-communication-whatsapp-logs-superadmin-whatsapp-log-search-8"
            />
          </div>
        </div>
      </div>

      {dateFrom && dateTo && dateFrom > dateTo && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2" role="alert">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{tCopy('COPY.THE_START_DATE_MUST_BE_ON_OR_BEFORE_THE_END_DATE')}</span>
        </p>
      )}

      {/* Table Section */}
      <div className="rounded-2xl bg-card border border-border/80 p-5 shadow-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="eng-empty py-16 flex flex-col items-center justify-center text-center">
            <SuperadminCommunicationWhatsappLogsEmptyState filtered />
          </div>
        ) : (
          <div className="mgr-table-wrapper">
            <SuperadminCommunicationWhatsappLogsSemanticTable
              rowData={filtered}
              columnDefs={colDefs}
              rowHeight={56}
              headerHeight={48}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 25, 50]}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
