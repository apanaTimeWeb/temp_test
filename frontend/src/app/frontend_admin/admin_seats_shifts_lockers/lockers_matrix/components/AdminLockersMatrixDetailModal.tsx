'use client';
// Responsibility: Modal dialog for inspecting, allocating, vacating, and maintaining library lockers.

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { User, KeyRound, Info, CheckCircle2, AlertTriangle, Wrench, X, ShieldCheck, IndianRupee, Clock, Calendar } from 'lucide-react';
import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';
import { displayValue } from '@/lib/display_value';

export const ADMIN_LOCKER_MATRIX_STATUS_CLASS = {
  free: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  occupied: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
  maintenance: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
  unknown: 'border-slate-700 bg-slate-900 text-slate-400',
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
  const t = useTranslations('ADMIN_LOCKERS');
  const modalRef = useRef<HTMLDivElement>(null);

  // Form State for Free Locker Allocation
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
    if (!locker) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [locker, onClose]);

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

  if (!locker) return null;

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative my-8 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="locker-inspect-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 p-2.5 text-indigo-400">
              <KeyRound size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                  <ShieldCheck size={11} /> Admin Locker Desk
                </span>
              </div>
              <h3 id="locker-inspect-title" className="text-lg font-bold tracking-tight text-white mt-0.5">
                Locker #{locker.id} — {locker.branchName ?? branchName ?? 'Branch Asset'}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ADMIN_LOCKER_MATRIX_STATUS_CLASS[locker.status]}`}>
              {locker.status === 'free' ? 'Available Free' : locker.status === 'occupied' ? 'Occupied' : locker.status === 'maintenance' ? 'Maintenance' : 'Unknown'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="mt-4 space-y-4 text-xs">
          {formError && (
            <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400 font-semibold">
              {formError}
            </p>
          )}

          {/* SCENARIO 1: FREE LOCKER -> ALLOCATION FORM */}
          {locker.status === 'free' ? (
            <form onSubmit={handleAllocateSubmit} className="space-y-3.5">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 size={15} />
                  <span>Locker #{locker.id} is Vacant & Ready for Allocation</span>
                </div>
                <p className="mt-1 text-[11px] text-emerald-200/80">
                  Assign this locker to a student, issue physical key tag, and record monthly rental fee.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Student Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Smart Card / Student ID
                  </label>
                  <input
                    type="text"
                    value={smartId}
                    onChange={(e) => setSmartId(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Student Shift
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {SHIFT_OPTIONS.map((s) => (
                      <option key={s} value={s} className="bg-slate-900 text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Monthly Locker Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Validity Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => onSetMaintenance?.(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  <Wrench size={13} />
                  Mark Maintenance
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
                  >
                    <CheckCircle2 size={15} />
                    Allocate Locker
                  </button>
                </div>
              </div>
            </form>
          ) : locker.status === 'occupied' ? (
            /* SCENARIO 2: OCCUPIED LOCKER -> STUDENT PROFILE & RELEASE */
            <div className="space-y-3.5">
              {/* Student Profile Card */}
              <div className="flex items-center gap-3.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 p-3 text-indigo-400 shrink-0">
                  <User size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-white truncate">
                    {displayValue(locker.student, 'Assigned Student')}
                  </h4>
                  <p className="font-mono text-[11px] text-indigo-300 mt-0.5">
                    ID: {displayValue(locker.smartId, 'SL-DT-1000')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-300">
                    <IndianRupee size={11} /> ₹300/mo
                  </span>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Contact Phone</span>
                  <p className="mt-1 font-mono font-medium text-white">{displayValue(locker.phone, '—')}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Library Shift</span>
                  <p className="mt-1 font-medium text-white">{displayValue(locker.shift, 'Full Day Dedicated')}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Allotted By</span>
                  <p className="mt-1 font-medium text-slate-300">{displayValue(locker.allottedByManager, 'Branch Desk Manager')}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Key Tag & Expiry</span>
                  <p className="mt-1 font-mono text-emerald-400 font-semibold">{displayValue(locker.expiry, 'Active (Valid)')}</p>
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => onSetMaintenance?.(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  <Wrench size={13} />
                  Mark Maintenance
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={onVacate}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/25 transition-all shadow-xs cursor-pointer"
                  >
                    <X size={14} />
                    Release Locker (Vacate)
                  </button>
                </div>
              </div>
            </div>
          ) : locker.status === 'maintenance' ? (
            /* SCENARIO 3: MAINTENANCE LOCKER -> REPAIR TOGGLE */
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-300 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Wrench size={16} />
                  <span>Locker #{locker.id} Under Maintenance</span>
                </div>
                <p className="text-xs text-amber-200/80">
                  Key lock mechanism or door hinge inspection logged. Physical unit is blocked from student allocation until repaired.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => onSetMaintenance?.(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  Mark Repaired & Available
                </button>
              </div>
            </div>
          ) : null}

          {/* Admin Policy Footer */}
          <div className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-[11px] text-slate-400">
            <Info size={14} className="mt-0.5 shrink-0 text-indigo-400" />
            <span>
              <strong>Central Key Custody:</strong> Keys are tagged at the branch desk. Central Admin changes sync instantaneously across student audit logs.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLockersMatrixDetailModal;
