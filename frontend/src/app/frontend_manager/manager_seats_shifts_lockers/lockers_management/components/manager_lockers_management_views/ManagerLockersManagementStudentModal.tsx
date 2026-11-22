'use client';

import { AlertTriangle,ArrowRight,Calendar,DoorClosed,Key,KeyRound,ShieldCheck,User,X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ManagerLockersManagementSampleLocker as Locker } from '../../mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures';

export interface ManagerLockersManagementStudentModalProps {
  locker: Locker | null;
  onClose: () => void;
  onVacate: (locker: Locker) => void;
  onReportLostKey?: (locker: Locker) => void;
}

export function ManagerLockersManagementStudentModal({
  locker,
  onClose,
  onVacate,
  onReportLostKey,
}: ManagerLockersManagementStudentModalProps) {
  const router = useRouter();
  if (!locker) return null;

  const isOccupied = locker.status === 'Occupied' || locker.status === 'Expired';
  const isPlanExpired =
    Boolean(isOccupied && locker.expiryDate && new Date(locker.expiryDate) < new Date());
  const keyTag = locker.keyNumber || `KEY-${locker.lockerId}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="locker-student-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4 animate-in fade-in-50 zoom-in-95 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center">
              <DoorClosed size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="locker-student-modal-title" className="text-base font-bold text-primary">
                  Locker #{locker.lockerId}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isPlanExpired
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : isOccupied
                      ? 'bg-danger-subtle text-danger'
                      : locker.status === 'Free'
                      ? 'bg-success-subtle text-success'
                      : 'bg-warning-subtle text-warning'
                  }`}
                >
                  {isPlanExpired ? 'Plan Expired' : locker.status}
                </span>
              </div>
              <p className="text-xs text-secondary">
                {isOccupied ? 'Currently Allocated Student Details' : 'Locker Allocation Status'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Plan Overdue Warning */}
        {isPlanExpired && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Student Seat Plan Ended without Key Return</p>
              <p className="text-[11px] text-amber-200/90 mt-0.5">
                Seat plan expired on <strong>{locker.expiryDate}</strong>. Physical key <strong>{keyTag}</strong> has not been handed over.
              </p>
            </div>
          </div>
        )}

        {/* Student Details Card */}
        {isOccupied ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-surface border border-border">
              <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0">
                {locker.assignedTo ? locker.assignedTo.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-primary truncate">{locker.assignedTo}</div>
                <div className="text-xs text-secondary font-mono">
                  Smart ID: {locker.studentId && locker.studentId !== '—' ? locker.studentId : 'LIB-REG'}
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-secondary">
                  <Calendar size={13} />
                  <span>Assigned Date</span>
                </div>
                <div className="font-semibold text-primary">{locker.assignedSince || 'Active'}</div>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-secondary">
                  <Key size={13} />
                  <span>Physical Key Tag</span>
                </div>
                <div className="font-semibold font-mono text-primary">{keyTag}</div>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-secondary">
                  <ShieldCheck size={13} />
                  <span>Security Deposit</span>
                </div>
                <div className="font-semibold text-emerald-400">₹500.00 (Held)</div>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-secondary">
                  <User size={13} />
                  <span>Seat Plan Tenure</span>
                </div>
                <div className={`font-semibold ${isPlanExpired ? 'text-amber-400' : 'text-primary'}`}>
                  {locker.expiryDate ? `${locker.expiryDate}` : 'Active Plan'}
                </div>
              </div>
            </div>

            {/* Lost key report indicator if already flagged */}
            {locker.lostKeyReported && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
                <span>🚨 Lost Key Fine Recorded:</span>
                <strong className="font-mono">₹{locker.lostKeyFine || 150}.00 Penalty</strong>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
              {onReportLostKey && (
                <button
                  type="button"
                  data-testid="manager-student-modal-report-lost-key-btn"
                  onClick={() => {
                    onClose();
                    onReportLostKey(locker);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Report Lost Key & Apply Fine"
                >
                  <KeyRound size={13} />
                  <span>Lost Key Fine</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  const query = locker.studentId && locker.studentId !== '—' ? locker.studentId : locker.assignedTo;
                  router.push(`/frontend_manager/manager_members/members_directory?search=${encodeURIComponent(query)}`);
                }}
                className="mgr-btn-outline text-xs flex-1 flex items-center justify-center gap-1.5 py-2"
              >
                <span>Directory</span>
                <ArrowRight size={13} />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onVacate(locker);
                }}
                className="mgr-btn-danger text-xs flex items-center justify-center gap-1.5 py-2 px-3.5"
              >
                Vacate
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <p className="text-xs text-secondary">
              This locker is currently {locker.status.toLowerCase()} and has no active student assignment.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mgr-btn-primary text-xs py-2 px-4"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

