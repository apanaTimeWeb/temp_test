'use client';

import { Armchair,CheckCircle,ShieldCheck,Undo2,X } from 'lucide-react';
import { useState } from 'react';
import type { AdminFinanceSecurityDeposit } from '../types/AdminFinanceSecurityDepositsTypes';

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

  const [hasDamageDeduction, setHasDamageDeduction] = useState(false);
  const [damageAmount, setDamageAmount] = useState(150);
  const [damageReason, setDamageReason] = useState('Property/Key damage inspection deduction');

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      data-testid="admin-finance-exit-clearance-modal"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Undo2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary">Exit Clearance & Deposit Refund</h2>
              <p className="text-xs text-secondary">Verify library clearance before releasing escrow deposit.</p>
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

        <form onSubmit={onConfirmRefund} className="space-y-4">
          {/* Student Overview Card */}
          <div className="p-3.5 bg-surface-ground rounded-xl border border-border space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-primary">{refundTarget.studentName}</p>
                <p className="font-mono text-secondary text-[11px]">{refundTarget.smartId}</p>
              </div>
              <span className="inline-flex items-center gap-1 font-mono px-2 py-0.5 rounded bg-surface border border-border text-primary font-bold">
                <Armchair size={11} />
                Seat {refundTarget.seat || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-secondary">Gross Deposit Held:</span>
              <span className="font-bold text-primary">₹{refundTarget.depositAmount.toLocaleString('en-IN')}</span>
            </div>

            {refundTarget.deductionAmount > 0 && (
              <div className="flex justify-between text-rose-500">
                <span>Previous Deductions ({refundTarget.deductionReason}):</span>
                <span>- ₹{refundTarget.deductionAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {hasDamageDeduction && (
              <div className="flex justify-between text-rose-500">
                <span>Inspection Damage Deduction:</span>
                <span>- ₹{damageAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-extrabold text-emerald-600 dark:text-emerald-400 pt-1.5 border-t border-border">
              <span>Net Refund Payable:</span>
              <span data-testid="net-refund-payable-amount">₹{netRefundAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* 5-Point Clearance Checklist */}
          <div className="space-y-2 border border-border p-3.5 rounded-xl bg-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
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

            <div className="space-y-2 text-xs">
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

          {/* Refund Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary block">
              Refund Disbursement Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['upi', 'cash', 'bank'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onRefundModeChange(mode)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border ${
                    refundMode === mode
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface hover:bg-surface-hover text-secondary border-border'
                  }`}
                >
                  {mode === 'upi' ? 'UPI / GPay' : mode === 'cash' ? 'Cash' : 'Bank Transfer'}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Reference Note */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-secondary block">
              Disbursement Transaction Ref / Notes
            </label>
            <input maxLength={100}
              type="text"
              value={refundRef}
              onChange={(e) => onRefundRefChange(e.target.value)}
              placeholder="e.g. UPI Ref #4029192482 / Cash voucher signed"
              className="w-full p-2.5 text-xs rounded-xl border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Actions */}
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
              disabled={!allCleared}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                allCleared
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs active:scale-95'
                  : 'bg-surface-ground text-secondary/50 border border-border cursor-not-allowed'
              }`}
            >
              <CheckCircle size={14} />
              <span>Confirm & Disburse ₹{netRefundAmount.toLocaleString('en-IN')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
