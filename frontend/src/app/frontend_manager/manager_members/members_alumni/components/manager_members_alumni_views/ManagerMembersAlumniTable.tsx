'use client';
import { ArrowUpDown, ArrowUp, ArrowDown, Award, Briefcase, Search, X } from 'lucide-react';
import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';

export type AlumniSortField = 'id' | 'name' | 'phone' | 'leftDate' | 'duration' | 'exam' | 'currentStatus';

interface ManagerMembersAlumniTableProps {
  filteredAlumni: MembersAlumniRow[];
  paginatedAlumni: MembersAlumniRow[];
  totalRows: number;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  yearFilter: string;
  setYearFilter: (val: string) => void;
  examFilter: string;
  setExamFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  sortField: AlumniSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: AlumniSortField) => void;
  page: number;
  pageSize: number;
  pageCount: number;
  startItem: number;
  endItem: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function ManagerMembersAlumniTable({
  filteredAlumni,
  paginatedAlumni,
  totalRows,
  searchQuery,
  setSearchQuery,
  yearFilter,
  setYearFilter,
  examFilter,
  setExamFilter,
  statusFilter,
  setStatusFilter,
  hasActiveFilters,
  onResetFilters,
  sortField,
  sortDirection,
  onToggleSort,
  page,
  pageSize,
  pageCount,
  startItem,
  endItem,
  onPageChange,
  onPageSizeChange,
}: ManagerMembersAlumniTableProps) {
  const effectivePage = Math.min(page, pageCount - 1);

  const renderSortableHeader = (field: AlumniSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className="py-3 px-4"
      >
        <button
          type="button"
          onClick={() => onToggleSort(field)}
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
            <ArrowUpDown size={14} className="text-secondary opacity-40 group-hover:opacity-100 transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <>
      {/* Filter & Search Bar */}
      <div className="mgr-card p-4 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="mgr-input-icon-wrap flex-1">
            <Search size={16} className="mgr-input-icon text-secondary" />
            <input
              type="search"
              placeholder="Search by student name, qualified exam, or phone..."
              className="mgr-input mgr-input-with-icon"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Year Filter */}
          <div className="w-full md:w-44">
            <select
              aria-label="Filter by Year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="mgr-select text-xs"
            >
              <option value="All">All Years</option>
              <option value="2026">2026 Alumni</option>
              <option value="2025">2025 Alumni</option>
              <option value="2024">2024 Alumni</option>
            </select>
          </div>

          {/* Exam Domain Filter */}
          <div className="w-full md:w-48">
            <select
              aria-label="Filter by Exam Category"
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="mgr-select text-xs"
            >
              <option value="All">All Exam Domains</option>
              <option value="UPSC">UPSC Civil Services</option>
              <option value="Banking">Banking & Finance (SBI/RBI)</option>
              <option value="PSC">State PSC & SSC</option>
              <option value="CA">Chartered Accountancy</option>
              <option value="Technical">GATE & NEET PG</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-44">
            <select
              aria-label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mgr-select text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Cleared Exam">Cleared Exam</option>
              <option value="Employed">Employed</option>
              <option value="Higher Studies">Higher Studies</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer shrink-0 self-center"
              title="Reset all filters"
            >
              <X size={13} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Alumni Records Table */}
      <div className="mgr-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold text-left">
                {renderSortableHeader('id', 'Alumni ID')}
                {renderSortableHeader('name', 'Student Name')}
                {renderSortableHeader('phone', 'Contact Phone')}
                {renderSortableHeader('leftDate', 'Completion Date')}
                {renderSortableHeader('duration', 'Tenure')}
                {renderSortableHeader('exam', 'Exam & Rank / Post')}
                <th scope="col" className="py-3 px-4">Junior Advice / Review</th>
                {renderSortableHeader('currentStatus', 'Status')}
              </tr>
            </thead>
            <tbody>
              {filteredAlumni.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-secondary">
                    No alumni records matching the selected search query and filters.
                  </td>
                </tr>
              ) : (
                paginatedAlumni.map((alumnus) => (
                  <tr key={alumnus.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                    <td className="py-3 px-4 font-mono font-bold text-primary">{alumnus.id}</td>
                    <td className="py-3 px-4 font-semibold text-primary">{alumnus.name}</td>
                    <td className="py-3 px-4 font-mono text-secondary text-xs">{alumnus.phone}</td>
                    <td className="py-3 px-4 text-secondary text-xs">{alumnus.leftDate}</td>
                    <td className="py-3 px-4 text-secondary text-xs">{alumnus.duration}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-success flex items-center gap-1.5">
                          <Award size={14} className="shrink-0" /> {alumnus.exam}
                        </span>
                        {alumnus.designation ? (
                          <span className="text-xs text-secondary flex items-center gap-1">
                            <Briefcase size={12} className="shrink-0" /> {alumnus.designation}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      {alumnus.testimonial ? (
                        <p className="text-xs text-secondary italic line-clamp-2" title={alumnus.testimonial}>
                          “{alumnus.testimonial}”
                        </p>
                      ) : (
                        <span className="text-xs text-secondary opacity-40">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${alumnus.currentStatus === 'Cleared Exam'
                          ? 'bg-success-bg text-success'
                          : alumnus.currentStatus === 'Employed'
                            ? 'bg-info-bg text-info'
                            : 'bg-warning-bg text-warning'
                          }`}
                      >
                        {alumnus.currentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalRows > 0 && (
          <div className="border-t border-border px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary">
            <span>
              Showing {startItem}–{endItem} of {totalRows} alumni records
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <label htmlFor="alumni-rows-per-page" className="text-xs text-secondary whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  id="alumni-rows-per-page"
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
    </>
  );
}

