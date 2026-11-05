'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpDown, ArrowUp, ArrowDown, Clock, CheckCircle } from 'lucide-react';
import { ManagerSettingsHelpSupportEmptyState } from '../ManagerSettingsHelpSupportEmptyState';
import { formatManagerHelpSupportCalendarDate } from '../../utils/ManagerSettingsHelpSupportDateFormatting';
import { ManagerSettingsHelpSupportTicketsToolbar } from './ManagerSettingsHelpSupportTicketsToolbar';

export interface ManagerSettingsHelpSupportTicketItem {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  date: string;
}

export type TicketSortField = 'id' | 'subject' | 'category' | 'priority' | 'status' | 'date';

interface ManagerSettingsHelpSupportTicketsTableProps {
  filteredTickets: ManagerSettingsHelpSupportTicketItem[];
  paginatedTickets: ManagerSettingsHelpSupportTicketItem[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  priorityFilter: string;
  setPriorityFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCsv: () => void;
  sortField: TicketSortField | null;
  sortDirection: 'asc' | 'desc';
  toggleSort: (field: TicketSortField) => void;
  locale: string;
  totalRows: number;
  startItem: number;
  endItem: number;
  effectivePage: number;
  pageCount: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  setPage: (updater: number | ((prev: number) => number)) => void;
}

export function ManagerSettingsHelpSupportTicketsTable({
  filteredTickets,
  paginatedTickets,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  hasActiveFilters,
  onResetFilters,
  onExportCsv,
  sortField,
  sortDirection,
  toggleSort,
  locale,
  totalRows,
  startItem,
  endItem,
  effectivePage,
  pageCount,
  pageSize,
  setPageSize,
  setPage,
}: ManagerSettingsHelpSupportTicketsTableProps) {
  const tManagerUi = useTranslations('manager.manager_help_support.ui');

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
          aria-label={`${label}, sort ${
            isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'
          }`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown
              size={14}
              className="text-secondary group-hover:text-secondary transition-colors shrink-0"
              aria-hidden="true"
            />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="mgr-card p-0 overflow-hidden">
      <ManagerSettingsHelpSupportTicketsToolbar
        totalTicketsCount={filteredTickets.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
        onExportCsv={onExportCsv}
      />

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
                <td colSpan={6}>
                  <ManagerSettingsHelpSupportEmptyState
                    className="p-8 text-center text-secondary"
                    testId="manager-help-support-tickets-empty"
                  >
                    {searchQuery
                      ? 'No tickets found matching your search query.'
                      : tManagerUi('no_tickets_found')}
                  </ManagerSettingsHelpSupportEmptyState>
                </td>
              </tr>
            ) : (
              paginatedTickets.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12 motion-safe:transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-primary">{t.id}</td>
                  <td className="p-4 text-sm text-primary">{t.subject}</td>
                  <td className="p-4 text-sm text-secondary">
                    {t.category === 'Finance'
                      ? tManagerUi('ticket_category_finance')
                      : t.category === 'General'
                      ? tManagerUi('ticket_category_general')
                      : t.category}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        t.priority === 'High'
                          ? 'bg-danger-bg text-danger'
                          : t.priority === 'Medium'
                          ? 'bg-warning-bg text-warning'
                          : 'bg-success-bg text-success'
                      }`}
                    >
                      {t.priority === 'High'
                        ? tManagerUi('high')
                        : t.priority === 'Medium'
                        ? tManagerUi('medium')
                        : t.priority === 'Low'
                        ? tManagerUi('low')
                        : t.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      {t.status === 'Open' ? (
                        <Clock size={14} className="text-warning" />
                      ) : (
                        <CheckCircle size={14} className="text-success" />
                      )}
                      <span className={t.status === 'Open' ? 'text-warning' : 'text-success'}>
                        {t.status === 'Open'
                          ? tManagerUi('ticket_status_open')
                          : t.status === 'Closed'
                          ? tManagerUi('ticket_status_closed')
                          : t.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-secondary">
                    {formatManagerHelpSupportCalendarDate(t.date, locale)}
                  </td>
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
                <label
                  htmlFor="rows-per-page-settings-help-support"
                  className="text-xs text-secondary whitespace-nowrap"
                >
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
  );
}
