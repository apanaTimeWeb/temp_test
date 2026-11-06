'use client';
import { useTranslations } from 'next-intl';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';

export type SeatSortField = 'id' | 'wing' | 'shift' | 'status' | 'student';

interface ManagerSeatsMatrixTableViewProps {
  filteredTableSeats: SeatData[];
  paginatedTableSeats: SeatData[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  genderFilter: 'all' | 'Male' | 'Female';
  setGenderFilter: (val: 'all' | 'Male' | 'Female') => void;
  sortField: SeatSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: SeatSortField) => void;
  onSelectSeat: (seat: SeatData) => void;
  shiftLabel: (val?: string) => string;
  page: number;
  pageSize: number;
  totalTablePages: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function ManagerSeatsMatrixTableView({
  filteredTableSeats,
  paginatedTableSeats,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  genderFilter,
  setGenderFilter,
  sortField,
  sortDirection,
  onToggleSort,
  onSelectSeat,
  shiftLabel,
  page,
  pageSize,
  totalTablePages,
  onPageChange,
  onPageSizeChange,
}: ManagerSeatsMatrixTableViewProps) {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');

  const renderSortableHeader = (field: SeatSortField, label: string, widthClass: string) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`py-3 px-4 ${widthClass}`}
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
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Seat Directory & Roster Table</h2>
          <p className="text-xs text-secondary mt-0.5">
            Unified tabular seat registry with instant allocation & maintenance controls
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="search"
              placeholder="Filter seats or students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mgr-input pl-9 w-full text-xs"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mgr-select text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="free">Available (Free)</option>
            <option value="occupied">Occupied</option>
            <option value="expiring">Expiring Soon</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <select
            aria-label="Table gender filter"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as 'all' | 'Male' | 'Female')}
            className="mgr-select text-xs"
          >
            <option value="all">All Genders</option>
            <option value="Male">👨 Male</option>
            <option value="Female">👩 Female</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="mgr-table w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-floating text-secondary text-xs uppercase font-semibold">
              {renderSortableHeader('id', 'Seat ID', 'w-2/12')}
              {renderSortableHeader('wing', 'Wing / Zone', 'w-2/12')}
              {renderSortableHeader('shift', 'Shift', 'w-2/12')}
              {renderSortableHeader('status', 'Status', 'w-2/12')}
              {renderSortableHeader('student', 'Assigned Student', 'w-3/12')}
              <th className="py-3 px-4 w-1/12 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTableSeats.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-secondary">
                  No seats matching current criteria.
                </td>
              </tr>
            ) : (
              paginatedTableSeats.map((seat) => (
                <tr key={seat.uuid || seat.id} className="border-b border-border/50 hover:bg-floating/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-primary">{seat.id}</td>
                  <td className="py-3 px-4 text-secondary text-xs">{seat.wing || 'North Reading Hall (AC)'}</td>
                  <td className="py-3 px-4 text-xs">{shiftLabel(seat.shift)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border border-border ${
                        seat.status === 'free'
                          ? 'bg-success-bg text-success'
                          : seat.status === 'occupied'
                          ? 'bg-danger-bg text-danger'
                          : seat.status === 'expiring'
                          ? 'bg-warning-bg text-warning'
                          : seat.status === 'maintenance'
                          ? 'bg-warning-bg text-warning'
                          : 'bg-floating text-secondary'
                      }`}
                    >
                      {seat.status === 'free'
                        ? tManagerUi('available')
                        : seat.status === 'occupied'
                        ? tManagerUi('occupied')
                        : seat.status === 'expiring'
                        ? tManagerUi('expiring_soon')
                        : seat.status === 'maintenance'
                        ? tManagerUi('maintenance')
                        : 'Unknown'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {seat.student ? (
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-primary block leading-tight">{seat.student}</span>
                          {seat.studentGender && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                seat.studentGender === 'Female'
                                  ? 'bg-primary-subtle text-primary'
                                  : 'bg-muted text-secondary'
                              }`}
                            >
                              {seat.studentGender === 'Female' ? '👩 F' : '👨 M'}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-secondary font-mono">{seat.smartId || '—'}</span>
                      </div>
                    ) : (
                      <span className="text-secondary text-xs italic">— Unassigned —</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectSeat(seat)}
                      className="mgr-btn-ghost text-xs px-2.5 py-1 text-primary hover:text-info"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border text-xs text-secondary">
        <span>
          Showing {filteredTableSeats.length === 0 ? 0 : page * pageSize + 1}–
          {Math.min((page + 1) * pageSize, filteredTableSeats.length)} of {filteredTableSeats.length} results
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <label htmlFor="rows-per-page-seats-matrix" className="text-xs text-secondary whitespace-nowrap">
              Rows per page:
            </label>
            <select
              id="rows-per-page-seats-matrix"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
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
              disabled={page === 0}
              onClick={() => onPageChange(Math.max(0, page - 1))}
              className="mgr-btn-ghost text-xs px-3 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-secondary px-1">
              Page {page + 1} of {totalTablePages}
            </span>
            <button
              type="button"
              disabled={page >= totalTablePages - 1}
              onClick={() => onPageChange(Math.min(totalTablePages - 1, page + 1))}
              className="mgr-btn-ghost text-xs px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

