'use client';

import { toast } from 'sonner';
/** Responsibility: renders the superadmin_support overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminSupportTicketsOverviewPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import SuperadminSupportTicketsOverviewSemanticTable from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsOverviewSemanticTable';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { SUPERADMIN_SUPPORT_TICKETS_FIXTURES } from '@/app/frontend_superadmin/superadmin_support/support_tickets/mocks/fixtures/SuperadminSupportTicketsOverviewMockFixtures';
import type { SuperadminSupportTicket, SuperadminSupportTicketsFilter } from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';
import { SUPERADMIN_SUPPORT_TICKETS_FILTERS } from '@/app/frontend_superadmin/superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewConstants';
import { buildSuperadminSupportTicketsPreviewCsv, downloadSuperadminSupportTicketsPreviewCsv, filterSuperadminSupportTickets } from '@/app/frontend_superadmin/superadmin_support/support_tickets/utils/SuperadminSupportTicketsOverviewUtilities';
import {
  downloadSuperadminSupportTicketsExcel,
  printSuperadminSupportTicketsRoster
} from '@/app/frontend_superadmin/superadmin_support/support_tickets/utils/SuperadminSupportTicketsOverviewExportUtils';
import SuperadminSupportTicketsOverviewDetailPanel from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsOverviewDetailPanel';
import SuperadminSupportTicketsOverviewKpiCards from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsOverviewKpiCards';
import SuperadminSupportTicketsCreateModal from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsCreateModal';
import { useSupportTicketsColumns } from './SuperadminSupportTicketsColumns';
import SuperadminSupportTicketsHeroControls from './SuperadminSupportTicketsHeroControls';
import { useTranslations } from 'next-intl';

export default function SuperadminSupportTicketsOverviewPageClient() {
  const t = useTranslations('SUPERADMIN_SUPPORT_TICKETS');
  const [tickets, setTickets] = useState<SuperadminSupportTicket[]>(SUPERADMIN_SUPPORT_TICKETS_FIXTURES);
  const [filter, setFilter] = useState<SuperadminSupportTicketsFilter>('All');
  const [urlStateReady, setUrlStateReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selected, setSelected] = useState<SuperadminSupportTicket | null>(null);

  useEffect(() => {
    const allowed: SuperadminSupportTicketsFilter[] = ['All', ...SUPERADMIN_SUPPORT_TICKETS_FILTERS.filter((item) => item !== 'All')];
    const requested = new URLSearchParams(window.location.search).get('status');
    setFilter(allowed.includes(requested as SuperadminSupportTicketsFilter) ? (requested as SuperadminSupportTicketsFilter) : 'All');
    setUrlStateReady(true);
    const handlePopState = () => {
      const value = new URLSearchParams(window.location.search).get('status');
      setFilter(allowed.includes(value as SuperadminSupportTicketsFilter) ? (value as SuperadminSupportTicketsFilter) : 'All');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!urlStateReady) return;
    const url = new URL(window.location.href);
    if (filter === 'All') url.searchParams.delete('status');
    else url.searchParams.set('status', filter);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [filter, urlStateReady]);

  const showToast = useCallback((msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_support:SuperadminSupportTicketsOverviewPageClient:feedback' });
  }, []);

  const handleSave = useCallback(
    (updated: SuperadminSupportTicket) => {
      setTickets((current) => current.map((ticket) => (ticket.id === updated.id ? updated : ticket)));
      setSelected(updated);
      showToast(t('COPY.PREVIEW_ONLY_TICKET_UPDATES_APPLY_TO_THIS_PAGE_STATE_NO_SERVER_MUTATIO_B475183A'));
    },
    [showToast, t]
  );

  const handleCloseDetail = useCallback(() => setSelected(null), []);

  const exportSampleTickets = () => {
    downloadSuperadminSupportTicketsPreviewCsv(buildSuperadminSupportTicketsPreviewCsv(tickets));
    showToast(t('COPY.DOWNLOADED_A_SAMPLE_SUPPORT_TICKET_CSV_ONLY_NO_LIVE_TICKET_DATA_WAS_EXPORTED'));
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

  const colDefs = useSupportTicketsColumns({ t, setSelected, showToast });
  const openCount = useMemo(() => tickets.filter((ticket) => ticket.status === 'Open').length, [tickets]);
  const slaBreachCount = useMemo(() => tickets.filter((ticket) => ticket.slaBreach).length, [tickets]);

  return (
    <div className="w-full max-w-full min-w-0 space-y-4 pb-8">
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

      <SuperadminSupportTicketsHeroControls
        t={t}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        filter={filter}
        setFilter={setFilter}
        hasActiveFilters={hasActiveFilters}
        resetAllFilters={resetAllFilters}
        onOpenCreate={() => setShowCreateModal(true)}
        exportSampleTickets={exportSampleTickets}
        exportSampleTicketsExcel={exportSampleTicketsExcel}
        printTicketsRoster={printTicketsRoster}
      />

      <SuperadminSupportTicketsOverviewKpiCards
        openCount={openCount}
        slaBreachCount={slaBreachCount}
        avgResponse="1.8 hrs"
        totalCount={tickets.length}
      />

      <div className="rounded-2xl border border-indigo-500/20 bg-[#090d26]/80 p-4 shadow-xl">
        <SuperadminSupportTicketsOverviewSemanticTable
          rowData={filtered}
          columnDefs={colDefs}
          onRowClick={setSelected}
        />
      </div>
    </div>
  );
}
