'use client';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Award,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  CheckCircle2,
  Phone,
  Quote,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';

export type AlumniSortField = 'id' | 'name' | 'phone' | 'leftDate' | 'duration' | 'exam' | 'currentStatus';

export interface ManagerMembersAlumniTableProps {
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
  onDeleteAlumni?: (id: string) => void;
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
  onDeleteAlumni,
}: ManagerMembersAlumniTableProps) {
  const effectivePage = Math.min(page, pageCount - 1);

  const renderSortableHeader = (field: AlumniSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className="py-3 px-4 text-left align-middle whitespace-nowrap"
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
            <ArrowUpDown size={14} className="text-primary/70 group-hover:text-primary transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <>
      {/* Filter & Search Bar - Icons colored by default */}
      <div className="mgr-card p-3 sm:p-4 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Box - zero icon overlap with !pl-10 and vibrant primary search icon */}
          <div className="mgr-input-icon-wrap relative flex-1 min-w-0">
            <Search size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
            <input
              type="search"
              maxLength={80}
              placeholder="Search by student name, qualified exam, or phone..."
              className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9"
              data-testid="manager-alumni-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.slice(0, 80))}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-danger hover:opacity-80 rounded-full transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={14} className="shrink-0 text-danger" />
              </button>
            )}
          </div>

          {/* Filter Controls Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:items-center gap-2.5 sm:gap-3">
            {/* Year Filter */}
            <div className="w-full lg:w-36">
              <select
                data-testid="manager-alumni-year-filter"
                aria-label="Filter by Year"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="mgr-select text-xs w-full h-9"
              >
                <option value="All">All Years</option>
                <option value="2026">2026 Alumni</option>
                <option value="2025">2025 Alumni</option>
                <option value="2024">2024 Alumni</option>
              </select>
            </div>

            {/* Exam Domain Filter */}
            <div className="w-full lg:w-44">
              <select
                data-testid="manager-alumni-exam-filter"
                aria-label="Filter by Exam Category"
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value)}
                className="mgr-select text-xs w-full h-9"
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
            <div className="w-full lg:w-36">
              <select
                data-testid="manager-alumni-status-filter"
                aria-label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mgr-select text-xs w-full h-9"
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
                data-testid="manager-alumni-reset-filters"
                onClick={onResetFilters}
                className="inline-flex items-center justify-center gap-1.5 px-3 h-9 rounded-lg border border-border text-xs font-semibold text-danger hover:bg-danger-bg cursor-pointer shrink-0 col-span-full lg:col-auto w-full lg:w-auto transition-colors"
                title="Reset all filters"
              >
                <X size={14} className="text-danger shrink-0" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alumni Records Table */}
      <div className="mgr-card overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-xs sm:text-sm min-w-[850px]" data-testid="manager-alumni-table">
            <thead>
              <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold text-left">
                {renderSortableHeader('id', 'Alumni ID')}
                {renderSortableHeader('name', 'Student Name')}
                {renderSortableHeader('phone', 'Contact Phone')}
                {renderSortableHeader('leftDate', 'Completion Date')}
                {renderSortableHeader('duration', 'Tenure')}
                {renderSortableHeader('exam', 'Exam & Rank / Post')}
                <th scope="col" className="py-3 px-4 text-left align-middle whitespace-nowrap">Junior Advice / Review</th>
                {renderSortableHeader('currentStatus', 'Status')}
                <th scope="col" className="py-3 px-4 text-right align-middle whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlumni.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-secondary text-xs sm:text-sm align-middle">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <GraduationCap size={36} className="text-primary shrink-0" />
                      <p className="font-medium">No alumni records matching the selected search query and filters.</p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={onResetFilters}
                          className="mt-1 text-xs text-primary hover:underline font-semibold"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAlumni.map((alumnus) => (
                  <tr key={alumnus.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary align-middle whitespace-nowrap">{alumnus.id}</td>
                    <td className="py-3 px-4 font-semibold text-primary align-middle whitespace-nowrap">{alumnus.name}</td>
                    <td className="py-3 px-4 font-mono text-secondary text-xs align-middle whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone size={13} className="text-info shrink-0" />
                        {alumnus.phone.replace(/\D/g, '').length === 10
                          ? `+91 ${alumnus.phone.replace(/\D/g, '').slice(0, 5)} ${alumnus.phone.replace(/\D/g, '').slice(5)}`
                          : alumnus.phone}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-secondary text-xs align-middle whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-primary shrink-0" />
                        {alumnus.leftDate}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-secondary text-xs align-middle whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={13} className="text-warning shrink-0" />
                        {alumnus.duration}
                      </span>
                    </td>
                    <td className="py-3 px-4 align-middle">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-success flex items-center gap-1.5">
                          <Award size={15} className="text-success shrink-0" /> {alumnus.exam}
                        </span>
                        {alumnus.designation ? (
                          <span className="text-xs text-secondary flex items-center gap-1">
                            <Briefcase size={13} className="text-info shrink-0" /> {alumnus.designation}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs align-middle">
                      {alumnus.testimonial ? (
                        <div className="flex items-start gap-1 text-xs text-secondary italic">
                          <Quote size={13} className="text-primary shrink-0 mt-0.5" />
                          <p className="line-clamp-2" title={alumnus.testimonial}>
                            {alumnus.testimonial}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-secondary opacity-40">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          alumnus.currentStatus === 'Cleared Exam'
                            ? 'bg-success-bg text-success'
                            : alumnus.currentStatus === 'Employed'
                              ? 'bg-info-bg text-info'
                              : 'bg-warning-bg text-warning'
                        }`}
                      >
                        {alumnus.currentStatus === 'Cleared Exam' && <CheckCircle2 size={13} className="shrink-0 text-success" />}
                        {alumnus.currentStatus === 'Employed' && <Briefcase size={13} className="shrink-0 text-info" />}
                        {alumnus.currentStatus === 'Higher Studies' && <GraduationCap size={13} className="shrink-0 text-warning" />}
                        <span>{alumnus.currentStatus}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right align-middle whitespace-nowrap">
                      {onDeleteAlumni && (
                        <button
                          type="button"
                          onClick={() => onDeleteAlumni(alumnus.id)}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border text-danger hover:border-danger hover:bg-danger-bg transition-colors"
                          title={`Remove ${alumnus.name} from directory`}
                          aria-label={`Remove ${alumnus.name}`}
                        >
                          <Trash2 size={15} className="shrink-0 text-danger" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalRows > 0 && (
          <div className="border-t border-border px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary">
            <span className="text-center sm:text-left">
              Showing <strong className="text-primary font-semibold">{startItem}–{endItem}</strong> of <strong className="text-primary font-semibold">{totalRows}</strong> alumni records
            </span>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-1.5">
                <label htmlFor="alumni-rows-per-page" className="text-xs text-secondary whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  id="alumni-rows-per-page"
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="rounded-lg border border-border bg-input px-2 h-8 text-xs text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="manager-alumni-pagination-prev"
                  disabled={effectivePage === 0}
                  onClick={() => onPageChange(effectivePage - 1)}
                  className="mgr-btn mgr-btn-secondary h-8 px-3 text-xs disabled:opacity-40 inline-flex items-center gap-1.5"
                >
                  <ChevronLeft size={15} className="shrink-0 text-primary" />
                  <span>Previous</span>
                </button>
                <span className="text-xs whitespace-nowrap px-1">
                  Page <strong className="text-primary">{effectivePage + 1}</strong> of <strong className="text-primary">{pageCount}</strong>
                </span>
                <button
                  type="button"
                  data-testid="manager-alumni-pagination-next"
                  disabled={effectivePage >= pageCount - 1}
                  onClick={() => onPageChange(effectivePage + 1)}
                  className="mgr-btn mgr-btn-secondary h-8 px-3 text-xs disabled:opacity-40 inline-flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight size={15} className="shrink-0 text-primary" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
