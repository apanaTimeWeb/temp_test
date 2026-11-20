'use client';
import { toast } from 'sonner';
/** Responsibility: renders the superadmin_support overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminSupportTicketsOverviewPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import SuperadminSupportTicketsOverviewSemanticTable, { type SemanticColumnDef, type SemanticCellParams } from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsOverviewSemanticTable';
import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  MessageSquare, AlertTriangle, Paperclip, Tag, FileText,
  Search, X, RotateCcw, FileSpreadsheet, Printer, Mail, PhoneCall, Download,
  Ticket, User, Clock
} from 'lucide-react';
import { SUPERADMIN_SUPPORT_TICKETS_FIXTURES } from '@/app/frontend_superadmin/superadmin_support/support_tickets/mocks/fixtures/SuperadminSupportTicketsOverviewMockFixtures';
import type { SuperadminSupportTicket, SuperadminSupportTicketsFilter } from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';
import { SUPERADMIN_SUPPORT_TICKETS_FILTERS, SUPERADMIN_SUPPORT_TICKETS_SAMPLE_AVERAGE_RESPONSE } from '@/app/frontend_superadmin/superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewConstants';
import { buildSuperadminSupportTicketsPreviewCsv, downloadSuperadminSupportTicketsPreviewCsv, filterSuperadminSupportTickets } from '@/app/frontend_superadmin/superadmin_support/support_tickets/utils/SuperadminSupportTicketsOverviewUtilities';
import {
  downloadSuperadminSupportTicketsExcel,
  printSuperadminSupportTicketsRoster
} from '@/app/frontend_superadmin/superadmin_support/support_tickets/utils/SuperadminSupportTicketsOverviewExportUtils';
import SuperadminSupportTicketsOverviewDetailPanel from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsOverviewDetailPanel';
import SuperadminSupportTicketsOverviewKpiCards from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsOverviewKpiCards';
import SuperadminSupportTicketsCreateModal from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsCreateModal';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const filtered = useMemo(() => {
    let result = filterSuperadminSupportTickets(tickets, filter);
    if (priorityFilter !== 'all') {
      result = result.filter((tkt) => tkt.priority.toLowerCase() === priorityFilter.toLowerCase());
    }
    if (categoryFilter !== 'all') {
      result = result.filter((tkt) => tkt.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((tkt) => {
        const matchesId = tkt.id.toLowerCase().includes(q);
        const matchesSubj = tkt.subject.toLowerCase().includes(q);
        const matchesTenant = tkt.tenant.toLowerCase().includes(q);
        const matchesAssignee = tkt.assignee.toLowerCase().includes(q);
        const matchesDesc = tkt.desc.toLowerCase().includes(q);
        const matchesContact = tkt.contact ? tkt.contact.toLowerCase().includes(q) : false;
        return matchesId || matchesSubj || matchesTenant || matchesAssignee || matchesDesc || matchesContact;
      });
    }
    return result;
  }, [tickets, filter, priorityFilter, categoryFilter, searchQuery]);

  const hasActiveFilters = Boolean(searchQuery || priorityFilter !== 'all' || categoryFilter !== 'all' || filter !== 'All');
  const resetAllFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setFilter('All');
  };

  const exportSampleTicketsExcel = () => {
    downloadSuperadminSupportTicketsExcel(filtered, 'superadmin_support_tickets.xls');
    showToast(`Exported ${filtered.length} ticket(s) to Excel (.xls)`);
  };

  const printTicketsRoster = () => {
    printSuperadminSupportTicketsRoster(filtered, 'Helpdesk Support Tickets');
    showToast(`Prepared ${filtered.length} ticket(s) for printing`);
  };

  // KPI calculations
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const slaBreachCount = tickets.filter(t => t.slaBreach && t.status !== 'Resolved').length;


  const colDefs = useMemo<SemanticColumnDef[]>(() => [
    {
      headerName: t('COPY.TABLE_COLUMN_SUBJECT_ID'), field: 'subject', flex: 2, minWidth: 260,
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => (
        <div className="py-1">
          <div className="flex items-center gap-2">
            {p.data?.slaBreach && p.data?.status !== 'Resolved' && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                <AlertTriangle size={11} className="mr-1 text-rose-400 motion-safe:animate-pulse" /> SLA
              </span>
            )}
            <button
              type="button"
              className="text-sm font-semibold text-slate-100 hover:text-indigo-300 transition-colors text-left truncate cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setSelected(p.data!); }}
              title={p.data?.subject}
              data-testid="superadmin-support_tickets-support_tickets-button-1"
            >
              {p.data?.subject}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[11px] font-mono font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/25 shrink-0">
              {p.data?.id}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50 shrink-0">
              <Tag size={10} className="text-slate-400" />
              {t(`COPY.CATEGORY_${String(p.data?.category ?? 'General').toUpperCase()}` as 'COPY.CATEGORY_BILLING' | 'COPY.CATEGORY_BUG' | 'COPY.CATEGORY_ACCOUNT' | 'COPY.CATEGORY_GENERAL' | 'COPY.CATEGORY_SUPPORT')}
            </span>
            {p.data?.hasAttachment && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/50 shrink-0" title="Has Attachment">
                <Paperclip size={10} />
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_TENANT'), field: 'tenant', flex: 1.5, minWidth: 160,
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0 shadow-xs">
            {String(p.value ?? '').charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-100 truncate">{p.value}</p>
            {p.data?.contact && (
              <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                <User size={10} className="text-slate-500 shrink-0" />
                {p.data.contact}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_ASSIGNEE'), field: 'assignee', flex: 1, minWidth: 130,
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => {
        const isUnassigned = p.value === 'Unassigned';
        return (
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isUnassigned ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'} shrink-0`} />
            <span className={`text-xs font-medium ${isUnassigned ? 'text-amber-300/80 italic' : 'text-slate-200'}`}>
              {isUnassigned ? t('COPY.ASSIGNEE_UNASSIGNED') : p.value === 'Sample Agent A' ? t('COPY.ASSIGNEE_SAMPLE_AGENT_A') : t('COPY.ASSIGNEE_SAMPLE_AGENT_B')}
            </span>
          </div>
        );
      },
    },
    {
      headerName: t('COPY.TABLE_COLUMN_STATUS'), field: 'status', flex: 1, minWidth: 120, cellClass: 'text-center',
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => {
        const val = p.value;
        const style = val === 'Resolved'
          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
          : val === 'Open'
          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
          : 'bg-amber-500/15 text-amber-300 border-amber-500/30';
        return (
          <div className="flex justify-center">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${style}`}>
              {val === 'Open' ? t('COPY.STATUS_OPEN') : val === 'In-Progress' ? t('COPY.STATUS_IN_PROGRESS') : t('COPY.STATUS_RESOLVED')}
            </span>
          </div>
        );
      },
    },
    {
      headerName: t('COPY.TABLE_COLUMN_PRIORITY'), field: 'priority', flex: 0.9, minWidth: 100, cellClass: 'text-center',
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => {
        const prio = p.data?.priority;
        const style = prio === 'High'
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
          : prio === 'Medium'
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          : 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        return (
          <div className="flex justify-center">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold border ${style}`}>
              {prio === 'High' ? t('COPY.PRIORITY_HIGH') : prio === 'Medium' ? t('COPY.PRIORITY_MEDIUM') : t('COPY.PRIORITY_LOW')}
            </span>
          </div>
        );
      },
    },
    {
      headerName: t('COPY.TABLE_COLUMN_AGE'), field: 'age', flex: 0.8, minWidth: 90, cellClass: 'text-center',
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => (
        <div className="flex items-center justify-center gap-1 text-xs text-slate-400 font-medium">
          <Clock size={11} className="text-slate-500" />
          <span>{p.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Actions', field: 'actions', flex: 1.6, minWidth: 200, sortable: false, filter: false, cellClass: 'text-right',
      cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => {
        if (!p.data) return null;
        const tkt = p.data;
        const testIdSuffix = getSuperadminInteractiveTestIdSuffix(p.data);
        const rawPhone = tkt.phone || '9876543210';
        let digits = rawPhone.replace(/\D/g, '');
        if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
        const waPhone = digits.length === 10 ? `91${digits}` : digits;
        const waMsg = `Hello ${tkt.contact || tkt.tenant}, regarding your Support Ticket ${tkt.id} ("${tkt.subject}") on Smart Library SaaS.`;

        return (
          <div className="flex items-center justify-end gap-1.5 flex-nowrap whitespace-nowrap">
            {/* Details Button */}
            <button
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
              onClick={e => { e.stopPropagation(); setSelected(tkt); }}
              aria-label={t("COPY.OPEN_TICKET_ARIA_LABEL", { id: tkt.id ?? t('COPY.UNKNOWN') })}
              title={t("COPY.OPEN_TICKET")}
              data-testid={`superadmin-support-tickets-support-tickets-overview-open-ticket-aria-label-1-${testIdSuffix}`}
            >
              <MessageSquare size={13} className="text-indigo-400" />
              <span>Details</span>
            </button>

            {/* Quick WhatsApp */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const popup = window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`, '_blank', 'noopener,noreferrer');
                if (popup) popup.opener = null;
                showToast(`Opened WhatsApp for Ticket ${tkt.id}`);
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all shadow-xs cursor-pointer shrink-0"
              title={`WhatsApp reply to ${tkt.tenant}`}
              aria-label={`WhatsApp for ticket ${tkt.id}`}
            >
              <MessageSquare size={12} className="text-emerald-400" />
            </button>

            {/* Quick Email */}
            {tkt.email && (
              <a
                href={`mailto:${tkt.email}?subject=${encodeURIComponent(`[Ticket ${tkt.id}] ${tkt.subject}`)}&body=${encodeURIComponent(`Dear ${tkt.contact || tkt.tenant},\n\nRegarding your ticket "${tkt.subject}" (${tkt.id}):\n\n`)}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:text-white hover:bg-purple-600/30 transition-all shadow-xs cursor-pointer shrink-0"
                title={`Email reply to ${tkt.tenant}`}
                aria-label={`Email for ticket ${tkt.id}`}
              >
                <Mail size={12} className="text-purple-400" />
              </a>
            )}

            {/* Quick Call */}
            {tkt.phone && (
              <a
                href={`tel:${tkt.phone.replace(/\D/g, '')}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-teal-500/30 bg-teal-500/15 text-teal-300 hover:text-white hover:bg-teal-600/30 transition-all shadow-xs cursor-pointer shrink-0"
                title={`Call ${tkt.tenant}`}
                aria-label={`Call for ticket ${tkt.id}`}
              >
                <PhoneCall size={12} className="text-teal-400" />
              </a>
            )}
          </div>
        );
      },
    },
  ], [t, showToast]);

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      {selected && <SuperadminSupportTicketsOverviewDetailPanel key={selected.id} tkt={selected} onClose={handleCloseDetail} onSave={handleSave} />}
      {showCreateModal && (
        <SuperadminSupportTicketsCreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateTicket={(newTicket) => {
            setTickets((prev) => [newTicket, ...prev]);
            showToast(`Support Ticket ${newTicket.id} created successfully for ${newTicket.tenant}`);
          }}
        />
      )}

      {/* Hero Header */}
      <div className="rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-950/60 via-[#0a0d22] to-[#060810] p-5 sm:p-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold text-rose-300">
              <Ticket size={13} className="text-rose-400" />
              <span>SaaS Platform & Software Helpdesk</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">{t("COPY.SAAS_SUPPORT_HELPDESK")}</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Dedicated technical helpline for Library Owners, Admins & Managers — Software bugs, UPI payment issues, Biometric QR sync, and platform billing.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 text-xs font-semibold text-white hover:from-rose-500 hover:to-indigo-500 shadow-md shadow-rose-950/30 transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Ticket size={14} strokeWidth={2.2} />
              <span>+ Log Software Ticket</span>
            </button>
            <button type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/15 text-xs font-semibold text-rose-300 hover:bg-rose-500/25 transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              onClick={exportSampleTickets} data-testid="superadmin-support-tickets-support-tickets-overview-export-logs-2">
              <FileText size={14} /> {t("COPY.EXPORT_LOGS")}
            </button>
            <button type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25 transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              onClick={exportSampleTicketsExcel} title="Export Excel (.xls)">
              <FileSpreadsheet size={14} className="text-indigo-400" /> Excel
            </button>
            <button type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-sky-500/30 bg-sky-500/15 text-xs font-semibold text-sky-300 hover:bg-sky-500/25 transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              onClick={printTicketsRoster} title="Print Tickets Roster">
              <Printer size={14} className="text-sky-400" /> Print
            </button>
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200" role="status">
        {t("COPY.SUPPORT_TICKETS_AND_MESSAGE_THREADS_ARE_SAMPLE_DATA_TICKET_UPDATES_STAY_IN_LOCAL_PAGE_STATE_REPLIES_AND_INTERNAL_NOTES_ARE_NOT_SENT")}
      </p>

      <SuperadminSupportTicketsOverviewKpiCards openCount={openCount} slaBreachCount={slaBreachCount} avgResponse={SUPERADMIN_SUPPORT_TICKETS_SAMPLE_AVERAGE_RESPONSE} />

      {/* Table with filter */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0a0d22] to-[#060810] overflow-hidden shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 border-b border-indigo-500/20 bg-indigo-500/5">
          {/* Status Filters - horizontal group */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-indigo-500/20 shrink-0">
            {SUPERADMIN_SUPPORT_TICKETS_FILTERS.map((f) => (
              <button
                type="button"
                key={f}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  filter === f
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                data-testid={`superadmin-support-tickets-support-tickets-overview-set-filter-3-${String(f)}`}
              >
                {f === 'All' ? t('COPY.FILTER_ALL') : f === 'Open' ? t('COPY.STATUS_OPEN') : f === 'In-Progress' ? t('COPY.STATUS_IN_PROGRESS') : t('COPY.STATUS_RESOLVED')}
              </button>
            ))}
          </div>

          {/* Search & dropdown filters in a clean horizontal row */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap flex-1 lg:max-w-2xl">
            {/* Search box */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search ticket ID, subject, tenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-7 py-1.5 text-xs rounded-xl border border-indigo-500/25 bg-slate-950 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Priority filter */}
            <select
              aria-label="Filter by priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-indigo-500/25 bg-slate-950 px-3 py-1.5 text-xs font-medium text-white hover:border-indigo-400 focus:outline-none shadow-xs cursor-pointer shrink-0"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            {/* Category filter */}
            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-indigo-500/25 bg-slate-950 px-3 py-1.5 text-xs font-medium text-white hover:border-indigo-400 focus:outline-none shadow-xs cursor-pointer shrink-0"
            >
              <option value="all">All Categories</option>
              <option value="Billing">Billing</option>
              <option value="Bug">Bug</option>
              <option value="Account">Account</option>
              <option value="Support">Support</option>
            </select>

            {/* Reset button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/35 transition-all cursor-pointer shrink-0 whitespace-nowrap"
                title="Reset active filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>

          <span className="text-xs font-medium text-slate-400 shrink-0 whitespace-nowrap">{filtered.length} {t("COPY.MATCHING_TICKETS")}</span>
        </div>
        <div className="sa-support-ticket-chart" role="region" aria-label={t("COPY.SAMPLE_SUPPORT_TICKETS_TABLE")}>
          <SuperadminSupportTicketsOverviewSemanticTable rowData={filtered} sourceRowCount={tickets.length} columnDefs={colDefs} pagination paginationPageSize={15} getRowId={({ data }) => data.id} hideFilter />
        </div>
      </div>
    </div>
  );
}
