'use client';

import React from 'react';
import { Edit3, X, IndianRupee, CheckCircle } from 'lucide-react';
import type { ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesPaymentPromiseSampleFixtures';

export interface ManagerFinancePaymentPromisesEditModalProps {
  promise: ManagerFinancePaymentPromisesPaymentPromiseSample | null;
  onClose: () => void;
  editAmount: string;
  onEditAmountChange: (amount: string) => void;
  editDate: string;
  onEditDateChange: (date: string) => void;
  editRemarks: string;
  onEditRemarksChange: (remarks: string) => void;
  onSavePromise: (e: React.FormEvent) => void;
}

export default function ManagerFinancePaymentPromisesEditModal({
  promise,
  onClose,
  editAmount,
  onEditAmountChange,
  editDate,
  onEditDateChange,
  editRemarks,
  onEditRemarksChange,
  onSavePromise,
}: ManagerFinancePaymentPromisesEditModalProps) {
  if (!promise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Edit3 size={18} className="text-primary" />
            <h2 className="text-base font-bold text-primary">Edit Payment Commitment</h2>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSavePromise} className="space-y-3.5">
          <div className="p-3 bg-floating/60 rounded-xl border border-border">
            <p className="text-xs text-secondary">Student Name</p>
            <p className="text-sm font-bold text-primary">{promise.studentName}</p>
            <p className="text-xs font-mono text-secondary mt-0.5">{promise.smartId}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Promised Amount (INR) *</label>
            <div className="relative">
              <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="number"
                required
                className="mgr-input pl-8 text-xs font-mono font-bold"
                value={editAmount}
                onChange={(e) => onEditAmountChange(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Revised Expected Payment Date *</label>
            <input
              type="date"
              required
              className="mgr-input text-xs"
              value={editDate}
              onChange={(e) => onEditDateChange(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Remarks & Student Reason</label>
            <textarea
              rows={2}
              className="mgr-input text-xs resize-none"
              placeholder="e.g. Student requested 5-day grace period due to semester exam fee..."
              value={editRemarks}
              onChange={(e) => onEditRemarksChange(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs">
              Cancel
            </button>
            <button type="submit" className="mgr-btn-primary text-xs flex items-center gap-1.5">
              <CheckCircle size={14} /> Save Commitment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

