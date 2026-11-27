'use client';

import { AdminSeatsMatrixOccupiedPanel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/components/AdminSeatsMatrixOccupiedPanel';
import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { addDays, format } from 'date-fns';
import { Armchair, Building2, CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const PLAN_OPTIONS = [
  'Full Day Dedicated Desk',
  'Flexi Shift Half Day',
  'Night Owl Special',
  'Weekend Warrior Pass',
  'Monthly Reserved Cabin',
];

const SHIFT_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'] as const;
type SeatShiftOption = (typeof SHIFT_OPTIONS)[number];

function parseShiftOption(val: string): SeatShiftOption {
  return SHIFT_OPTIONS.find((item) => item === val) ?? 'Full Day';
}

export interface SeatAllocationInput {
  student: string;
  smartId: string;
  phone: string;
  shift: SeatShiftOption;
  plan: string;
  locker: string;
  expiry: string;
}

interface AdminSeatsMatrixSeatDetailModalProps {
  selectedSeat: AdminSeatMatrixSeatMatrixViewModel | null;
  onClose: () => void;
  onAllocate: (data: SeatAllocationInput) => void;
  onVacate: () => void;
  onToggleMaintenance: (targetStatus: 'maintenance' | 'free') => void;
  onQuickShiftChange: (nextShift: string) => void;
}

export function AdminSeatsMatrixSeatDetailModal({
  selectedSeat,
  onClose,
  onAllocate,
  onVacate,
  onToggleMaintenance,
  onQuickShiftChange,
}: AdminSeatsMatrixSeatDetailModalProps) {
  const [assignStudent, setAssignStudent] = useState('');
  const [assignSmartId, setAssignSmartId] = useState('');
  const [assignPhone, setAssignPhone] = useState('');
  const [assignShift, setAssignShift] = useState<SeatShiftOption>('Full Day');
  const [assignPlan, setAssignPlan] = useState(PLAN_OPTIONS[0]);
  const [assignLocker, setAssignLocker] = useState('');
  const [assignExpiry, setAssignExpiry] = useState(() => format(addDays(new Date(), 30), 'yyyy-MM-dd'));

  useEffect(() => {
    if (selectedSeat && selectedSeat.status === 'free') {
      const generatedId = `SL-${selectedSeat.branchId || 'BR'}-${Date.now().toString().slice(-4)}`;
      setAssignStudent('');
      setAssignSmartId(generatedId);
      setAssignPhone('');
      setAssignShift('Full Day');
      setAssignPlan(PLAN_OPTIONS[0]);
      setAssignLocker(`L-${selectedSeat.id}`);
      setAssignExpiry(format(addDays(new Date(), 30), 'yyyy-MM-dd'));
    }
  }, [selectedSeat]);

  if (!selectedSeat) return null;

  const statusPillCls =
    selectedSeat.status === 'free'
      ? 'border-success bg-success-bg text-success-text'
      : selectedSeat.status === 'occupied'
        ? 'border-danger bg-danger-bg text-danger-text'
        : selectedSeat.status === 'expiring'
          ? 'border-warning bg-warning-bg text-warning-text'
          : 'border-border bg-surface-highlight text-text-secondary';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAllocate({
      student: assignStudent,
      smartId: assignSmartId,
      phone: assignPhone,
      shift: assignShift,
      plan: assignPlan,
      locker: assignLocker,
      expiry: assignExpiry,
    });
  };

  return (
    <Dialog open={Boolean(selectedSeat)} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="w-full max-w-lg rounded-2xl border border-border bg-overlay p-6 shadow-dialog text-text-primary space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3.5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-subtle border border-border-focus text-primary">
              <Armchair size={20} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-text-primary">Desk S-{selectedSeat.id}</DialogTitle>
              <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                <Building2 size={12} className="text-primary" aria-hidden="true" />
                {selectedSeat.branchName || 'Downtown Central'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase ${statusPillCls}`}>
              <span className="size-1.5 rounded-full bg-current" />
              {selectedSeat.status}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {selectedSeat.status === 'free' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-xl border border-success bg-success-bg p-3 text-xs text-success-text">
              ✨ <strong>Desk is Available:</strong> Enter student details below to allocate this desk instantly.
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="admin-seat-student">
                Student Full Name <span className="text-danger-text">*</span>
              </label>
              <input
                maxLength={30}
                id="admin-seat-student"
                type="text"
                required
                value={assignStudent}
                onChange={(e) => setAssignStudent(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-text-primary focus:border-border-focus focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="admin-seat-phone">Mobile Number</label>
                <input
                  id="admin-seat-phone"
                  type="tel"
                  maxLength={15}
                  inputMode="tel"
                  value={assignPhone}
                  onChange={(e) => setAssignPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-text-primary focus:border-border-focus focus:outline-none font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="admin-seat-smartid">Smart ID / Card</label>
                <input
                  maxLength={30}
                  id="admin-seat-smartid"
                  type="text"
                  value={assignSmartId}
                  onChange={(e) => setAssignSmartId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-text-primary focus:border-border-focus focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="admin-seat-shift">Shift Timing</label>
                <select
                  id="admin-seat-shift"
                  value={assignShift}
                  onChange={(e) => setAssignShift(parseShiftOption(e.target.value))}
                  className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:border-border-focus focus:outline-none cursor-pointer"
                >
                  {SHIFT_OPTIONS.map((sh) => (<option key={sh} value={sh}>{sh}</option>))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="admin-seat-plan">Membership Plan</label>
                <select
                  id="admin-seat-plan"
                  value={assignPlan}
                  onChange={(e) => setAssignPlan(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:border-border-focus focus:outline-none cursor-pointer"
                >
                  {PLAN_OPTIONS.map((pl) => (<option key={pl} value={pl}>{pl}</option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="admin-seat-locker">Locker (Optional)</label>
                <input
                  maxLength={30}
                  id="admin-seat-locker"
                  type="text"
                  value={assignLocker}
                  onChange={(e) => setAssignLocker(e.target.value)}
                  placeholder="e.g. L-04"
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-xs text-text-primary focus:border-border-focus focus:outline-none font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="admin-seat-expiry">Valid Until Date</label>
                <input
                  id="admin-seat-expiry"
                  type="date"
                  value={assignExpiry}
                  onChange={(e) => setAssignExpiry(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:border-border-focus focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => onToggleMaintenance('maintenance')}
                className="rounded-xl border border-warning bg-warning-bg px-3 py-2 text-xs font-semibold text-warning-text hover:opacity-90 motion-safe:transition-opacity"
              >
                Mark Maintenance
              </button>
              <div className="flex items-center gap-2">
                <button type="button" onClick={onClose} className="rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary">
                  Cancel
                </button>
                <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors">
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span>Allocate Seat</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <AdminSeatsMatrixOccupiedPanel
            selectedSeat={selectedSeat}
            onClose={onClose}
            onVacate={onVacate}
            onToggleMaintenance={onToggleMaintenance}
            onQuickShiftChange={onQuickShiftChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
