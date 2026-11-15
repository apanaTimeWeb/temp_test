'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Edit3, X, IndianRupee, CheckCircle, AlertCircle } from 'lucide-react';
import type { ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesPaymentPromiseSampleFixtures';
import { useManagerPaymentPromisesDialogFocus } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/ManagerFinancePaymentPromisesDialogFocus';
import { managerFinancePaymentPromiseEditSchema } from '@/app/frontend_manager/manager_finance/finance_payment_promises/schemas/ManagerFinancePaymentPromisesSchema';

export interface ManagerFinancePaymentPromisesEditModalProps {
  promise: ManagerFinancePaymentPromisesPaymentPromiseSample | null;
  mode?: 'details' | 'edit';
  formatCurrency?: (amount: number) => string;
  onClose: () => void;
  editAmount: string;
  onEditAmountChange: (amount: string) => void;
  editDate: string;
  onEditDateChange: (date: string) => void;
  editRemarks: string;
  onEditRemarksChange: (remarks: string) => void;
  onSavePromise: (e: React.FormEvent) => void;
  onSwitchToEdit?: () => void;
}

export default function ManagerFinancePaymentPromisesEditModal({
  promise,
  mode = 'edit',
  formatCurrency,
  onClose,
  editAmount,
  onEditAmountChange,
  editDate,
  onEditDateChange,
  editRemarks,
  onEditRemarksChange,
  onSavePromise,
  onSwitchToEdit,
}: ManagerFinancePaymentPromisesEditModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [fieldErrors, setFieldErrors] = useState<{ amount?: string; date?: string }>({});

  useManagerPaymentPromisesDialogFocus(dialogRef, onClose, Boolean(promise));

  useEffect(() => {
    setFieldErrors({});
  }, [promise, mode]);

  if (!promise) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = managerFinancePaymentPromiseEditSchema.safeParse({
      amount: editAmount,
      expectedDate: editDate,
      remarks: editRemarks,
    });

    if (!result.success) {
      const errors: { amount?: string; date?: string } = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === 'amount') errors.amount = issue.message;
        if (issue.path[0] === 'expectedDate') errors.date = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    onSavePromise(e);
  };

  const isDetails = mode === 'details';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promise-modal-title"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Edit3 size={18} className="text-primary" />
            <h2 id="promise-modal-title" className="text-base font-bold text-primary">
              Edit Payment Commitment
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary rounded-lg p-1 focus-visible:ring-2 focus-visible:ring-primary outline-none"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="p-3 bg-surface rounded-xl border border-border">
            <p className="text-xs text-secondary">Student Name</p>
            <p className="text-sm font-bold text-primary">{promise.studentName}</p>
            <p className="text-xs font-mono text-secondary mt-0.5">{promise.smartId}</p>
          </div>

          <div>
            <label htmlFor="edit-promised-amount" className="text-xs font-semibold text-primary block mb-1">
              Promised Amount (INR) *
            </label>
            <div className="relative">
              <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                id="edit-promised-amount"
                name="promisedAmount"
                type="number"
                min="1"
                required
                aria-invalid={Boolean(fieldErrors.amount)}
                aria-describedby={fieldErrors.amount ? 'edit-amount-error' : undefined}
                className="mgr-input pl-8 text-xs font-mono font-bold w-full focus-visible:ring-2 focus-visible:ring-primary"
                value={editAmount}
                onChange={(e) => onEditAmountChange(e.target.value)}
              />
            </div>
            {fieldErrors.amount && (
              <p id="edit-amount-error" role="alert" className="text-xs text-danger mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> {fieldErrors.amount}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="edit-expected-date" className="text-xs font-semibold text-primary block mb-1">
              Revised Expected Payment Date *
            </label>
            <input
              id="edit-expected-date"
              name="expectedDate"
              type="date"
              required
              aria-invalid={Boolean(fieldErrors.date)}
              aria-describedby={fieldErrors.date ? 'edit-date-error' : undefined}
              className="mgr-input text-xs w-full focus-visible:ring-2 focus-visible:ring-primary"
              value={editDate}
              onChange={(e) => onEditDateChange(e.target.value)}
            />
            {fieldErrors.date && (
              <p id="edit-date-error" role="alert" className="text-xs text-danger mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> {fieldErrors.date}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="edit-remarks" className="text-xs font-semibold text-primary block mb-1">
              Remarks & Student Reason <span className="font-normal text-xs text-secondary">(Optional)</span>
            </label>
            <textarea
              id="edit-remarks"
              name="remarks"
              rows={2}
              className="mgr-input text-xs resize-none w-full focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="e.g. Student requested 5-day grace period due to semester exam fee..."
              value={editRemarks}
              onChange={(e) => onEditRemarksChange(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <CheckCircle size={14} /> Save Commitment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
