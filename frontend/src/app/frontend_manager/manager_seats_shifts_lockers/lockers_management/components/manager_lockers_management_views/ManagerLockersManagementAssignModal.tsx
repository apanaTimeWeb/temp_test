'use client';

import {
  ManagerLockersManagementStudentDropdown,
  type LockerAssignableStudent,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/components/manager_lockers_management_views/ManagerLockersManagementStudentDropdown';
import type { ManagerLockersManagementSampleLocker as Locker } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/config/manager_lockers_management.demo_data';
import { formatManagerLockerInr } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/utils/ManagerLockersManagementCurrency';
import { DoorClosed, Key, ShieldCheck, UserPlus, X } from 'lucide-react';
import React, { useState } from 'react';

export interface ManagerLockersManagementAssignModalProps {
  locker: Locker;
  dialogRef: React.Ref<HTMLDivElement>;
  onClose: () => void;
  onAssign: (studentName: string, studentId: string, keyNumber?: string, expiryDate?: string) => void;
}

export function ManagerLockersManagementAssignModal({
  locker,
  dialogRef,
  onClose,
  onAssign,
}: ManagerLockersManagementAssignModalProps) {
  const [selectedStudent, setSelectedStudent] = useState<LockerAssignableStudent | null>(null);
  const [keyNumber, setKeyNumber] = useState<string>(locker.keyNumber || `KEY-${locker.lockerId}`);
  const [expiryDate, setExpiryDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [depositCollected, setDepositCollected] = useState(true);
  const [keyHandedOver, setKeyHandedOver] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    onAssign(selectedStudent.name, selectedStudent.smartId, keyNumber, expiryDate);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 motion-safe:animate-in motion-safe:fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ss-locker-assign-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 motion-safe:animate-in motion-safe:fade-in-50 motion-safe:zoom-in-95 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
              <UserPlus size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ss-locker-assign-title" className="text-base font-bold text-primary">
                  Allot Locker #{locker.lockerId}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-subtle text-success">
                  Available
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Select student from directory to assign locker and issue physical key
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1.5 rounded-lg hover:bg-surface-hover motion-safe:transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-surface border border-border text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-secondary uppercase font-semibold">Locker Desk</span>
            <div className="font-mono font-bold text-primary flex items-center gap-1">
              <DoorClosed size={13} className="text-primary" />
              <span>{locker.lockerId}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-secondary uppercase font-semibold">Key Tag</span>
            <div className="font-mono font-bold text-primary flex items-center gap-1">
              <Key size={13} className="text-primary" />
              <span>KEY-{locker.lockerId}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-secondary uppercase font-semibold">Deposit</span>
            <div className="font-bold text-success flex items-center gap-1">
              <ShieldCheck size={13} className="text-success" />
              <span>{formatManagerLockerInr(500, true)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ManagerLockersManagementStudentDropdown
            selectedStudent={selectedStudent}
            onSelectStudent={setSelectedStudent}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-surface border border-border text-xs">
            <div className="space-y-1">
              <label htmlFor="assign-key-number" className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                Physical Key Number
              </label>
              <div className="relative">
                <Key size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  maxLength={30}
                  id="assign-key-number"
                  data-testid="manager-assign-key-number-input"
                  type="text"
                  value={keyNumber}
                  onChange={(e) => setKeyNumber(e.target.value)}
                  className="w-full h-9 pl-7 pr-2.5 rounded-lg border border-border bg-card text-primary font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={`KEY-${locker.lockerId}`}
                  required
                />
              </div>
              <p className="text-[10px] text-secondary">Numbered tag physically stamped on brass key.</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="assign-expiry-date" className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                Linked Plan Expiry Date
              </label>
              <input
                maxLength={30}
                id="assign-expiry-date"
                data-testid="manager-assign-expiry-date-input"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg border border-border bg-card text-primary text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                required
              />
              <p className="text-[10px] text-secondary">Auto-links locker tenure with student seat plan.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={depositCollected}
                onChange={(e) => setDepositCollected(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <span className="text-primary font-medium">
                Collect {formatManagerLockerInr(500)} refundable security deposit (Recorded in Escrow)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={keyHandedOver}
                onChange={(e) => setKeyHandedOver(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <span className="text-primary font-medium">Physical key {keyNumber} handed over to student</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button type="button" className="mgr-btn-outline text-xs px-3.5 py-2 rounded-xl" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedStudent}
              className={`mgr-btn-primary flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-semibold shadow-xs ${
                !selectedStudent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <UserPlus size={14} />
              <span>Confirm Allotment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
