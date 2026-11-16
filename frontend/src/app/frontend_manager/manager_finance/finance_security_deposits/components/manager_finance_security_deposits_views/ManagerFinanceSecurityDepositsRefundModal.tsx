'use client';

import React, { useState } from 'react';
import { Undo2, X, CheckCircle, ShieldCheck } from 'lucide-react';
import type { ManagerFinanceSecurityDepositsSampleDeposit } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';

export interface ManagerFinanceSecurityDepositsRefundModalProps {
  refundTarget: ManagerFinanceSecurityDepositsSampleDeposit | null;
  onClose: () => void;
  refundMode: 'cash' | 'upi';
  onRefundModeChange: (mode: 'cash' | 'upi') => void;
  refundRef: string;
  onRefundRefChange: (ref: string) => void;
  onConfirmRefund: (e: React.FormEvent) => void;
}

export default function ManagerFinanceSecurityDepositsRefundModal({
  refundTarget,
  onClose,
  refundMode,
  onRefundModeChange,
  refundRef,
  onRefundRefChange,
  onConfirmRefund,
}: ManagerFinanceSecurityDepositsRefundModalProps) {
  const [checklist, setChecklist] = useState({
    lockerKeyReturned: true,
    idCardReturned: true,
    assetsReturned: true,
    deskInspected: true,
    duesCleared: true,
  });

  if (!refundTarget) return null;

  const allCleared = Object.values(checklist).every(Boolean);

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Undo2 size={18} className="text-success" />
            <h2 className="text-base font-bold text-primary">Process Security Deposit Refund</h2>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onConfirmRefund} className="space-y-3.5">
          <div className="p-3 bg-surface-highlight rounded-xl border border-border space-y-1">
            <p className="text-xs text-secondary">Student Name</p>
            <p className="text-sm font-bold text-primary">{refundTarget.studentName} ({refundTarget.smartId})</p>
            <div className="flex justify-between text-xs pt-1 border-t border-border mt-1">
              <span className="text-secondary">Gross Deposit Held:</span>
              <span className="font-semibold text-primary">₹{refundTarget.depositAmount}</span>
            </div>
            {refundTarget.deductionAmount > 0 && (
              <div className="flex justify-between text-xs text-danger">
                <span>Less Deductions ({refundTarget.deductionReason}):</span>
                <span>- ₹{refundTarget.deductionAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-success pt-1 border-t border-border">
              <span>Net Refund Payable:</span>
              <span>₹{refundTarget.depositAmount - (refundTarget.deductionAmount || 0)}</span>
            </div>
          </div>

          {/* No-Dues Clearance Checklist */}
          <div className="p-3.5 bg-surface rounded-xl border border-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-indigo-400" />
                <span>No-Dues Clearance Checklist</span>
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  allCleared
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}
              >
                {allCleared ? '✓ All Items Cleared' : '⚠ Action Required'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary select-none">
                <input
                  type="checkbox"
                  checked={checklist.lockerKeyReturned}
                  onChange={() => toggleCheck('lockerKeyReturned')}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Locker Key surrendered & tested (or no locker allotted)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary select-none">
                <input
                  type="checkbox"
                  checked={checklist.idCardReturned}
                  onChange={() => toggleCheck('idCardReturned')}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Physical RFID / Smart ID Card returned to desk</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary select-none">
                <input
                  type="checkbox"
                  checked={checklist.assetsReturned}
                  onChange={() => toggleCheck('assetsReturned')}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Library study materials & borrowed books returned</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary select-none">
                <input
                  type="checkbox"
                  checked={checklist.deskInspected}
                  onChange={() => toggleCheck('deskInspected')}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Seat & study cubicle inspected (No physical damage/graffiti)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary select-none">
                <input
                  type="checkbox"
                  checked={checklist.duesCleared}
                  onChange={() => toggleCheck('duesCleared')}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>All monthly subscription fees and pending fines cleared</span>
              </label>
            </div>

            {!allCleared && (
              <p className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
                Please verify all clearance items with student before releasing security deposit funds.
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Refund Payment Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onRefundModeChange('upi')}
                className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                  refundMode === 'upi' ? 'bg-primary text-on-primary border-primary' : 'bg-card text-secondary border-border'
                }`}
              >
                UPI Transfer
              </button>
              <button
                type="button"
                onClick={() => onRefundModeChange('cash')}
                className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                  refundMode === 'cash' ? 'bg-primary text-on-primary border-primary' : 'bg-card text-secondary border-border'
                }`}
              >
                Cash from Counter
              </button>
            </div>
          </div>

          {refundMode === 'upi' && (
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">UPI Transaction Reference</label>
              <input
                type="text"
                className="mgr-input text-xs font-mono"
                placeholder="e.g. UPI/2026/987123"
                value={refundRef}
                onChange={(e) => onRefundRefChange(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!allCleared}
              className={`mgr-btn-primary text-xs flex items-center gap-1.5 transition-opacity ${
                !allCleared ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title={!allCleared ? 'Please verify all clearance items with student before releasing refund' : undefined}
            >
              <CheckCircle size={14} /> Confirm & Release Refund
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

