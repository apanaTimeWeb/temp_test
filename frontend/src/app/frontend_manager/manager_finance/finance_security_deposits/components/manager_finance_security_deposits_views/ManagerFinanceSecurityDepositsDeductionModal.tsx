'use client';

import React from 'react';
import { Minus, X, CheckCircle, IndianRupee } from 'lucide-react';
import type { ManagerFinanceSecurityDepositsSampleDeposit } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';

export interface ManagerFinanceSecurityDepositsDeductionModalProps {
  deductionTarget: ManagerFinanceSecurityDepositsSampleDeposit | null;
  onClose: () => void;
  deductionReason: string;
  onDeductionReasonChange: (reason: string) => void;
  deductionAmount: string;
  onDeductionAmountChange: (amount: string) => void;
  onConfirmDeduction: (e: React.FormEvent) => void;
}

export default function ManagerFinanceSecurityDepositsDeductionModal({
  deductionTarget,
  onClose,
  deductionReason,
  onDeductionReasonChange,
  deductionAmount,
  onDeductionAmountChange,
  onConfirmDeduction,
}: ManagerFinanceSecurityDepositsDeductionModalProps) {
  if (!deductionTarget) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Minus size={18} className="text-danger" />
            <h2 className="text-base font-bold text-primary">Add Deposit Deduction</h2>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onConfirmDeduction} className="space-y-3.5">
          <div className="p-3 bg-floating/60 rounded-xl border border-border">
            <p className="text-xs text-secondary">Student Name</p>
            <p className="text-sm font-bold text-primary">{deductionTarget.studentName} ({deductionTarget.smartId})</p>
            <p className="text-xs text-secondary mt-1">Available Deposit: <strong>₹{deductionTarget.depositAmount - (deductionTarget.deductionAmount || 0)}</strong></p>
          </div>

          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Deduction Reason *</label>
            <select
              className="mgr-select text-xs"
              value={deductionReason}
              onChange={(e) => {
                const r = e.target.value;
                onDeductionReasonChange(r);
                if (r === 'Locker Key Lost') onDeductionAmountChange('150');
                if (r === 'Desk or Chair Damage') onDeductionAmountChange('300');
                if (r === 'Lost Library RFID Smart ID') onDeductionAmountChange('100');
              }}
            >
              <option value="Locker Key Lost">Locker Key Lost (₹150)</option>
              <option value="Desk or Chair Damage">Desk or Chair Damage (₹300)</option>
              <option value="Lost Library RFID Smart ID">Lost Library RFID Smart ID (₹100)</option>
              <option value="Unpaid Late Overstay Fee">Unpaid Late Overstay Fee</option>
              <option value="Other">Other Specific Deduction</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Deduction Amount (INR) *</label>
            <div className="relative">
              <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="number"
                required
                className="mgr-input pl-8 text-xs font-mono font-bold"
                value={deductionAmount}
                onChange={(e) => onDeductionAmountChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs">
              Cancel
            </button>
            <button type="submit" className="mgr-btn-primary text-xs flex items-center gap-1.5 bg-danger hover:opacity-90">
              <CheckCircle size={14} /> Apply Deduction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

