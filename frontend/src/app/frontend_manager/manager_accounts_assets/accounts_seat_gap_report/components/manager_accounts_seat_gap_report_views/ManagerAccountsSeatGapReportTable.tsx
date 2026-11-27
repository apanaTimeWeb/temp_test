'use client';

import { ManagerAccountsSeatGapReportEmptyState } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_empty_states/ManagerAccountsSeatGapReportEmptyState';
import type { GapRow } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/hooks/ManagerAccountsSeatGapReportDemoRepository';
import { formatKnownIsoCalendarDate } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/utils/ManagerAccountsSeatGapReportHelpers';
import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, Clock, Eye, Target, Wrench } from 'lucide-react';

export type GapSortField = 'seatNo' | 'shift' | 'floor' | 'lastOccupied' | 'gapDays' | 'revenueLoss' | 'status';

interface ManagerAccountsSeatGapReportTableProps {
  paginated: GapRow[];
  visibleCount: number;
  totalRows: number;
  startItem: number;
  endItem: number;
  effectivePage: number;
  pageCount: number;
  pageSize: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: (size: number) => void;
  sortField: GapSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: GapSortField) => void;
  searchQuery: string;
  locale: string;
  formatCurrency: (v: number) => string;
  onViewSeat: (seat: GapRow) => void;
  onRetargetSeat: (seat: GapRow) => void;
  onToggleSeatStatus: (seat: GapRow) => void;
  tManagerUi: (key: string) => string;
}

export function ManagerAccountsSeatGapReportTable({
  paginated,
  visibleCount,
  totalRows,
  startItem,
  endItem,
  effectivePage,
  pageCount,
  pageSize,
  setPage,
  setPageSize,
  sortField,
  sortDirection,
  onToggleSort,
  searchQuery,
  locale,
  formatCurrency,
  onViewSeat,
  onRetargetSeat,
  onToggleSeatStatus,
  tManagerUi,
}: ManagerAccountsSeatGapReportTableProps) {
  const renderSortableHeader = (field: GapSortField, label: string, align: 'left' | 'right' = 'left') => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className={`py-3 px-4 ${align === 'right' ? 'text-right' : 'text-left'}`}>
        <button
          type="button"
          onClick={() => onToggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 cursor-pointer ${align === 'right' ? 'ml-auto' : ''}`}
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
            <ArrowUpDown size={14} className="text-secondary opacity-40 group-hover:opacity-100 motion-safe:transition-opacity shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold">
              {renderSortableHeader('seatNo', tManagerUi('seat_no'), 'left')}
              {renderSortableHeader('shift', tManagerUi('shift'), 'left')}
              {renderSortableHeader('floor', tManagerUi('floor'), 'left')}
              {renderSortableHeader('lastOccupied', tManagerUi('last_occupied'), 'left')}
              {renderSortableHeader('gapDays', tManagerUi('gap_days'), 'right')}
              {renderSortableHeader('revenueLoss', tManagerUi('revenue_loss_inr'), 'right')}
              {renderSortableHeader('status', tManagerUi('status'), 'left')}
              <th scope="col" className="text-right py-3 px-4">{tManagerUi('action') || 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleCount === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center">
                  <ManagerAccountsSeatGapReportEmptyState className="fin-empty-state">
                    <div className="fin-empty-state__icon flex justify-center py-2"><span className="text-3xl">🪑</span></div>
                    <p className="fin-empty-state__title">{searchQuery ? 'No gap seats matching your search query.' : tManagerUi('no_gap_seats_found')}</p>
                  </ManagerAccountsSeatGapReportEmptyState>
                </td>
              </tr>
            ) : (
              paginated.map((r) => {
                const isHighGap = r.gapDays > 20;
                const isMidGap = r.gapDays >= 10 && r.gapDays <= 20;
                return (
                  <tr key={r.seatNo} className="hover:bg-surface-hover motion-safe:transition-colors group h-14">
                    <td className="py-3 px-4"><span className="font-bold text-primary text-xs font-mono">{r.seatNo}</span></td>
                    <td className="py-3 px-4 text-xs text-secondary">
                      <span className="font-medium text-primary">
                        {({ Morning: tManagerUi('morning'), Afternoon: tManagerUi('afternoon'), Night: tManagerUi('night') } as Record<string, string>)[r.shift] ?? r.shift}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-secondary">{r.floor.toLowerCase().includes('floor') ? r.floor : `${r.floor} Floor`}</td>
                    <td className="py-3 px-4 text-xs text-secondary whitespace-nowrap">{formatKnownIsoCalendarDate(r.lastOccupied, locale)}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${isHighGap ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : isMidGap ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'}`}>
                        {r.gapDays} {tManagerUi('d') || 'days'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-xs text-rose-400 whitespace-nowrap">{formatCurrency(r.revenueLoss)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${r.status === 'vacant' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
                        {r.status === 'vacant' ? <><Clock size={12} /><span>{tManagerUi('vacant')}</span></> : <><Wrench size={12} /><span>{tManagerUi('maintenance')}</span></>}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button type="button" onClick={() => onViewSeat(r)} className="p-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/15 motion-safe:transition-colors cursor-pointer" title="View Seat Gap Details" aria-label={`View details for seat ${r.seatNo}`}>
                          <Eye size={15} />
                        </button>
                        {r.status === 'vacant' && (
                          <button type="button" onClick={() => onRetargetSeat(r)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/40 shadow-xs motion-safe:transition-all cursor-pointer" title={`Match inquiries & send offer for seat ${r.seatNo}`}>
                            <Target size={12} /><span>Retarget</span>
                          </button>
                        )}
                        <button type="button" onClick={() => onToggleSeatStatus(r)} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs motion-safe:transition-all cursor-pointer ${r.status === 'vacant' ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40'}`} title={r.status === 'vacant' ? 'Mark seat under maintenance' : 'Mark seat as vacant & available'}>
                          {r.status === 'vacant' ? <><Wrench size={12} /><span>Service</span></> : <><CheckCircle2 size={12} /><span>Make Vacant</span></>}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalRows > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-secondary bg-surface-highlight">
          <span>
            Showing <strong className="text-primary font-semibold">{startItem}</strong>–<strong className="text-primary font-semibold">{endItem}</strong> of <strong className="text-primary font-semibold">{totalRows}</strong> results
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label htmlFor="rows-per-page-accounts-seat-gap" className="text-xs text-secondary whitespace-nowrap">Rows per page:</label>
              <select
                id="rows-per-page-accounts-seat-gap"
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
                className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" className="px-2.5 py-1 rounded-lg border border-border text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed motion-safe:transition-colors" disabled={effectivePage <= 0} onClick={() => setPage((c) => Math.max(0, c - 1))}>Previous</button>
              <span className="text-xs text-secondary px-1.5">Page <strong className="text-primary font-semibold">{effectivePage + 1}</strong> of <strong className="text-primary font-semibold">{pageCount}</strong></span>
              <button type="button" className="px-2.5 py-1 rounded-lg border border-border text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed motion-safe:transition-colors" disabled={effectivePage >= pageCount - 1} onClick={() => setPage((c) => Math.min(pageCount - 1, c + 1))}>Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
