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
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">{t("COPY.SAAS_SUPPORT_HELPDESK")}</h1>
          </div>
          <button type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/15 text-xs font-semibold text-rose-300 hover:bg-rose-500/25 transition-all active:scale-95 cursor-pointer"
            onClick={exportSampleTickets} data-testid="superadmin-support-tickets-support-tickets-overview-export-logs-2">
            <FileText size={14} /> {t("COPY.EXPORT_LOGS")}
          </button>
        </div>
      </div>

      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200" role="status">
        {t("COPY.SUPPORT_TICKETS_AND_MESSAGE_THREADS_ARE_SAMPLE_DATA_TICKET_UPDATES_STAY_IN_LOCAL_PAGE_STATE_REPLIES_AND_INTERNAL_NOTES_ARE_NOT_SENT")}
      </p>

      <SuperadminSupportTicketsOverviewKpiCards openCount={openCount} slaBreachCount={slaBreachCount} avgResponse={SUPERADMIN_SUPPORT_TICKETS_SAMPLE_AVERAGE_RESPONSE} />

      {/* Table with filter */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0a0d22] to-[#060810] overflow-hidden shadow-lg">
        <div className="flex items-center gap-3 p-4 border-b border-indigo-500/20 bg-indigo-500/5">
          <div className="flex gap-2 flex-wrap">
            {SUPERADMIN_SUPPORT_TICKETS_FILTERS.map((f) => (
              <button type="button" key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filter === f
                    ? 'border border-indigo-500/40 bg-indigo-500/20 text-indigo-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
                data-testid={`superadmin-support-tickets-support-tickets-overview-set-filter-3-${String(f)}`}>
                {f === 'All' ? t('COPY.FILTER_ALL') : f === 'Open' ? t('COPY.STATUS_OPEN') : f === 'In-Progress' ? t('COPY.STATUS_IN_PROGRESS') : t('COPY.STATUS_RESOLVED')}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs font-medium text-slate-400">{filtered.length} {t("COPY.MATCHING_TICKETS")}</span>
        </div>
        <div className="sa-support-ticket-chart" role="region" aria-label={t("COPY.SAMPLE_SUPPORT_TICKETS_TABLE")}>
          <SuperadminSupportTicketsOverviewSemanticTable rowData={filtered} sourceRowCount={tickets.length} columnDefs={colDefs} pagination paginationPageSize={15} getRowId={({ data }) => data.id} hideFilter />
        </div>
      </div>
    </div>
  );
}
