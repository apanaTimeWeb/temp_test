'use client';

import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';
import { DataGrid, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { Armchair, Building2, User, Wrench } from 'lucide-react';
import { useMemo } from 'react';

const LEGEND_ITEMS = [
  { dotCls: 'bg-success-text', label: 'Available Free' },
  { dotCls: 'bg-danger-text', label: 'Occupied' },
  { dotCls: 'bg-warning-text', label: 'Expiring ≤7d' },
  { dotCls: 'bg-text-secondary border border-border', label: 'Maintenance' },
] as const;

export function computeSeatShiftOccupancy(seat: AdminSeatMatrixSeatMatrixViewModel) {
  if (seat.status === 'free' || seat.status === 'maintenance' || !seat.student) {
    return { morning: false, afternoon: false, evening: false, night: false };
  }
  const shiftStr = (seat.shift || '').toLowerCase();
  if (shiftStr.includes('full') || (seat.status === 'occupied' && !seat.shift)) {
    return { morning: true, afternoon: true, evening: true, night: true };
  }
  const m = shiftStr.includes('morning');
  const a = shiftStr.includes('afternoon');
  const e = shiftStr.includes('evening');
  const n = shiftStr.includes('night');
  return { morning: m || (!a && !e && !n), afternoon: a, evening: e, night: n };
}

interface AdminSeatsMatrixFloorPlanViewProps {
  viewMode: 'grid' | 'table';
  isPending: boolean;
  visible: readonly AdminSeatMatrixSeatMatrixViewModel[];
  activeBranchFilter: string;
  onSelectSeat: (seat: AdminSeatMatrixSeatMatrixViewModel) => void;
}

export function AdminSeatsMatrixFloorPlanView({
  viewMode,
  isPending,
  visible,
  activeBranchFilter,
  onSelectSeat,
}: AdminSeatsMatrixFloorPlanViewProps) {
  const tableColumns = useMemo<readonly DataGridColumn<AdminSeatMatrixSeatMatrixViewModel>[]>(() => [
    {
      field: 'id',
      headerName: 'SEAT',
      minWidth: 100,
      sortable: true,
      cellRenderer: ({ data }) => <span className="font-mono font-bold text-primary">S-{data.id}</span>,
    },
    {
      field: 'branchName',
      headerName: 'BRANCH',
      minWidth: 160,
      sortable: true,
      cellRenderer: ({ data }) => {
        const b = data.branchName || 'Downtown Central';
        const lower = b.toLowerCase();
        const cls = lower.includes('downtown')
          ? 'border-success bg-success-bg text-success-text'
          : lower.includes('westside')
            ? 'border-warning bg-warning-bg text-warning-text'
            : 'border-border-focus bg-primary-subtle text-primary';
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
            <Building2 size={11} aria-hidden="true" /> {b}
          </span>
        );
      },
    },
    {
      field: 'status',
      headerName: 'STATUS',
      minWidth: 120,
      sortable: true,
      cellRenderer: ({ data }) => {
        const s = data.status;
        const cls = s === 'free'
          ? 'border-success bg-success-bg text-success-text'
          : s === 'occupied'
            ? 'border-danger bg-danger-bg text-danger-text'
            : s === 'expiring'
              ? 'border-warning bg-warning-bg text-warning-text'
              : 'border-border bg-surface-highlight text-text-secondary';
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${cls}`}>
            <span className="size-1.5 rounded-full bg-current" />
            {s}
          </span>
        );
      },
    },
    {
      field: 'student',
      headerName: 'STUDENT',
      minWidth: 160,
      sortable: true,
      cellRenderer: ({ data }) => <span className="font-semibold text-text-primary">{data.student || '—'}</span>,
    },
    {
      field: 'smartId',
      headerName: 'SMART ID',
      minWidth: 130,
      sortable: true,
      cellRenderer: ({ data }) => <span className="font-mono text-xs text-text-secondary">{data.smartId || '—'}</span>,
    },
    {
      field: 'shift',
      headerName: 'SHIFT',
      minWidth: 130,
      sortable: true,
      cellRenderer: ({ data }) =>
        data.shift ? (
          <span className="inline-flex rounded-lg border border-border-focus bg-primary-subtle px-2 py-0.5 text-xs font-semibold text-primary">
            {data.shift}
          </span>
        ) : (
          <span className="text-text-secondary">—</span>
        ),
    },
    { field: 'plan', headerName: 'PLAN', minWidth: 180, sortable: true, cellRenderer: ({ data }) => <span className="text-xs text-text-secondary truncate">{data.plan || '—'}</span> },
    { field: 'locker', headerName: 'LOCKER', minWidth: 100, sortable: true, cellRenderer: ({ data }) => <span className="font-mono text-xs text-text-secondary">{data.locker || '—'}</span> },
    { field: 'expiry', headerName: 'EXPIRES', minWidth: 120, sortable: true, cellRenderer: ({ data }) => <span className="text-xs text-text-secondary">{data.expiry || '—'}</span> },
    {
      headerName: 'ACTIONS',
      minWidth: 110,
      sortable: false,
      cellRenderer: ({ data }) => (
        <button
          type="button"
          onClick={() => onSelectSeat(data)}
          className="rounded-lg border border-border-focus bg-primary-subtle px-3 py-1 text-xs font-semibold text-primary hover:opacity-90 motion-safe:transition-opacity"
        >
          Manage
        </button>
      ),
    },
  ], [onSelectSeat]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-xs">
        <div className="flex flex-wrap items-center gap-5">
          <span className="font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <Armchair size={14} className="text-primary" aria-hidden="true" /> Desk Status:
          </span>
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="inline-flex items-center gap-2">
              <span className={`size-3 rounded-full shrink-0 ${item.dotCls}`} aria-hidden="true" />
              <span className="font-medium text-text-primary">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-surface-highlight border border-border text-xs">
          <span className="font-semibold text-text-secondary">4 Shift LEDs:</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-success-bg text-success-text border border-success">M/A/E/N = Free</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-danger-bg text-danger-text border border-danger">M/A/E/N = Booked</span>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Armchair size={17} className="text-primary" aria-hidden="true" />
              {activeBranchFilter === 'All Branches' ? 'Library Network Floor Plan' : `${activeBranchFilter} Floor Plan`}
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-success-text font-semibold">{visible.filter((s) => s.status === 'free').length} Free</span>
              <span className="text-text-secondary">•</span>
              <span className="text-danger-text font-semibold">{visible.filter((s) => s.status === 'occupied').length} Occupied</span>
            </div>
          </div>

          {isPending ? (
            <div className="py-16 text-center text-text-secondary" role="status">Loading library floor plan…</div>
          ) : visible.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Armchair size={36} className="mx-auto text-text-secondary" aria-hidden="true" />
              <p className="text-sm font-semibold text-text-primary">No desks found matching active filters</p>
              <p className="text-xs text-text-secondary">Try adjusting your search query, shift, or branch selector.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {visible.map((seat) => {
                const dots = computeSeatShiftOccupancy(seat);
                const isFree = seat.status === 'free';
                const isOccupied = seat.status === 'occupied';
                const isExpiring = seat.status === 'expiring';
                const isMaint = seat.status === 'maintenance';

                const cardBorderBg = isFree
                  ? 'border-success bg-success-bg text-success-text hover:border-border-focus motion-safe:hover:scale-[1.03]'
                  : isOccupied
                    ? 'border-danger bg-danger-bg text-danger-text hover:border-border-focus motion-safe:hover:scale-[1.03]'
                    : isExpiring
                      ? 'border-warning bg-warning-bg text-warning-text hover:border-border-focus motion-safe:hover:scale-[1.03]'
                      : 'border-border bg-surface-highlight text-text-secondary border-dashed motion-safe:hover:scale-[1.02]';

                const statusBadge = isFree
                  ? 'border-success bg-card text-success-text'
                  : isOccupied
                    ? 'border-danger bg-card text-danger-text'
                    : isExpiring
                      ? 'border-warning bg-card text-warning-text'
                      : 'border-border bg-card text-text-secondary';

                return (
                  <button
                    key={seat.uuid ?? seat.id}
                    type="button"
                    data-testid={`admin_seat_matrix-seat-${seat.id}`}
                    onClick={() => onSelectSeat(seat)}
                    className={`group relative flex flex-col justify-between rounded-xl border p-2.5 text-xs font-semibold motion-safe:transition-transform motion-safe:duration-200 cursor-pointer shadow-card min-h-[105px] text-left ${cardBorderBg}`}
                    title={seat.student ? `${seat.student} (${seat.smartId || 'ID'}) · ${seat.shift || 'Full Day'} · Expires: ${seat.expiry || 'Active'}` : isMaint ? 'Under Maintenance' : `Seat S-${seat.id} Available for Allocation`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-xs font-bold tracking-wider text-text-primary">S-{seat.id}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase ${statusBadge}`}>
                        <span className="size-1 rounded-full bg-current" />
                        {seat.status === 'maintenance' ? 'Maint' : seat.status}
                      </span>
                    </div>

                    <div className="my-1 w-full truncate">
                      {seat.student ? (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-text-primary">
                          <User size={11} className="text-primary shrink-0" aria-hidden="true" />
                          <span className="truncate">{seat.student}</span>
                        </div>
                      ) : isMaint ? (
                        <div className="flex items-center gap-1 text-[10px] text-text-secondary font-normal">
                          <Wrench size={10} className="text-warning-text" aria-hidden="true" />
                          <span>Out of Order</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-success-text font-bold flex items-center gap-1">
                          <span>+ Allocate</span>
                        </div>
                      )}
                      <div className="text-[9px] text-text-secondary truncate mt-0.5">{seat.branchName || 'Downtown'}</div>
                    </div>

                    <div className="flex items-center justify-between w-full pt-1.5 border-t border-border text-[9px] font-mono font-bold">
                      {([
                        ['M', 'Morning', dots.morning],
                        ['A', 'Afternoon', dots.afternoon],
                        ['E', 'Evening', dots.evening],
                        ['N', 'Night', dots.night],
                      ] as const).map(([short, label, active]) => (
                        <span
                          key={short}
                          title={`${label}: ${active ? 'Booked' : 'Free'}`}
                          className={`px-1 rounded border ${active ? 'bg-danger-bg text-danger-text border-danger' : 'bg-success-bg text-success-text border-success'}`}
                        >
                          {short}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-4">
          <div className="overflow-hidden rounded-xl border border-border bg-surface-highlight">
            <DataGrid rowData={visible} columnDefs={tableColumns} pagination pageSize={25} emptyMessage="No desks found matching active criteria" />
          </div>
        </div>
      )}
    </>
  );
}
