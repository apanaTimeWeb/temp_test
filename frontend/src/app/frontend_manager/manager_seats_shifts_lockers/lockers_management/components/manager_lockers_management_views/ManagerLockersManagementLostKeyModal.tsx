'use client';
// RESPONSIBILITY: Modal dialog for reporting lost locker keys and imposing fine/penalties, directly resolving situations where students leave seat but keep or lose the locker key.
import type { ManagerLockersManagementSampleLocker as Locker } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/config/manager_lockers_management.demo_data';
import { formatManagerLockerInr, getManagerLockerCurrencySymbol } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/utils/ManagerLockersManagementCurrency';
import { AlertTriangle, KeyRound, X } from 'lucide-react';
import React, { useState } from 'react';

export interface ManagerLockersManagementLostKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  locker: Locker | null;
  onConfirmLostKey: (lockerId: string, fineAmount: number, deductFromDeposit: boolean, vacateNow: boolean) => void;
}

export function ManagerLockersManagementLostKeyModal({
  isOpen,
  onClose,
  locker,
  onConfirmLostKey,
}: ManagerLockersManagementLostKeyModalProps) {
  const [fineAmount, setFineAmount] = useState<number>(150);
  const [deductFromDeposit, setDeductFromDeposit] = useState<boolean>(true);
  const [vacateNow, setVacateNow] = useState<boolean>(true);

  if (!isOpen || !locker) return null;

  const depositHeld = 500;
  const netRefund = deductFromDeposit ? Math.max(0, depositHeld - fineAmount) : depositHeld;
  const keyTag = locker.keyNumber || `KEY-${locker.lockerId}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmLostKey(locker.lockerId, fineAmount, deductFromDeposit, vacateNow);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manager-lost-key-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-3 sm:p-4 overflow-y-auto backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 id="manager-lost-key-modal-title" className="text-base font-bold text-primary">
                Report Lost Key & Impose Fine
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Record lost key penalty and initiate lock re-keying for Locker #{locker.lockerId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
          <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Student Seat / Plan Ended without Key Return</p>
            <p className="text-[11px] text-amber-200/90 mt-0.5">
              Physical key <strong>{keyTag}</strong> was not deposited by <strong>{locker.assignedTo}</strong> ({locker.studentId || 'LIB'}). A standard replacement fine will be levied.
            </p>
          </div>
        </div>

        {/* Locker & Student Summary Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-surface border border-border text-xs">
          <div>
            <span className="text-[10px] text-secondary uppercase font-semibold block">Locker ID</span>
            <span className="font-mono font-bold text-primary">{locker.lockerId}</span>
          </div>
          <div>
            <span className="text-[10px] text-secondary uppercase font-semibold block">Key Number</span>
            <span className="font-mono font-bold text-primary">{keyTag}</span>
          </div>
          <div>
            <span className="text-[10px] text-secondary uppercase font-semibold block">Assigned Student</span>
            <span className="font-bold text-primary truncate block">{locker.assignedTo}</span>
          </div>
          <div>
            <span className="text-[10px] text-secondary uppercase font-semibold block">Escrow Deposit</span>
            <span className="font-bold text-emerald-400">{formatManagerLockerInr(depositHeld, true)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Fine Penalty Input */}
          <div className="space-y-1.5">
            <label htmlFor="lost-key-fine-input" className="text-xs font-bold text-secondary uppercase tracking-wider block">
              Lost Key Fine Amount ({getManagerLockerCurrencySymbol()})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary">
                {getManagerLockerCurrencySymbol()}
              </span>
              <input maxLength={30}
                id="lost-key-fine-input"
                data-testid="manager-lost-key-fine-input"
                type="number"
                min="0"
                step="10"
                value={fineAmount}
                onChange={(e) => setFineAmount(Number(e.target.value) || 0)}
                className="w-full h-10 pl-7 pr-3 rounded-xl border border-border bg-surface text-primary font-bold text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <p className="text-[11px] text-secondary">
              Standard replacement cylinder and duplicate master key cost is {formatManagerLockerInr(150)}.
            </p>
          </div>

          {/* Settlement Mode Selection */}
          <div className="p-3 rounded-xl border border-border bg-surface space-y-2 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary block">
              Penalty Settlement Mode
            </span>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="settlementMode"
                checked={deductFromDeposit}
                onChange={() => setDeductFromDeposit(true)}
                className="mt-0.5 text-primary"
              />
              <div>
                <span className="font-bold text-primary block">
                  Deduct from Held Security Deposit ({formatManagerLockerInr(depositHeld)} held)
                </span>
                <span className="text-[11px] text-secondary">
                  {formatManagerLockerInr(fineAmount)} penalty deducted directly. Net refund payable to student: <strong>{formatManagerLockerInr(netRefund, true)}</strong>.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="radio"
                name="settlementMode"
                checked={!deductFromDeposit}
                onChange={() => setDeductFromDeposit(false)}
                className="mt-0.5 text-primary"
              />
              <div>
                <span className="font-bold text-primary block">
                  Add Lost Key Fine to Student&apos;s Pending Dues
                </span>
                <span className="text-[11px] text-secondary">
                  Charge {formatManagerLockerInr(fineAmount)} penalty directly to student profile. Full deposit remains unaffected.
                </span>
              </div>
            </label>
          </div>

          {/* Vacate immediately checkbox */}
          <div className="p-3 rounded-xl border border-border bg-surface text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                data-testid="manager-lost-key-vacate-checkbox"
                checked={vacateNow}
                onChange={(e) => setVacateNow(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <span className="text-primary font-medium">
                Vacate locker immediately and mark as available for new allotment
              </span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="manager-confirm-lost-key-fine-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-all cursor-pointer"
            >
              <KeyRound size={14} />
              <span>Apply Fine & Confirm</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ManagerLockersManagementLostKeyModal;
