'use client';
// RESPONSIBILITY: Provide the page/orchestration entry component for the components feature. It does not own backend persistence or cross-feature business logic.

import { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { useManagerHelpSupportPageState } from '@/app/frontend_manager/manager_settings/settings_help_support/hooks/useManagerSettingsHelpSupportPageState';
import { ManagerSettingsHelpSupportTicketForm } from '@/app/frontend_manager/manager_settings/settings_help_support/components/manager_settings_help_support_forms/ManagerSettingsHelpSupportTicketForm';
import { MANAGER_HELP_SUPPORT_TABS } from '@/app/frontend_manager/manager_settings/settings_help_support/constants/ManagerSettingsHelpSupportConstants';
import { ManagerSettingsHelpSupportTabs } from '@/app/frontend_manager/manager_settings/settings_help_support/components/manager_settings_help_support_sections/ManagerSettingsHelpSupportTabs';
import {
  ManagerSettingsHelpSupportTicketsTable,
  type TicketSortField,
} from './ManagerSettingsHelpSupportTicketsTable';
import { ManagerSettingsHelpSupportAnnouncements } from './ManagerSettingsHelpSupportAnnouncements';

export default function ManagerSettingsHelpSupportPage() {
  const tManagerUi = useTranslations('manager.manager_help_support.ui');
  const locale = useLocale();

  const { activeTab, setActiveTab, ticketTab, setTicketTab, myTickets, announcements } =
    useManagerHelpSupportPageState();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<TicketSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: TicketSortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTickets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return myTickets.filter((t) => {
      const matchCat = categoryFilter === 'all' || t.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase();
      const matchPriority = priorityFilter === 'all' || t.priority.toLowerCase() === priorityFilter.toLowerCase();
      const matchQ =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q);
      return matchCat && matchStatus && matchPriority && matchQ;
    });
  }, [myTickets, searchQuery, categoryFilter, statusFilter, priorityFilter]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() !== '' || categoryFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all'
  );

  const sortedTickets = useMemo(() => {
    if (!sortField) return filteredTickets;
    return [...filteredTickets].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, {
        numeric: true,
        sensitivity: 'base',
      });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredTickets, sortField, sortDirection]);

  const totalRows = sortedTickets.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginatedTickets = sortedTickets.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const handleExportCsv = () => {
    const headers = 'Ticket ID,Subject,Category,Priority,Status,Date\n';
    const rows = sortedTickets
      .map(
        (t) =>
          `"${t.id}","${t.subject.replace(/"/g, '""')}","${t.category}","${t.priority}","${t.status}","${t.date}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `support_tickets_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Support tickets exported to CSV successfully');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
    setPage(0);
  };

  return (
    <div className="mgr-page-animate relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="mgr-page-title">{tManagerUi('help_support')}</h1>
          <p className="text-sm text-secondary mt-1">
            {tManagerUi('get_assistance_view_docs_and_track_support_tickets')}
          </p>
        </div>
        {activeTab !== 'Support Tickets' && (
          <button
            type="button"
            onClick={() => {
              setActiveTab('Support Tickets');
              setTicketTab('Create Ticket');
            }}
            className="mgr-btn-primary self-start md:self-auto"
          >
            <Plus size={16} /> {tManagerUi('raise_a_ticket')}
          </button>
        )}
      </div>

      <ManagerSettingsHelpSupportTabs
        tabs={MANAGER_HELP_SUPPORT_TABS}
        activeTab={activeTab}
        onSelect={setActiveTab}
      />

      {/* ----------------- SUPPORT TICKETS ----------------- */}
      {activeTab === 'Support Tickets' && (
        <div className="motion-safe:transition-all motion-safe:duration-base">
          {/* Sub Tabs */}
          <div className="flex items-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => {
                setTicketTab('My Tickets');
                setPage(0);
              }}
              aria-pressed={ticketTab === 'My Tickets'}
              className={`pb-2 text-sm font-bold border-b-2 motion-safe:transition-colors ${
                ticketTab === 'My Tickets'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              {tManagerUi('my_tickets')}
            </button>
            <button
              type="button"
              onClick={() => setTicketTab('Create Ticket')}
              aria-pressed={ticketTab === 'Create Ticket'}
              className={`pb-2 text-sm font-bold border-b-2 motion-safe:transition-colors ${
                ticketTab === 'Create Ticket'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              {tManagerUi('create_new_ticket')}
            </button>
          </div>

          {ticketTab === 'My Tickets' && (
            <ManagerSettingsHelpSupportTicketsTable
              filteredTickets={filteredTickets}
              paginatedTickets={paginatedTickets}
              searchQuery={searchQuery}
              setSearchQuery={(q) => {
                setSearchQuery(q);
                setPage(0);
              }}
              categoryFilter={categoryFilter}
              setCategoryFilter={(c) => {
                setCategoryFilter(c);
                setPage(0);
              }}
              statusFilter={statusFilter}
              setStatusFilter={(s) => {
                setStatusFilter(s);
                setPage(0);
              }}
              priorityFilter={priorityFilter}
              setPriorityFilter={(p) => {
                setPriorityFilter(p);
                setPage(0);
              }}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleResetFilters}
              onExportCsv={handleExportCsv}
              sortField={sortField}
              sortDirection={sortDirection}
              toggleSort={toggleSort}
              locale={locale}
              totalRows={totalRows}
              startItem={startItem}
              endItem={endItem}
              effectivePage={effectivePage}
              pageCount={pageCount}
              pageSize={pageSize}
              setPageSize={setPageSize}
              setPage={setPage}
            />
          )}

          {ticketTab === 'Create Ticket' && (
            <div className="mgr-card p-6 md:p-8 max-w-3xl">
              <p
                className="mb-4 text-sm text-warning"
                data-testid="manager-support-ticket-contract-warning"
                role="status"
              >
                {tManagerUi('ticket_creation_is_unavailable_no_authoritative_support_0ec10c')}
              </p>
              <h2 className="text-xl font-bold text-primary mb-2">
                {tManagerUi('raise_a_support_ticket')}
              </h2>
              <p className="text-sm text-secondary mb-8">
                {tManagerUi('draft_the_issue_details_below_submission_is_disabled_unt_ab6ecc')}
              </p>

              <ManagerSettingsHelpSupportTicketForm onCancel={() => setTicketTab('My Tickets')} />
            </div>
          )}
        </div>
      )}

      {/* ----------------- ANNOUNCEMENTS ----------------- */}
      {activeTab === 'Announcements' && (
        <ManagerSettingsHelpSupportAnnouncements announcements={announcements} locale={locale} />
      )}
    </div>
  );
}
