'use client';
import { toast } from 'sonner';
/** Responsibility: renders the superadmin_support overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminSupportTicketsOverviewPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import SuperadminSupportTicketsOverviewSemanticTable, { type SemanticColumnDef, type SemanticCellParams } from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsOverviewSemanticTable';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { MessageSquare, AlertTriangle, Paperclip, Tag, FileText } from 'lucide-react';
import { SUPERADMIN_SUPPORT_TICKETS_FIXTURES } from '@/app/frontend_superadmin/superadmin_support/support_tickets/mocks/fixtures/SuperadminSupportTicketsOverviewMockFixtures';
import type { SuperadminSupportTicket, SuperadminSupportTicketsFilter } from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';
import { SUPERADMIN_SUPPORT_TICKETS_FILTERS, SUPERADMIN_SUPPORT_TICKETS_SAMPLE_AVERAGE_RESPONSE } from '@/app/frontend_superadmin/superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewConstants';
import { buildSuperadminSupportTicketsPreviewCsv, downloadSuperadminSupportTicketsPreviewCsv, filterSuperadminSupportTickets } from '@/app/frontend_superadmin/superadmin_support/support_tickets/utils/SuperadminSupportTicketsOverviewUtilities';
import SuperadminSupportTicketsOverviewDetailPanel from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsOverviewDetailPanel';
import SuperadminSupportTicketsOverviewKpiCards from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsOverviewKpiCards';
import { useTranslations } from 'next-intl';


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
 * Renders the `superadmin_support` view owned by `SuperadminSupportTicketsOverviewPageClient`.
 * Owns local UI state for `tickets`, `filter`, `urlStateReady`, `selected`, `toast`.
 * Effect lifecycle boundaries are `[]`, `[filter, urlStateReady]`; listeners/timers/focus are cleaned up by their owning effects.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSupportTicketsOverviewPageClient() {
  const t = useTranslations('SUPERADMIN_SUPPORT_TICKETS');
  const [tickets, setTickets] = useState<SuperadminSupportTicket[]>(SUPERADMIN_SUPPORT_TICKETS_FIXTURES);
  const [filter, setFilter] = useState<SuperadminSupportTicketsFilter>('All');
  const [urlStateReady, setUrlStateReady] = useState(false);
  // Effect contract: keep local filter state synchronized with browser back/forward navigation and remove the listener on cleanup; dependency set [] (intentional mount-only effect) is the deliberate re-run boundary.
  useEffect(() => {
    const allowed: SuperadminSupportTicketsFilter[] = ['All', ...SUPERADMIN_SUPPORT_TICKETS_FILTERS.filter((item) => item !== 'All')];
    const requested = new URLSearchParams(window.location.search).get('status');
    setFilter(allowed.includes(requested as SuperadminSupportTicketsFilter) ? requested as SuperadminSupportTicketsFilter : 'All');
    setUrlStateReady(true);
    const handlePopState = () => {
      const value = new URLSearchParams(window.location.search).get('status');
      setFilter(allowed.includes(value as SuperadminSupportTicketsFilter) ? value as SuperadminSupportTicketsFilter : 'All');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  // Effect contract: serialize the current filter or view state into the URL only after initial URL hydration; dependency set [filter, urlStateReady] is the deliberate re-run boundary.
  useEffect(() => {
    if (!urlStateReady) return;
    const url = new URL(window.location.href);
    if (filter === 'All') url.searchParams.delete('status');
    else url.searchParams.set('status', filter);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [filter, urlStateReady]);
  const [selected, setSelected] = useState<SuperadminSupportTicket | null>(null);
  const showToast = useCallback((msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_support:SuperadminSupportTicketsOverviewPageClient:feedback' }); }, []);

  const handleSave = useCallback((updated: SuperadminSupportTicket) => {
    setTickets((current) => current.map((ticket) => ticket.id === updated.id ? updated : ticket));
    setSelected(updated);
    showToast(t("COPY.PREVIEW_ONLY_TICKET_UPDATES_APPLY_TO_THIS_PAGE_STATE_NO_SERVER_MUTATIO_B475183A"));
  }, [showToast, t]);

  const handleCloseDetail = useCallback(() => setSelected(null), []);

  const exportSampleTickets = () => {
    downloadSuperadminSupportTicketsPreviewCsv(buildSuperadminSupportTicketsPreviewCsv(tickets));
    showToast(t("COPY.DOWNLOADED_A_SAMPLE_SUPPORT_TICKET_CSV_ONLY_NO_LIVE_TICKET_DATA_WAS_EXPORTED"));
  };

  const filtered = filterSuperadminSupportTickets(tickets, filter);

  // KPI calculations
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const slaBreachCount = tickets.filter(t => t.slaBreach && t.status !== 'Resolved').length;
  

  const colDefs = useMemo<SemanticColumnDef[]>(() => [
    {
      headerName: t('COPY.TABLE_COLUMN_SUBJECT_ID'), field: 'subject', flex: 2, minWidth: 250,
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => (
        <div className="py-2">
          <p className="font-bold text-primary leading-tight flex items-center gap-2">
            {p.data?.slaBreach && p.data?.status !== 'Resolved' && <AlertTriangle size={12} className="text-danger motion-safe:animate-pulse" />}
            {p.data?.subject}
            {p.data && <button type="button" className="ml-auto text-xs underline text-info focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" aria-label={t('COPY.OPEN_TICKET_ARIA_LABEL', { id: p.data.id })} onClick={(event) => { event.stopPropagation(); setSelected(p.data!); }} data-testid="superadmin-support_tickets-support_tickets-button-1">{t('COPY.OPEN_TICKET')}</button>}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs font-mono text-info bg-info-bg px-1.5 py-0.5 rounded border border-border">{p.data?.id}</span>
            <span className="flex items-center gap-1 text-xs text-secondary"><Tag size={10} /> {t(`COPY.CATEGORY_${String(p.data?.category ?? 'General').toUpperCase()}` as 'COPY.CATEGORY_BILLING' | 'COPY.CATEGORY_BUG' | 'COPY.CATEGORY_ACCOUNT' | 'COPY.CATEGORY_GENERAL' | 'COPY.CATEGORY_SUPPORT')}</span>
            {p.data?.hasAttachment && <span className="flex items-center gap-1 text-xs text-secondary"><Paperclip size={10} /></span>}
          </div>
        </div>
      ),
    },
    { 
      headerName: t('COPY.TABLE_COLUMN_TENANT'), field: 'tenant', flex: 1.5, minWidth: 150,
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => (
        <div className="flex items-center gap-2 h-full">
          <div className="w-6 h-6 rounded-full bg-surface-hover border border-border flex items-center justify-center text-xs font-bold text-secondary">
            {String(p.value ?? '').charAt(0)}
          </div>
          <span className="text-sm text-primary font-medium">{p.value}</span>
        </div>
      )
    },
    {
      headerName: t('COPY.TABLE_COLUMN_ASSIGNEE'), field: 'assignee', flex: 1, minWidth: 130,
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => (
        <span className={`text-xs font-medium ${p.value === 'Unassigned' ? 'text-disabled italic' : 'text-success'}`}>
          {p.value === 'Unassigned' ? t('COPY.ASSIGNEE_UNASSIGNED') : p.value === 'Sample Agent A' ? t('COPY.ASSIGNEE_SAMPLE_AGENT_A') : t('COPY.ASSIGNEE_SAMPLE_AGENT_B')}
        </span>
      )
    },
    {
      headerName: t('COPY.TABLE_COLUMN_STATUS'), field: 'status', flex: 1, minWidth: 110,
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => (
        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          p.value === 'Resolved' ? 'bg-success-bg text-success border border-border' :
          p.value === 'Open' ? 'bg-danger-bg text-danger border border-border' : 'bg-warning-bg text-warning border border-border'
        }`}>
          {p.value === 'Open' ? t('COPY.STATUS_OPEN') : p.value === 'In-Progress' ? t('COPY.STATUS_IN_PROGRESS') : t('COPY.STATUS_RESOLVED')}
        </span>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_PRIORITY'), field: 'priority', flex: 0.8, minWidth: 100,
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => (
        <span className={`text-xs font-bold ${
          p.data?.priority === 'High' ? 'text-danger' : p.data?.priority === 'Medium' ? 'text-warning' : 'text-secondary'
        }`}>{p.value === 'High' ? t('COPY.PRIORITY_HIGH') : p.value === 'Medium' ? t('COPY.PRIORITY_MEDIUM') : t('COPY.PRIORITY_LOW')}</span>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_AGE'), field: 'age', flex: 0.8, minWidth: 100,
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => (
        <span className="text-xs text-secondary">{p.value}</span>
      ),
    },
    {
      headerName: '', field: 'id', flex: 0.5, minWidth: 70, sortable: false, filter: false,
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => (
        <button type="button" 
          className="w-11 h-11 min-w-11 min-h-11 rounded-lg bg-info-bg border border-border text-info flex items-center justify-center hover:bg-info text-on-info hover:text-primary motion-safe:transition-colors motion-reduce:transition-none"
          onClick={e => { e.stopPropagation(); if (p.data) setSelected(p.data); }}
          aria-label={t("COPY.OPEN_TICKET_ARIA_LABEL", { id: p.data?.id ?? t('COPY.UNKNOWN') })}
          title={t("COPY.OPEN_TICKET")}
         data-testid={`superadmin-support-tickets-support-tickets-overview-open-ticket-aria-label-1-${getSuperadminInteractiveTestIdSuffix(p.data)}`}>
          <MessageSquare size={14} />
        </button>
      ),
    },
  ], [t]);


  return (
    <div className="sa-page-animate pb-10">
      
      <p className="mb-4 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{t("COPY.SUPPORT_TICKETS_AND_MESSAGE_THREADS_ARE_SAMPLE_DATA_TICKET_UPDATES_STAY_IN_LOCAL_PAGE_STATE_REPLIES_AND_INTERNAL_NOTES_ARE_NOT_SENT")}</p>
      {selected && <SuperadminSupportTicketsOverviewDetailPanel key={selected.id} tkt={selected} onClose={handleCloseDetail} onSave={handleSave} />}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>{t("COPY.LIBRARY_OS")}</span><span>/</span><span>{t("COPY.SUPER_ADMIN")}</span><span>/</span><span>{t("COPY.SUPPORT_HELPDESK")}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">{t("COPY.SAAS_SUPPORT_HELPDESK")}</h1>
          <button type="button" className="sa-btn-secondary" onClick={exportSampleTickets} data-testid="superadmin-support-tickets-support-tickets-overview-export-logs-2">
            <FileText size={16} className="text-secondary" /> {t("COPY.EXPORT_LOGS")}
          </button>
        </div>
      </div>

      <SuperadminSupportTicketsOverviewKpiCards openCount={openCount} slaBreachCount={slaBreachCount} avgResponse={SUPERADMIN_SUPPORT_TICKETS_SAMPLE_AVERAGE_RESPONSE} />

      <div className="sa-card overflow-hidden p-0 border border-border shadow-2xl">
        <div className="flex items-center gap-4 p-4 border-b border-border bg-surface-highlight">
          <div className="flex gap-2">
            {SUPERADMIN_SUPPORT_TICKETS_FILTERS.map((f) => (
              <button type="button" key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold motion-safe:transition-all motion-reduce:transition-none ${
                  filter === f 
                  ? 'bg-info-bg text-info border border-border' 
                  : 'text-secondary hover:text-primary hover:bg-surface-hover'
                }`} data-testid={`superadmin-support-tickets-support-tickets-overview-set-filter-3-${String(f)}`}>
                {f === 'All' ? t('COPY.FILTER_ALL') : f === 'Open' ? t('COPY.STATUS_OPEN') : f === 'In-Progress' ? t('COPY.STATUS_IN_PROGRESS') : t('COPY.STATUS_RESOLVED')}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs font-medium text-disabled">{filtered.length} {t("COPY.MATCHING_TICKETS")}</span>
        </div>
        
        <div className="sa-support-ticket-chart" role="region" aria-label={t("COPY.SAMPLE_SUPPORT_TICKETS_TABLE")}>
          <SuperadminSupportTicketsOverviewSemanticTable rowData={filtered} sourceRowCount={tickets.length} columnDefs={colDefs} pagination paginationPageSize={15} getRowId={({ data }) => data.id} hideFilter />
        </div>
      </div>
    </div>
  );
}
