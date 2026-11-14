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
import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Eye, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_SELECTOR } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/constants/SuperadminCommunicationWhatsappLogsStaticConstants';

import { SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_VALID_STATUSES } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/constants/SuperadminCommunicationWhatsappLogsStaticConstants';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_VALID_TYPES } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/constants/SuperadminCommunicationWhatsappLogsStaticConstants';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_STATUS_BADGE } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/constants/SuperadminCommunicationWhatsappLogsStaticConstants';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_TYPE_BADGE } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/constants/SuperadminCommunicationWhatsappLogsStaticConstants';







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
 * Renders the `superadmin_communication` view owned by `SuperadminCommunicationWhatsappLogsPageClient`.
 * Owns local UI state for `typeFilter`, `statusFilter`, `search`, `dateFrom`, `dateTo`, `viewLog` and related form/selection state.
 * Effect lifecycle boundaries are `[]`, `[dateFrom, dateTo, statusFilter, typeFilter, urlStateReady]`, `[viewLog]`; listeners/timers/focus are cleaned up by their owning effects.
 */
export default function SuperadminCommunicationWhatsappLogsPageClient({ id }: { id?: string } = {}) {
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  const [typeFilter,   setTypeFilter]   = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search,       setSearch]       = useState('');
  const [dateFrom,     setDateFrom]     = useState('');
  const [dateTo,       setDateTo]       = useState('');
  const [viewLog,      setViewLog]      = useState<WaLog | null>(null);
  const [urlStateReady, setUrlStateReady] = useState(false);
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
    
    
    const getFocusable = () => Array.from<HTMLElement>(modalRef.current?.querySelectorAll<HTMLElement>(SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_SELECTOR) ?? []).filter((item) => item.offsetParent !== null);
    const first = getFocusable()[0];
    first?.focus();
    const handleModalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setViewLog(null); return; }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) { event.preventDefault(); modalRef.current?.focus(); return; }
      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === firstFocusable) { event.preventDefault(); lastFocusable?.focus(); }
      else if (!event.shiftKey && document.activeElement === lastFocusable) { event.preventDefault(); firstFocusable?.focus(); }
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

  const colDefs = [
    { field: 'dateTime', headerName: tCopy('COPY.COLUMN_DATE_TIME'), width: 160, cellRenderer: (p: ICellRendererParams) => <span className="eng-td-muted text-sm">{p.value}</span> },
    { field: 'phone', headerName: tCopy('COPY.COLUMN_PHONE'), width: 130, cellRenderer: (p: ICellRendererParams) => <span className="eng-td-mono font-medium">{maskSensitiveData(String(p.value ?? ''))}</span> },
    { field: 'student', headerName: tCopy('COPY.COLUMN_STUDENT'), flex: 1, minWidth: 150, cellRenderer: (p: ICellRendererParams) => <span className="eng-td-bold">{p.value}</span> },
    {
      field: 'type',
      headerName: tCopy('COPY.COLUMN_TYPE'),
      width: 130,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`eng-badge ${(SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_TYPE_BADGE as Record<string, string>)[String(p.value ?? '')] ?? 'eng-badge--outline'} inline-block mt-2 text-xs`}>
          {tCopy(`COPY.${String(p.value).toUpperCase()}`)}
        </span>
      )
    },
    {
      field: 'status',
      headerName: tCopy('COPY.COLUMN_STATUS'),
      width: 120,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`eng-badge ${(SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_STATUS_BADGE as Record<string, string>)[String(p.value ?? '')] ?? 'eng-badge--outline'} inline-block mt-2 text-xs`}>
          {p.value}
        </span>
      )
    },
    { field: 'error', headerName: tCopy('COPY.COLUMN_ERROR'), width: 180, cellRenderer: (p: ICellRendererParams) => <span className="eng-td-danger text-xs truncate max-w-40 inline-block" title={String(p.value ?? '')}>{p.value || '—'}</span> },
    {
      headerName: tCopy('COPY.COLUMN_ACTIONS'),
      width: 100,
      sortable: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="h-full flex items-center">
          <button type="button" onClick={() => setViewLog(params.data)} className="eng-btn-icon hover:bg-primary hover:text-on-primary motion-safe:transition-colors motion-reduce:transition-none motion-safe:duration-200" title={tCopy("COPY.VIEW_MESSAGE")} aria-label={tCopy("COPY.VIEW_MESSAGE_FOR_ARIA_LABEL", { student: params.data?.student ?? tCopy('COPY.UNKNOWN_STUDENT') })} data-testid={`superadmin-communication-communication-whatsapp-logs-view-message-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}>
            <Eye size={16} aria-hidden="true" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="eng-page" data-resource-id={id || undefined}>
      {/* View Message Modal */}
      {viewLog && (
        <div className="eng-overlay">
          <div ref={modalRef} tabIndex={-1} className="eng-modal eng-modal--lg bg-card" role="dialog" aria-modal="true" aria-labelledby="superadmin-whatsapp-log-detail-title">
            <button type="button" onClick={() => setViewLog(null)} className="eng-modal-close hover:text-danger" aria-label={tCopy("COPY.CLOSE_MESSAGE_DETAILS_DIALOG")} data-testid="superadmin-communication-communication-whatsapp-logs-close-message-details-dialog-2"><X size={16} aria-hidden="true" /></button>
            <h2 id="superadmin-whatsapp-log-detail-title" className="eng-modal-title mb-4 font-bold text-primary">{tCopy("COPY.MESSAGE_DETAILS")}</h2>
            <div className="eng-modal-badge-row mb-6 flex gap-2">
              <span className={`eng-badge ${SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_TYPE_BADGE[viewLog.type]}`}>{tCopy(`COPY.${String(viewLog.type).toUpperCase()}`)}</span>
              <span className={`eng-badge ${SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_STATUS_BADGE[viewLog.status]}`}>{tCopy(`COPY.${String(viewLog.status).toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`)}</span>
            </div>
            <div className="eng-msg-detail-grid grid grid-cols-2 gap-4 mb-6 bg-page p-4 rounded-lg">
              {([['To', viewLog.phone], ['Student', viewLog.student], ['Sent At', viewLog.dateTime]] as [string, string][]).map(([k, v]) => (
                <div key={k} className="eng-msg-detail-item">
                  <p className="eng-msg-detail-key text-xs font-semibold text-secondary uppercase tracking-wider">{k}</p>
                  <p className="eng-msg-detail-val text-primary font-medium mt-1">{v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="eng-label text-sm font-semibold mb-2 block">{tCopy("COPY.MESSAGE_CONTENT")}</p>
              <div className="eng-msg-body-box bg-page p-4 rounded-lg border border-border text-sm leading-relaxed text-primary whitespace-pre-wrap">{viewLog.message}</div>
            </div>
            {viewLog.error && (
              <div className="eng-warn-box mt-4 p-3 bg-danger-bg text-danger rounded-lg border border-border text-sm font-medium">{tCopy("COPY.ERROR")} {viewLog.error}</div>
            )}
            <div className="eng-modal-footer mt-6 flex justify-end">
              <button type="button" onClick={() => setViewLog(null)} className="px-4 py-2 bg-page border border-border text-primary rounded hover:bg-card motion-safe:transition-colors motion-reduce:transition-none" data-testid="superadmin-communication-communication-whatsapp-logs-close-3">{tCopy("COPY.CLOSE")}</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="eng-breadcrumb">
          <span>{tCopy("COPY.COMMUNICATION")}</span><ChevronRight size={12} /><span>{tCopy("COPY.WHATSAPP_LOGS")}</span>
        </div>
        <h1 className="eng-page-title">{tCopy("COPY.WHATSAPP_LOGS_2")}</h1>
        <p className="eng-page-subtitle">{tCopy("COPY.SYNTHETIC_SAMPLE_MESSAGE_LOGS_ONLY_NO_MESSAGES_WERE_SENT_LIVE_MESSAGING_HISTORY_WAS_NOT_SUPPLIED")}</p>
      </div>

      {/* Filter Bar */}
      <div className="eng-card mb-6 p-4 border border-border rounded-lg">
        <div className="eng-filter-row flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label htmlFor="superadmin-whatsapp-log-type-filter" className="eng-label text-xs mb-1 font-semibold text-secondary">{tCopy("COPY.MESSAGE_TYPE")}</label>
            <select id="superadmin-whatsapp-log-type-filter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="eng-select py-2 px-3 border rounded" data-testid="superadmin-communication-communication-whatsapp-logs-superadmin-whatsapp-log-type-filter-4">
              <option value="All">{tCopy("COPY.ALL_TYPES")}</option>
              <option value="welcome">{tCopy("COPY.WELCOME")}</option>
              <option value="fee_reminder">{tCopy("COPY.FEE_REMINDER")}</option>
              <option value="receipt">{tCopy("COPY.RECEIPT")}</option>
              <option value="notice">{tCopy("COPY.NOTICE")}</option>
              <option value="renewal">{tCopy("COPY.RENEWAL")}</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="superadmin-whatsapp-log-status-filter" className="eng-label text-xs mb-1 font-semibold text-secondary">{tCopy("COPY.STATUS")}</label>
            <select id="superadmin-whatsapp-log-status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="eng-select py-2 px-3 border rounded" data-testid="superadmin-communication-communication-whatsapp-logs-superadmin-whatsapp-log-status-filter-5">
              <option value="All">{tCopy("COPY.ALL")}</option>
              <option value="Pending">{tCopy("COPY.PENDING")}</option><option value="Sent">{tCopy("COPY.SENT")}</option>
              <option value="Delivered">{tCopy("COPY.DELIVERED")}</option><option value="Failed">{tCopy("COPY.FAILED")}</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="superadmin-whatsapp-log-date-from" className="eng-label text-xs mb-1 font-semibold text-secondary">{tCopy("COPY.FROM")}</label>
            <input id="superadmin-whatsapp-log-date-from" type="date" max={dateTo || undefined} className="eng-input py-2 px-3 border rounded" value={dateFrom} onChange={e => setDateFrom(e.target.value)}  data-testid="superadmin-communication-communication-whatsapp-logs-superadmin-whatsapp-log-date-from-6"/>
          </div>
          <div className="flex flex-col">
            <label htmlFor="superadmin-whatsapp-log-date-to" className="eng-label text-xs mb-1 font-semibold text-secondary">{tCopy("COPY.TO")}</label>
            <input id="superadmin-whatsapp-log-date-to" type="date" min={dateFrom || undefined} className="eng-input py-2 px-3 border rounded" value={dateTo} onChange={e => setDateTo(e.target.value)}  data-testid="superadmin-communication-communication-whatsapp-logs-superadmin-whatsapp-log-date-to-7"/>
          </div>
          <div className="eng-flex-1 flex flex-col flex-grow min-w-50">
            <label htmlFor="superadmin-whatsapp-log-search" className="eng-label text-xs mb-1 font-semibold text-secondary">{tCopy("COPY.SEARCH")}</label>
            <input id="superadmin-whatsapp-log-search" className="eng-input py-2 px-3 border rounded w-full" placeholder={tCopy("COPY.SAMPLE_STUDENT_OR_MASKED_PHONE")} maxLength={100} value={search} onChange={e => setSearch(e.target.value)}  data-testid="superadmin-communication-communication-whatsapp-logs-superadmin-whatsapp-log-search-8"/>
          </div>
        </div>
      </div>

      {dateFrom && dateTo && dateFrom > dateTo && <p className="mb-4 rounded-lg border border-border bg-danger-bg p-3 text-sm text-danger" role="alert">{tCopy("COPY.THE_START_DATE_MUST_BE_ON_OR_BEFORE_THE_END_DATE")}</p>}

      {/* Table */}
      <div className="eng-card eng-card--flush p-4">
        {filtered.length === 0 ? (
          <div className="eng-empty py-12 flex flex-col items-center justify-center text-center">
            <SuperadminCommunicationWhatsappLogsEmptyState filtered />
          </div>
        ) : (
          <div className="mgr-table-wrapper h-112">
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
                resizable: true
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
