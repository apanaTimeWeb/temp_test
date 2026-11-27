'use client';
// Responsibility: Modal dialog for inspecting, allocating, vacating, and maintaining library lockers.

import { AdminLockersMatrixOccupiedPanel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixOccupiedPanel';
import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { CheckCircle2, Info, KeyRound, ShieldCheck, Wrench, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ADMIN_LOCKER_MATRIX_STATUS_CLASS = {
  free: 'border-success bg-success-bg text-success-text',
  occupied: 'border-danger bg-danger-bg text-danger-text',
  maintenance: 'border-warning bg-warning-bg text-warning-text',
  unknown: 'border-border bg-surface-highlight text-text-secondary',
} as const;

interface AdminLockersMatrixDetailModalProps {
  locker: AdminLockersLockerMatrixViewModel | null;
  branchName?: string;
  onClose: () => void;
  onAllocate?: (data: {
    student: string;
    smartId?: string;
    phone?: string;
    shift?: string;
    expiry?: string;
    fee?: number;
  }) => void;
  onVacate?: () => void;
  onSetMaintenance?: (isMaintenance: boolean) => void;
}

const SHIFT_OPTIONS = ['Full Day Dedicated', 'Morning Shift', 'Afternoon Shift', 'Evening Shift', 'Night Owl'];

export function AdminLockersMatrixDetailModal({
  locker,
  branchName,
  onClose,
  onAllocate,
  onVacate,
  onSetMaintenance,
}: AdminLockersMatrixDetailModalProps) {
  const [studentName, setStudentName] = useState('');
  const [smartId, setSmartId] = useState('');
  const [phone, setPhone] = useState('');
  const [shift, setShift] = useState(SHIFT_OPTIONS[0]);
  const [monthlyFee, setMonthlyFee] = useState(300);
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (locker) {
      setStudentName('');
      setSmartId(`SL-${locker.id}-${Math.floor(1000 + Math.random() * 9000)}`);
      setPhone('');
      setShift(SHIFT_OPTIONS[0]);
      setMonthlyFee(300);
      setFormError(null);
    }
  }, [locker]);

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setFormError('Please enter the student full name.');
      return;
    }
    onAllocate?.({
      student: studentName.trim(),
      smartId: smartId.trim() || undefined,
      phone: phone.trim() || undefined,
      shift,
      expiry: expiryDate,
      fee: Number(monthlyFee) || 300,
    });
  };

  if (!locker) return null;

  return (
    <Dialog open={Boolean(locker)} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-overlay p-6 text-text-primary shadow-dialog">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border-focus bg-primary-subtle p-2.5 text-primary">
              <KeyRound size={22} aria-hidden="true" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full border border-border-focus bg-primary-subtle px-2 py-0.5 text-[10px] font-semibold text-primary">
                <ShieldCheck size={11} aria-hidden="true" /> Admin Locker Desk
              </span>
              <DialogTitle className="text-lg font-bold tracking-tight text-text-primary mt-0.5">
                Locker #{locker.id} — {locker.branchName ?? branchName ?? 'Branch Asset'}
              </DialogTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ADMIN_LOCKER_MATRIX_STATUS_CLASS[locker.status]}`}>
              {locker.status === 'free' ? 'Available Free' : locker.status === 'occupied' ? 'Occupied' : locker.status === 'maintenance' ? 'Maintenance' : 'Unknown'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
              aria-label="Close"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {formError && (
            <p role="alert" className="rounded-xl border border-danger bg-danger-bg p-3 text-xs text-danger-text font-semibold">
              {formError}
            </p>
          )}

          {locker.status === 'free' ? (
            <form onSubmit={handleAllocateSubmit} className="space-y-3.5">
              <div className="rounded-xl border border-success bg-success-bg p-3 text-success-text">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span>Locker #{locker.id} is Vacant &amp; Ready for Allocation</span>
                </div>
                <p className="mt-1 text-[11px] opacity-90">
                  Assign this locker to a student, issue physical key tag, and record monthly rental fee.
                </p>
              </div>

              <div>
                <label htmlFor="locker-alloc-student" className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                  Student Full Name <span className="text-danger-text">*</span>
                </label>
                <input
                  id="locker-alloc-student"
                  maxLength={100}
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-xs text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="locker-alloc-smartid" className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    Smart Card / Student ID
                  </label>
                  <input
                    id="locker-alloc-smartid"
                    maxLength={30}
                    type="text"
                    value={smartId}
                    onChange={(e) => setSmartId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary font-mono focus:border-border-focus focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="locker-alloc-phone" className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    Contact Phone
                  </label>
                  <input
                    id="locker-alloc-phone"
                    maxLength={15}
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary font-mono focus:border-border-focus focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="locker-alloc-shift" className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    Student Shift
                  </label>
                  <select
                    id="locker-alloc-shift"
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:border-border-focus focus:outline-none cursor-pointer"
                  >
                    {SHIFT_OPTIONS.map((s) => (
                      <option key={s} value={s} className="bg-card text-text-primary">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="locker-alloc-fee" className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    Monthly Locker Fee (₹)
                  </label>
                  <input
                    id="locker-alloc-fee"
                    type="number"
                    min="0"
                    step="50"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary font-mono focus:border-border-focus focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="locker-alloc-expiry" className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                  Validity Expiry Date
                </label>
                <input
                  id="locker-alloc-expiry"
                  maxLength={100}
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary font-mono focus:border-border-focus focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => onSetMaintenance?.(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-warning bg-warning-bg px-3 py-2 text-xs font-semibold text-warning-text hover:opacity-90 motion-safe:transition-opacity cursor-pointer"
                >
                  <Wrench size={13} aria-hidden="true" />
                  Mark Maintenance
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                  >
                    <CheckCircle2 size={15} aria-hidden="true" />
                    Allocate Locker
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <AdminLockersMatrixOccupiedPanel
              locker={locker}
              onClose={onClose}
              onVacate={onVacate}
              onSetMaintenance={onSetMaintenance}
            />
          )}

          <div className="flex items-start gap-2 rounded-xl border border-border bg-surface-highlight p-3 text-[11px] text-text-secondary">
            <Info size={14} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <strong>Central Key Custody:</strong> Keys are tagged at the branch desk. Central Admin changes sync instantaneously across student audit logs.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminLockersMatrixDetailModal;
