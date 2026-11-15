'use client';
import { useTranslations } from 'next-intl';
import { ArrowUpDown, ArrowUp, ArrowDown, ShieldCheck } from 'lucide-react';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';

export type SeatSortField = 'id' | 'wing' | 'shift' | 'status' | 'student' | 'studentGender';

interface ManagerSeatsMatrixTableViewProps {
  filteredTableSeats: SeatData[];
  paginatedTableSeats: SeatData[];
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
  statusFilter?: string;
  setStatusFilter?: (val: string) => void;
  genderFilter?: 'all' | 'Male' | 'Female';
  setGenderFilter?: (val: 'all' | 'Male' | 'Female') => void;
  sortField: SeatSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: SeatSortField) => void;
  onSelectSeat: (seat: SeatData) => void;
  onViewStudentProfile?: (seat: SeatData) => void;
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
  onViewStudentProfile,
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
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-primary">Seat Directory & Roster Table</h2>
          <p className="text-xs text-secondary mt-0.5">
            Unified tabular seat registry with instant allocation & maintenance controls
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface border border-border text-secondary shrink-0">
          {filteredTableSeats.length} seats registered
        </span>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="mgr-table min-w-[680px] w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-floating text-secondary text-xs uppercase font-semibold">
              {renderSortableHeader('id', 'Seat ID', 'w-1/12')}
              {renderSortableHeader('wing', 'Wing / Zone', 'w-2/12')}
              {renderSortableHeader('shift', 'Shift', 'w-2/12')}
              {renderSortableHeader('status', 'Status', 'w-2/12')}
              {renderSortableHeader('student', 'Assigned Student', 'w-2/12')}
              {renderSortableHeader('studentGender', 'Gender', 'w-2/12')}
              <th className="py-3 px-4 w-1/12 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTableSeats.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-secondary">
                  No seats matching current criteria.
                </td>
              </tr>
            ) : (
              paginatedTableSeats.map((seat) => (
                <tr key={seat.uuid || seat.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-primary">{seat.id}</td>
                  <td className="py-3 px-4 text-secondary text-xs">{seat.wing || 'North Reading Hall (AC)'}</td>
                  <td className="py-3 px-4 text-xs">{shiftLabel(seat.shift)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        seat.status === 'free'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : seat.status === 'occupied'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : seat.status === 'expiring'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : seat.status === 'maintenance'
                          ? 'bg-secondary/15 text-secondary border border-border'
                          : 'bg-floating text-secondary border border-border'
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
                      <div className="flex items-center justify-between group max-w-[200px]">
                        <div>
                          <button
                            type="button"
                            onClick={() => (onViewStudentProfile ? onViewStudentProfile(seat) : onSelectSeat(seat))}
                            className="font-semibold text-primary block leading-tight hover:text-indigo-400 hover:underline text-left cursor-pointer transition-colors"
                            title={`Preview Profile & KYC of ${seat.student}`}
                          >
                            {seat.student}
                          </button>
                          <span className="text-xs text-secondary font-mono">{seat.smartId || '—'}</span>
                        </div>
                        {onViewStudentProfile && (
                          <button
                            type="button"
                            onClick={() => onViewStudentProfile(seat)}
                            title={`Directly View Profile & KYC of ${seat.student}`}
                            className="opacity-70 group-hover:opacity-100 p-1 rounded-md text-indigo-400 hover:bg-indigo-500/15 hover:text-indigo-300 transition-all cursor-pointer ml-1.5 shrink-0"
                          >
                            <ShieldCheck size={14} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-secondary text-xs italic">— Unassigned —</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {seat.student && seat.studentGender ? (
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                          seat.studentGender === 'Female'
                            ? 'bg-primary-subtle text-primary border-primary/20'
                            : 'bg-surface text-secondary border-border'
                        }`}
                      >
                        {seat.studentGender === 'Female' ? '👩 Female' : '👨 Male'}
                      </span>
                    ) : (
                      <span className="text-secondary text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {seat.student && onViewStudentProfile && (
                        <button
                          type="button"
                          onClick={() => onViewStudentProfile(seat)}
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/15 border border-indigo-500/20 transition-all cursor-pointer"
                          title={`Direct Profile & KYC of ${seat.student}`}
                        >
                          <ShieldCheck size={12} />
                          <span className="hidden sm:inline">Profile</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectSeat(seat)}
                        className="mgr-btn-ghost text-xs px-2.5 py-1 text-primary hover:text-info cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>
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

