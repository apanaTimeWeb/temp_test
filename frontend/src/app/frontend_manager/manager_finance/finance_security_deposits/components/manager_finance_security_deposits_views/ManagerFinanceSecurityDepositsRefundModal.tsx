'use client';

import type { ManagerFinanceSecurityDepositsSampleDeposit } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';
import { AlertTriangle,CheckCircle,ShieldCheck,Undo2,X } from 'lucide-react';
import React,{ useState } from 'react';

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

  const totalDeductions = (refundTarget.deductionAmount || 0) + (hasDamageDeduction ? damageAmount : 0);
  const netRefundAmount = Math.max(0, refundTarget.depositAmount - totalDeductions);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      data-testid="manager-finance-exit-clearance-modal"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Undo2 size={18} className="text-success" />
            <h2 className="text-base font-bold text-primary">Exit Clearance & Deposit Refund</h2>
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
                <span>Previous Deductions ({refundTarget.deductionReason}):</span>
                <span>- ₹{refundTarget.deductionAmount}</span>
              </div>
            )}
            {hasDamageDeduction && (
              <div className="flex justify-between text-xs text-danger">
                <span>Inspection Damage Deduction:</span>
                <span>- ₹{damageAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-success pt-1 border-t border-border">
              <span>Net Refund Payable:</span>
              <span data-testid="net-refund-payable-amount">₹{netRefundAmount}</span>
            </div>
          </div>

          {/* Exit Clearance Checklist */}
          <div className="p-3.5 bg-surface rounded-xl border border-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-indigo-400" />
                <span>Mandatory Exit Clearance Checklist</span>
              </span>
              <button
                type="button"
                onClick={handleVerifyAll}
                className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
              >
                Verify All
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-primary select-none">
                <input
                  type="checkbox"
                  data-testid="checklist-locker-key"
                  checked={checklist.lockerKeyReturned}
                  onChange={() => toggleCheck('lockerKeyReturned')}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Locker key surrendered & verified (or not allotted)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-primary select-none">
                <input
                  type="checkbox"
                  data-testid="checklist-id-card"
                  checked={checklist.idCardReturned}
                  onChange={() => toggleCheck('idCardReturned')}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Physical ID / RFID access card returned to desk</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-primary select-none">
                <input
                  type="checkbox"
                  data-testid="checklist-desk-inspected"
                  checked={checklist.deskInspected}
                  onChange={() => toggleCheck('deskInspected')}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Seat & study cubicle inspected (No physical/furniture damage)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-primary select-none">
                <input
                  type="checkbox"
                  data-testid="checklist-assets-returned"
                  checked={checklist.assetsReturned}
                  onChange={() => toggleCheck('assetsReturned')}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Library study books & materials returned</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-primary select-none">
                <input
                  type="checkbox"
                  data-testid="checklist-dues-cleared"
                  checked={checklist.duesCleared}
                  onChange={() => toggleCheck('duesCleared')}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>All subscription dues and pending fines cleared</span>
              </label>
            </div>

            {!allCleared && (
              <p className="text-[11px] text-amber-500 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg flex items-center gap-1.5" role="alert">
                <AlertTriangle size={13} className="shrink-0" />
                <span>All 5 checklist items must be physically verified before refund can be released.</span>
              </p>
            )}
          </div>

          {/* Property Damage Deduction Section */}
          <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-2">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="text-xs font-semibold text-text-primary">Property Damage Deduction?</span>
              <input
                type="checkbox"
                checked={hasDamageDeduction}
                onChange={(e) => setHasDamageDeduction(e.target.checked)}
                className="rounded text-primary focus:ring-primary w-4 h-4"
              />
            </label>
            {hasDamageDeduction && (
              <div className="space-y-2 pt-2 border-t border-border/70 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-secondary">Deduction Amount (₹):</span>
                  <input
                    type="number"
                    min="0"
                    max={refundTarget.depositAmount}
                    value={damageAmount}
                    onChange={(e) => setDamageAmount(Number(e.target.value) || 0)}
                    className="w-24 text-xs font-bold rounded border border-border bg-surface px-2 py-1 text-right"
                  />
                </div>
                <input maxLength={250}
                  type="text"
                  value={damageReason}
                  onChange={(e) => setDamageReason(e.target.value)}
                  placeholder="Reason for damage deduction"
                  className="w-full text-xs rounded border border-border bg-surface px-2.5 py-1 text-text-primary"
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Refund Payment Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onRefundModeChange('upi')}
                className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${refundMode === 'upi' ? 'bg-primary text-on-primary border-primary' : 'bg-card text-secondary border-border'
                  }`}
              >
                UPI Transfer
              </button>
              <button
                type="button"
                onClick={() => onRefundModeChange('cash')}
                className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${refundMode === 'cash' ? 'bg-primary text-on-primary border-primary' : 'bg-card text-secondary border-border'
                  }`}
              >
                Cash from Counter
              </button>
            </div>
          </div>

          {refundMode === 'upi' && (
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">UPI Transaction Reference</label>
              <input maxLength={100}
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
              data-testid="confirm-deposit-refund-btn"
              className={`mgr-btn-primary text-xs flex items-center gap-1.5 transition-opacity ${!allCleared ? 'opacity-50 cursor-not-allowed' : ''
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
