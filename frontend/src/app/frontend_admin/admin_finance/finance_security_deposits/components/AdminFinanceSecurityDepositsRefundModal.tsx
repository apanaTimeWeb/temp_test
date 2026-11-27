'use client';

import type { AdminFinanceSecurityDeposit } from '@/app/frontend_admin/admin_finance/finance_security_deposits/types/AdminFinanceSecurityDepositsTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Armchair, CheckCircle, ShieldCheck, Undo2, X } from 'lucide-react';
import { useState } from 'react';

export interface AdminFinanceSecurityDepositsRefundModalProps {
  refundTarget: AdminFinanceSecurityDeposit | null;
  onClose: () => void;
  refundMode: 'cash' | 'upi' | 'bank';
  onRefundModeChange: (mode: 'cash' | 'upi' | 'bank') => void;
  refundRef: string;
  onRefundRefChange: (ref: string) => void;
  onConfirmRefund: (e: React.FormEvent) => void;
}

export function AdminFinanceSecurityDepositsRefundModal({
  refundTarget,
  onClose,
  refundMode,
  onRefundModeChange,
  refundRef,
  onRefundRefChange,
  onConfirmRefund,
}: AdminFinanceSecurityDepositsRefundModalProps) {
  const [checklist, setChecklist] = useState({
    lockerKeyReturned: false,
    idCardReturned: false,
    assetsReturned: false,
    deskInspected: false,
    duesCleared: false,
  });

  const [hasDamageDeduction] = useState(false);
  const [damageAmount] = useState(150);

  if (!refundTarget) return null;

  const allCleared = Object.values(checklist).every(Boolean);

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVerifyAll = () => {
    setChecklist({
      lockerKeyReturned: true,
      idCardReturned: true,
      assetsReturned: true,
      deskInspected: true,
      duesCleared: true,
    });
  };

  const totalDeductions =
    (refundTarget.deductionAmount || 0) + (hasDamageDeduction ? damageAmount : 0);
  const netRefundAmount = Math.max(0, refundTarget.depositAmount - totalDeductions);

  return (
    <Dialog open={Boolean(refundTarget)} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent
        data-testid="admin-finance-exit-clearance-modal"
        className="w-full max-w-md rounded-2xl border border-border bg-overlay p-6 shadow-dialog space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-success-bg text-success-text border border-success">
              <Undo2 size={18} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-text-primary">
                Exit Clearance & Deposit Refund
              </DialogTitle>
              <p className="text-xs text-text-secondary">
                Verify library clearance before releasing escrow deposit.
              </p>
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

        <form onSubmit={onConfirmRefund} className="space-y-4">
          <div className="p-3.5 bg-surface-highlight rounded-xl border border-border space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-text-primary">{refundTarget.studentName}</p>
                <p className="font-mono text-text-secondary text-[11px]">{refundTarget.smartId}</p>
              </div>
              <span className="inline-flex items-center gap-1 font-mono px-2 py-0.5 rounded bg-card border border-border text-text-primary font-bold">
                <Armchair size={11} aria-hidden="true" />
                Seat {refundTarget.seat || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-text-secondary">Gross Deposit Held:</span>
              <span className="font-bold text-text-primary">
                ₹{refundTarget.depositAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {refundTarget.deductionAmount > 0 && (
              <div className="flex justify-between text-danger-text">
                <span>Previous Deductions ({refundTarget.deductionReason}):</span>
                <span>- ₹{refundTarget.deductionAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {hasDamageDeduction && (
              <div className="flex justify-between text-danger-text">
                <span>Inspection Damage Deduction:</span>
                <span>- ₹{damageAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-extrabold text-success-text pt-1.5 border-t border-border">
              <span>Net Refund Payable:</span>
              <span data-testid="net-refund-payable-amount">
                ₹{netRefundAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="space-y-2 border border-border p-3.5 rounded-xl bg-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-success-text" aria-hidden="true" />
                Exit Clearance Checklist
              </span>
              <button
                type="button"
                onClick={handleVerifyAll}
                className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
              >
                Check All
              </button>
            </div>

            <div className="space-y-2 text-xs text-text-primary">
              <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <input
                  type="checkbox"
                  checked={checklist.lockerKeyReturned}
                  onChange={() => toggleCheck('lockerKeyReturned')}
                  className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                />
                <span>Locker key returned intact</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <input
                  type="checkbox"
                  checked={checklist.idCardReturned}
                  onChange={() => toggleCheck('idCardReturned')}
                  className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                />
                <span>Smart RFID Member ID card surrendered</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <input
                  type="checkbox"
                  checked={checklist.assetsReturned}
                  onChange={() => toggleCheck('assetsReturned')}
                  className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                />
                <span>Borrowed books / chargers / property returned</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <input
                  type="checkbox"
                  checked={checklist.deskInspected}
                  onChange={() => toggleCheck('deskInspected')}
                  className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                />
                <span>Study desk inspected without damage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <input
                  type="checkbox"
                  checked={checklist.duesCleared}
                  onChange={() => toggleCheck('duesCleared')}
                  className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                />
                <span>All subscription fees & late penalties settled</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary block">
              Refund Disbursement Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['upi', 'cash', 'bank'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onRefundModeChange(mode)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold uppercase motion-safe:transition-colors cursor-pointer border ${
                    refundMode === mode
                      ? 'bg-primary text-on-primary border-primary shadow-card'
                      : 'bg-card hover:bg-surface-hover text-text-secondary border-border'
                  }`}
                >
                  {mode === 'upi' ? 'UPI / GPay' : mode === 'cash' ? 'Cash' : 'Bank Transfer'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="refund-disbursement-ref" className="text-xs font-semibold text-text-secondary block">
              Disbursement Transaction Ref / Notes
            </label>
            <input
              id="refund-disbursement-ref"
              maxLength={100}
              type="text"
              value={refundRef}
              onChange={(e) => onRefundRefChange(e.target.value)}
              placeholder="e.g. UPI Ref #4029192482 / Cash voucher signed"
              className="w-full p-2.5 text-xs rounded-xl border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
              disabled={!allCleared}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold motion-safe:transition-all ${
                allCleared
                  ? 'bg-success text-on-primary hover:opacity-90 cursor-pointer shadow-card motion-safe:active:scale-95'
                  : 'bg-surface-highlight text-text-secondary opacity-60 border border-border cursor-not-allowed'
              }`}
            >
              <CheckCircle size={14} aria-hidden="true" />
              <span>Confirm & Disburse ₹{netRefundAmount.toLocaleString('en-IN')}</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default AdminFinanceSecurityDepositsRefundModal;
