'use client';

import { Minus, X, CheckCircle, IndianRupee } from 'lucide-react';
import type { AdminFinanceSecurityDeposit } from '../types/AdminFinanceSecurityDepositsTypes';

export interface AdminFinanceSecurityDepositsDeductionModalProps {
  deductionTarget: AdminFinanceSecurityDeposit | null;
  onClose: () => void;
  deductionReason: string;
  onDeductionReasonChange: (reason: string) => void;
  deductionAmount: string;
  onDeductionAmountChange: (amount: string) => void;
  onConfirmDeduction: (e: React.FormEvent) => void;
}

export function AdminFinanceSecurityDepositsDeductionModal({
  deductionTarget,
  onClose,
  deductionReason,
  onDeductionReasonChange,
  deductionAmount,
  onDeductionAmountChange,
  onConfirmDeduction,
}: AdminFinanceSecurityDepositsDeductionModalProps) {
  if (!deductionTarget) return null;

  const currentAvailable =
    deductionTarget.depositAmount - (deductionTarget.deductionAmount || 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <Minus size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary">Log Penalty / Damage Deduction</h2>
              <p className="text-xs text-secondary">Apply deduction from student's active deposit.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-surface-hover"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onConfirmDeduction} className="space-y-4">
          <div className="p-3.5 bg-surface-ground rounded-xl border border-border text-xs space-y-1">
            <p className="text-secondary">Student Name</p>
            <p className="font-bold text-primary text-sm">
              {deductionTarget.studentName} ({deductionTarget.smartId})
            </p>
            <div className="flex justify-between pt-1 border-t border-border mt-1">
              <span className="text-secondary">Available Escrow Deposit:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ₹{currentAvailable.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="deduction-reason-select" className="text-xs font-semibold text-secondary block">
              Deduction Reason *
            </label>
            <select
              id="deduction-reason-select"
              value={deductionReason}
              onChange={(e) => {
                const r = e.target.value;
                onDeductionReasonChange(r);
                if (r === 'Locker Key Lost') onDeductionAmountChange('150');
                if (r === 'Desk or Chair Damage') onDeductionAmountChange('300');
                if (r === 'Lost Library RFID Smart ID') onDeductionAmountChange('100');
              }}
              className="w-full p-2.5 rounded-xl border border-border bg-input-bg text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="Locker Key Lost">Locker Key Lost (₹150)</option>
              <option value="Desk or Chair Damage">Desk or Chair Damage (₹300)</option>
              <option value="Lost Library RFID Smart ID">Lost Library RFID Smart ID (₹100)</option>
              <option value="Unpaid Late Overstay Fee">Unpaid Late Overstay Fee</option>
              <option value="Other">Other Specific Deduction</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="deduction-amount-input" className="text-xs font-semibold text-secondary block">
              Deduction Amount (INR) *
            </label>
            <div className="relative">
              <IndianRupee
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none"
              />
              <input
                id="deduction-amount-input"
                type="number"
                min="1"
                max={currentAvailable}
                required
                value={deductionAmount}
                onChange={(e) => onDeductionAmountChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs font-bold rounded-xl border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <CheckCircle size={14} />
              <span>Apply ₹{deductionAmount} Deduction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
