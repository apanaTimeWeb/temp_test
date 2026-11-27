'use client';

import type { AdminFinanceSecurityDeposit } from '@/app/frontend_admin/admin_finance/finance_security_deposits/types/AdminFinanceSecurityDepositsTypes';
import { formatAdminFinanceSecurityDepositsCurrency } from '@/app/frontend_admin/admin_finance/finance_security_deposits/utils/formatAdminFinanceSecurityDepositsCurrency';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { CheckCircle, IndianRupee, Minus, X } from 'lucide-react';

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

  const currentAvailable = deductionTarget.depositAmount - (deductionTarget.deductionAmount || 0);

  return (
    <Dialog open={Boolean(deductionTarget)} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="w-full max-w-md rounded-2xl border border-border bg-overlay p-6 shadow-dialog space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-danger-bg text-danger-text border border-danger">
              <Minus size={18} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-text-primary">
                Log Penalty / Damage Deduction
              </DialogTitle>
              <p className="text-xs text-text-secondary">Apply deduction from student's active deposit.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-surface-hover motion-safe:transition-colors"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={onConfirmDeduction} className="space-y-4">
          <div className="p-3.5 bg-surface-highlight rounded-xl border border-border text-xs space-y-1">
            <p className="text-text-secondary">Student Name</p>
            <p className="font-bold text-text-primary text-sm">
              {deductionTarget.studentName} ({deductionTarget.smartId})
            </p>
            <div className="flex justify-between pt-1 border-t border-border mt-1">
              <span className="text-text-secondary">Available Escrow Deposit:</span>
              <span className="font-bold text-success-text">
                {formatAdminFinanceSecurityDepositsCurrency(currentAvailable)}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="deduction-reason-select" className="text-xs font-semibold text-text-secondary block">
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
              className="w-full p-2.5 rounded-xl border border-border bg-input text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="Locker Key Lost">Locker Key Lost ({formatAdminFinanceSecurityDepositsCurrency(150)})</option>
              <option value="Desk or Chair Damage">Desk or Chair Damage ({formatAdminFinanceSecurityDepositsCurrency(300)})</option>
              <option value="Lost Library RFID Smart ID">Lost Library RFID Smart ID ({formatAdminFinanceSecurityDepositsCurrency(100)})</option>
              <option value="Unpaid Late Overstay Fee">Unpaid Late Overstay Fee</option>
              <option value="Other">Other Specific Deduction</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="deduction-amount-input" className="text-xs font-semibold text-text-secondary block">
              Deduction Amount (INR) *
            </label>
            <div className="relative">
              <IndianRupee
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                aria-hidden="true"
              />
              <input
                maxLength={30}
                id="deduction-amount-input"
                type="number"
                min="1"
                max={currentAvailable}
                required
                value={deductionAmount}
                onChange={(e) => onDeductionAmountChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs font-bold rounded-xl border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover cursor-pointer motion-safe:transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-danger text-on-primary hover:opacity-90 shadow-card cursor-pointer motion-safe:transition-transform motion-safe:active:scale-95"
            >
              <CheckCircle size={14} aria-hidden="true" />
              <span>Apply {formatAdminFinanceSecurityDepositsCurrency(Number(deductionAmount) || 0)} Deduction</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default AdminFinanceSecurityDepositsDeductionModal;
