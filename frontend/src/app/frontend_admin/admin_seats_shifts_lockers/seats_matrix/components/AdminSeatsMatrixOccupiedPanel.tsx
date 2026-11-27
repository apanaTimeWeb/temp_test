'use client';

import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';
import { CheckCircle2, Wrench } from 'lucide-react';

const SHIFT_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'] as const;

interface AdminSeatsMatrixOccupiedPanelProps {
  selectedSeat: AdminSeatMatrixSeatMatrixViewModel;
  onClose: () => void;
  onVacate: () => void;
  onToggleMaintenance: (targetStatus: 'maintenance' | 'free') => void;
  onQuickShiftChange: (nextShift: string) => void;
}

export function AdminSeatsMatrixOccupiedPanel({
  selectedSeat,
  onClose,
  onVacate,
  onToggleMaintenance,
  onQuickShiftChange,
}: AdminSeatsMatrixOccupiedPanelProps) {
  if (selectedSeat.status === 'occupied' || selectedSeat.status === 'expiring') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-4">
          <div className="size-11 rounded-full bg-primary-subtle border border-border-focus text-primary flex items-center justify-center font-bold text-sm">
            {selectedSeat.student?.slice(0, 2).toUpperCase() || 'ST'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-text-primary truncate">{selectedSeat.student}</h3>
            <p className="font-mono text-xs text-text-secondary mt-0.5">{selectedSeat.smartId || 'No ID'}</p>
          </div>
          {selectedSeat.status === 'expiring' && (
            <span className="rounded-full bg-warning-bg border border-warning px-2.5 py-0.5 text-[10px] font-bold text-warning-text uppercase">
              Expiring Soon
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="rounded-xl border border-border bg-surface-highlight p-3">
            <p className="text-[10px] font-semibold uppercase text-text-secondary">Branch</p>
            <p className="mt-1 font-semibold text-text-primary">{selectedSeat.branchName || 'Downtown Central'}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface-highlight p-3">
            <p className="text-[10px] font-semibold uppercase text-text-secondary">Shift Timing</p>
            <select
              aria-label="Shift Timing"
              value={selectedSeat.shift || 'Full Day'}
              onChange={(e) => onQuickShiftChange(e.target.value)}
              className="mt-1 rounded-lg border border-border bg-input px-2 py-0.5 text-xs font-semibold text-primary focus:outline-none"
            >
              {SHIFT_OPTIONS.map((sh) => (<option key={sh} value={sh}>{sh}</option>))}
            </select>
          </div>
          <div className="rounded-xl border border-border bg-surface-highlight p-3">
            <p className="text-[10px] font-semibold uppercase text-text-secondary">Mobile Phone</p>
            <p className="mt-1 font-mono font-semibold text-text-primary">{selectedSeat.phone || '9876543210'}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface-highlight p-3">
            <p className="text-[10px] font-semibold uppercase text-text-secondary">Locker Assigned</p>
            <p className="mt-1 font-mono font-semibold text-text-primary">{selectedSeat.locker || 'None'}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface-highlight p-3">
            <p className="text-[10px] font-semibold uppercase text-text-secondary">Plan</p>
            <p className="mt-1 font-semibold text-text-primary truncate">{selectedSeat.plan || 'Full Day Dedicated Desk'}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface-highlight p-3">
            <p className="text-[10px] font-semibold uppercase text-text-secondary">Expires</p>
            <p className="mt-1 font-semibold text-text-primary">{selectedSeat.expiry || 'Active'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onVacate} className="rounded-xl border border-danger bg-danger-bg px-3.5 py-2 text-xs font-semibold text-danger-text hover:opacity-90 motion-safe:transition-opacity">
              Release Desk (Vacate)
            </button>
            <button type="button" onClick={() => onToggleMaintenance('maintenance')} className="rounded-xl border border-warning bg-warning-bg px-3.5 py-2 text-xs font-semibold text-warning-text hover:opacity-90 motion-safe:transition-opacity">
              Maintenance
            </button>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-warning bg-warning-bg p-4 space-y-2">
        <div className="flex items-center gap-2 text-warning-text font-bold text-xs uppercase tracking-wider">
          <Wrench size={16} aria-hidden="true" /> Desk Under Maintenance
        </div>
        <p className="text-xs text-text-primary leading-relaxed">
          This desk is marked as broken or undergoing repair. Students cannot book or sit at this desk until maintenance is resolved.
        </p>
      </div>
      <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
        <button type="button" onClick={onClose} className="rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary">
          Close
        </button>
        <button type="button" onClick={() => onToggleMaintenance('free')} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors">
          <CheckCircle2 size={15} aria-hidden="true" />
          <span>Mark Fixed &amp; Available</span>
        </button>
      </div>
    </div>
  );
}
