'use client';
// RESPONSIBILITY: Provide the page/orchestration entry component for the components feature. It does not own backend persistence or cross-feature business logic.
import { ManagerSettingsHelpSupportEmptyState } from '@/app/frontend_manager/manager_settings/settings_help_support/components/ManagerSettingsHelpSupportEmptyState';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';

import { useManagerHelpSupportPageState } from '@/app/frontend_manager/manager_settings/settings_help_support/hooks/useManagerSettingsHelpSupportPageState';
import { ManagerSettingsHelpSupportTicketForm } from '@/app/frontend_manager/manager_settings/settings_help_support/components/manager_settings_help_support_forms/ManagerSettingsHelpSupportTicketForm';
import { MANAGER_HELP_SUPPORT_TABS } from '@/app/frontend_manager/manager_settings/settings_help_support/constants/ManagerSettingsHelpSupportConstants';
import { ManagerSettingsHelpSupportTabs } from '@/app/frontend_manager/manager_settings/settings_help_support/components/manager_settings_help_support_sections/ManagerSettingsHelpSupportTabs';
import { formatManagerHelpSupportCalendarDate } from '@/app/frontend_manager/manager_settings/settings_help_support/utils/ManagerSettingsHelpSupportDateFormatting';
import { Megaphone, Plus, CheckCircle, Clock, Search, ArrowUpDown, ArrowUp, ArrowDown, X, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function ManagerSettingsHelpSupportPage() {
  const tManagerUi = useTranslations('manager.manager_help_support.ui');
  const locale = useLocale();

  const { activeTab, setActiveTab, ticketTab, setTicketTab, myTickets, announcements } = useManagerHelpSupportPageState();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  type TicketSortField = 'id' | 'subject' | 'category' | 'priority' | 'status' | 'date';
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

  const hasActiveFilters = Boolean(searchQuery.trim() !== '' || categoryFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all');

  const handleExportCsv = () => {
    const headers = 'Ticket ID,Subject,Category,Priority,Status,Date\n';
    const rows = sortedTickets.map((t) =>
      `"${t.id}","${t.subject.replace(/"/g, '""')}","${t.category}","${t.priority}","${t.status}","${t.date}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `support_tickets_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Support tickets exported to CSV successfully');
  };

  const sortedTickets = useMemo(() => {
    if (!sortField) return filteredTickets;
    return [...filteredTickets].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredTickets, sortField, sortDirection]);

  const totalRows = sortedTickets.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginatedTickets = sortedTickets.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const renderSortableHeader = (field: TicketSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className="p-4 font-semibold"
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown size={14} className="text-secondary/40 group-hover:text-secondary transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="mgr-page-animate relative">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="mgr-page-title">{tManagerUi('help_support')}</h1>
          <p className="text-sm text-secondary mt-1">{tManagerUi('get_assistance_view_docs_and_track_support_tickets')}</p>
        </div>
        {activeTab !== 'Support Tickets' && (
          <button type="button" onClick={() => { setActiveTab('Support Tickets'); setTicketTab('Create Ticket'); }} className="mgr-btn-primary self-start md:self-auto">
            <Plus size={16} /> {tManagerUi('raise_a_ticket')}
          </button>
        )}
      </div>

      <ManagerSettingsHelpSupportTabs tabs={MANAGER_HELP_SUPPORT_TABS} activeTab={activeTab} onSelect={setActiveTab} />

      {/* ----------------- SUPPORT TICKETS ----------------- */}
      {activeTab === 'Support Tickets' && (
        <div className="motion-safe:transition-all motion-safe:duration-base">
          {/* Sub Tabs */}
          <div className="flex items-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => { setTicketTab('My Tickets'); setPage(0); }}
              aria-pressed={ticketTab === 'My Tickets'}
              className={`pb-2 text-sm font-bold border-b-2 motion-safe:transition-colors ${ticketTab === 'My Tickets' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'}`}
            >
              {tManagerUi('my_tickets')}
            </button>
            <button
              type="button"
              onClick={() => setTicketTab('Create Ticket')}
              aria-pressed={ticketTab === 'Create Ticket'}
              className={`pb-2 text-sm font-bold border-b-2 motion-safe:transition-colors ${ticketTab === 'Create Ticket' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'}`}
            >
              {tManagerUi('create_new_ticket')}
            </button>
          </div>

          {ticketTab === 'My Tickets' && (
            <div className="mgr-card p-0 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-secondary">Ticket Log</span>
                  <span className="mgr-badge mgr-badge--info text-xs font-mono">{filteredTickets.length} Tickets</span>
                </div>

                {/* Multi-Filter Toolbar */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full sm:w-52">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                    <input
                      type="search"
                      placeholder="Search ticket ID, subject..."
                      className="mgr-input pl-8 text-xs w-full"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(0);
                      }}
                    />
                  </div>

                  <select
                    aria-label="Filter by Category"
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setPage(0);
                    }}
                    className="mgr-select text-xs py-1.5 px-3 min-w-[120px]"
                  >
                    <option value="all">All Categories</option>
                    <option value="Finance">Finance</option>
                    <option value="General">General</option>
                    <option value="Facility">Facility</option>
                    <option value="Technical">Technical</option>
                  </select>

                  <select
                    aria-label="Filter by Status"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(0);
                    }}
                    className="mgr-select text-xs py-1.5 px-3 min-w-[110px]"
                  >
                    <option value="all">All Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <select
                    aria-label="Filter by Priority"
                    value={priorityFilter}
                    onChange={(e) => {
                      setPriorityFilter(e.target.value);
                      setPage(0);
                    }}
                    className="mgr-select text-xs py-1.5 px-3 min-w-[110px]"
                  >
                    <option value="all">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setCategoryFilter('all');
                        setStatusFilter('all');
                        setPriorityFilter('all');
                        setPage(0);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
                      title="Reset all filters"
                    >
                      <X size={13} /> Reset
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
                    title="Export Tickets CSV"
                  >
                    <Download size={13} /> Export CSV
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-highlight border-b border-border text-secondary text-xs uppercase font-semibold">
                      {renderSortableHeader('id', tManagerUi('ticket_id'))}
                      {renderSortableHeader('subject', tManagerUi('subject'))}
                      {renderSortableHeader('category', tManagerUi('category'))}
                      {renderSortableHeader('priority', tManagerUi('priority'))}
                      {renderSortableHeader('status', tManagerUi('status'))}
                      {renderSortableHeader('date', tManagerUi('date'))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.length === 0 ? (
                      <tr>
                        <td colSpan={6}><ManagerSettingsHelpSupportEmptyState className="p-8 text-center text-secondary" testId="manager-help-support-tickets-empty">{searchQuery ? 'No tickets found matching your search query.' : tManagerUi('no_tickets_found')}</ManagerSettingsHelpSupportEmptyState></td>
                      </tr>
                    ) : (
                      paginatedTickets.map(t => (
                        <tr key={t.id} className="border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12 motion-safe:transition-colors">
                          <td className="p-4 text-sm font-medium text-primary">{t.id}</td>
                          <td className="p-4 text-sm text-primary">{t.subject}</td>
                          <td className="p-4 text-sm text-secondary">{t.category === 'Finance' ? tManagerUi('ticket_category_finance') : t.category === 'General' ? tManagerUi('ticket_category_general') : t.category}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${t.priority === 'High' ? 'bg-danger-bg text-danger' :
                              t.priority === 'Medium' ? 'bg-warning-bg text-warning' : 'bg-success-bg text-success'
                              }`}>{t.priority === 'High' ? tManagerUi('high') : t.priority === 'Medium' ? tManagerUi('medium') : t.priority === 'Low' ? tManagerUi('low') : t.priority}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 text-sm">
                              {t.status === 'Open' ? <Clock size={14} className="text-warning" /> : <CheckCircle size={14} className="text-success" />}
                              <span className={t.status === 'Open' ? 'text-warning' : 'text-success'}>{t.status === 'Open' ? tManagerUi('ticket_status_open') : t.status === 'Closed' ? tManagerUi('ticket_status_closed') : t.status}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-secondary">{formatManagerHelpSupportCalendarDate(t.date, locale)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {totalRows > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
                    <span>
                      Showing {startItem}–{endItem} of {totalRows} results
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <label htmlFor="rows-per-page-settings-help-support" className="text-xs text-secondary whitespace-nowrap">
                          Rows per page:
                        </label>
                        <select
                          id="rows-per-page-settings-help-support"
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(0);
                          }}
                          className="rounded border border-border bg-surface px-2 py-1 text-xs text-primary"
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="mgr-btn-ghost mgr-btn-sm"
                          disabled={effectivePage <= 0}
                          onClick={() => setPage((current) => Math.max(0, current - 1))}
                        >
                          Previous
                        </button>
                        <span className="text-xs text-secondary px-1">
                          Page {effectivePage + 1} of {pageCount}
                        </span>
                        <button
                          type="button"
                          className="mgr-btn-ghost mgr-btn-sm"
                          disabled={effectivePage >= pageCount - 1}
                          onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {ticketTab === 'Create Ticket' && (
            <div className="mgr-card p-6 md:p-8 max-w-3xl">
              <p className="mb-4 text-sm text-warning" data-testid="manager-support-ticket-contract-warning" role="status">{tManagerUi('ticket_creation_is_unavailable_no_authoritative_support_0ec10c')}</p>
              <h2 className="text-xl font-bold text-primary mb-2">{tManagerUi('raise_a_support_ticket')}</h2>
              <p className="text-sm text-secondary mb-8">{tManagerUi('draft_the_issue_details_below_submission_is_disabled_unt_ab6ecc')}</p>

              <ManagerSettingsHelpSupportTicketForm onCancel={() => setTicketTab('My Tickets')} />
            </div>
          )}
        </div>
      )}

      {/* ----------------- ANNOUNCEMENTS ----------------- */}
      {activeTab === 'Announcements' && (
        <div className="max-w-4xl space-y-6 motion-safe:transition-all motion-safe:duration-base">
          <p className="text-sm text-warning" role="status">{tManagerUi('announcements_sample_content_notice')}</p>
          {announcements.map((ann) => (
            <div key={ann.id} className="mgr-card p-6 border-l-4 border-l-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Megaphone size={100} />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded border ${ann.colorClass}`}>{tManagerUi(ann.tagKey)}</span>
                <span className="text-sm text-secondary">{formatManagerHelpSupportCalendarDate(ann.date, locale)}</span>
              </div>
              <h2 className="text-xl font-bold text-primary mb-2">{tManagerUi(ann.titleKey)}</h2>
              <p className="text-secondary leading-relaxed">{tManagerUi(ann.descriptionKey)}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
