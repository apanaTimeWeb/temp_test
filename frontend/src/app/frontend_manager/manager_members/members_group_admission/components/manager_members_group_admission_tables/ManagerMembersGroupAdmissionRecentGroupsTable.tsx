'use client';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type GroupSortField = 'batchId' | 'batchName' | 'date' | 'count' | 'shift' | 'status';

export interface RecentGroupAdmission {
  batchId: string;
  batchName: string;
  date: string;
  count: number;
  shift: string;
  status: 'Active' | 'Processed';
}

interface ManagerMembersGroupAdmissionRecentGroupsTableProps {
  recentGroups: RecentGroupAdmission[];
  paginatedGroups: RecentGroupAdmission[];
  filteredGroups: RecentGroupAdmission[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  sortField: GroupSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: GroupSortField) => void;
  totalRows: number;
  effectivePage: number;
  pageCount: number;
  pageSize: number;
  startItem: number;
  endItem: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function ManagerMembersGroupAdmissionRecentGroupsTable({
  recentGroups,
  paginatedGroups,
  filteredGroups,
  searchQuery,
  setSearchQuery,
  sortField,
  sortDirection,
  onToggleSort,
  totalRows,
  effectivePage,
  pageCount,
  pageSize,
  startItem,
  endItem,
  onPageChange,
  onPageSizeChange,
}: ManagerMembersGroupAdmissionRecentGroupsTableProps) {
  const tManagerUi = useTranslations('manager.manager_group_admission.ui');

  const renderSortableHeader = (field: GroupSortField, label: string, align: 'left' | 'center' = 'left') => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`py-3 px-4 ${align === 'center' ? 'text-center' : 'text-left'}`}
      >
        <button
          type="button"
          onClick={() => onToggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${align === 'center' ? 'mx-auto' : ''}`}
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
            <ArrowUpDown size={14} className="text-secondary opacity-40 group-hover:opacity-100 transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="mgr-card p-6 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h3 className="font-bold text-lg text-primary">{tManagerUi('recent_group_admissions')}</h3>
          <span className="text-xs text-secondary">{recentGroups.length} batches enrolled</span>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search batch name, ID, or shift..."
            className="mgr-input pl-8 text-xs w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-highlight text-xs text-secondary uppercase font-semibold text-left">
              {renderSortableHeader('batchId', 'Batch ID')}
              {renderSortableHeader('batchName', 'Batch / Group Name')}
              {renderSortableHeader('date', 'Date')}
              {renderSortableHeader('count', 'Students Count', 'center')}
              {renderSortableHeader('shift', 'Shift')}
              {renderSortableHeader('status', 'Status')}
            </tr>
          </thead>
          <tbody>
            {filteredGroups.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-secondary text-xs">
                  No group admission batches match your search criteria.
                </td>
              </tr>
            ) : (
              paginatedGroups.map((group) => (
                <tr key={group.batchId} className="border-b border-border hover:bg-surface-hover">
                  <td className="py-3 px-4 font-mono font-bold text-primary">{group.batchId}</td>
                  <td className="py-3 px-4 font-semibold text-primary">{group.batchName}</td>
                  <td className="py-3 px-4 text-secondary">{group.date}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-subtle text-primary">
                      {group.count} Students
                    </span>
                  </td>
                  <td className="py-3 px-4 text-secondary">{group.shift}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-success-bg text-success">
                      {group.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalRows > 0 && (
        <div className="border-t border-border mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary">
          <span>
            Showing {startItem}–{endItem} of {totalRows} batch records
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <label htmlFor="group-admissions-rows-per-page" className="text-xs text-secondary whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="group-admissions-rows-per-page"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="rounded border border-border bg-input px-2 py-1 text-xs text-primary"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={effectivePage === 0}
                onClick={() => onPageChange(effectivePage - 1)}
                className="mgr-btn mgr-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs">
                Page {effectivePage + 1} of {pageCount}
              </span>
              <button
                type="button"
                disabled={effectivePage >= pageCount - 1}
                onClick={() => onPageChange(effectivePage + 1)}
                className="mgr-btn mgr-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

