'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { User, Key, Calendar, ShieldCheck, DoorClosed, ArrowRight, X } from 'lucide-react';
import type { ManagerLockersManagementSampleLocker as Locker } from '../../mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures';

export interface ManagerLockersManagementStudentModalProps {
  locker: Locker | null;
  onClose: () => void;
  onVacate: (locker: Locker) => void;
}

export function ManagerLockersManagementStudentModal({
  locker,
  onClose,
  onVacate,
}: ManagerLockersManagementStudentModalProps) {
  const router = useRouter();
  if (!locker) return null;

  const isOccupied = locker.status === 'Occupied';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="locker-student-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-5 animate-in fade-in-50 zoom-in-95"
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
                    isOccupied
                      ? 'bg-danger-subtle text-danger'
                      : locker.status === 'Free'
                      ? 'bg-success-subtle text-success'
                      : 'bg-warning-subtle text-warning'
                  }`}
                >
                  {locker.status}
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
                  <span>Physical Key</span>
                </div>
                <div className="font-semibold font-mono text-primary">KEY-{locker.lockerId}</div>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-secondary">
                  <ShieldCheck size={13} />
                  <span>Security Deposit</span>
                </div>
                <div className="font-semibold text-success">₹500.00 (Held)</div>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-secondary">
                  <User size={13} />
                  <span>Plan Status</span>
                </div>
                <div className="font-semibold text-primary">Active Member</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const query = locker.studentId && locker.studentId !== '—' ? locker.studentId : locker.assignedTo;
                  router.push(`/frontend_manager/manager_members/members_directory?search=${encodeURIComponent(query)}`);
                }}
                className="mgr-btn-outline text-xs flex-1 flex items-center justify-center gap-1.5 py-2"
              >
                <span>View in Member Directory</span>
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
                Vacate Locker
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

