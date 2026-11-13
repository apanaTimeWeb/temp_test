'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Edit3, X, IndianRupee, CheckCircle, Eye, Calendar, Clock, AlertCircle } from 'lucide-react';
import type { ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesPaymentPromiseSampleFixtures';
import { useManagerPaymentPromisesDialogFocus } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/ManagerFinancePaymentPromisesDialogFocus';
import { managerFinancePaymentPromiseEditSchema } from '@/app/frontend_manager/manager_finance/finance_payment_promises/schemas/ManagerFinancePaymentPromisesSchema';
import { MANAGER_FINANCE_PAYMENT_PROMISE_STATUS_BADGE } from '@/app/frontend_manager/manager_finance/finance_payment_promises/constants/ManagerFinancePaymentPromisesPaymentPromiseConstants';

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
            {isDetails ? (
              <Eye size={18} className="text-primary" />
            ) : (
              <Edit3 size={18} className="text-primary" />
            )}
            <h2 id="promise-modal-title" className="text-base font-bold text-primary">
              {isDetails ? 'Payment Commitment Details' : 'Edit Payment Commitment'}
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

        {isDetails ? (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-surface rounded-xl border border-border">
              <p className="text-secondary font-medium">Student Info</p>
              <p className="text-sm font-bold text-primary mt-0.5">{promise.studentName}</p>
              <p className="font-mono text-secondary">{promise.smartId}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-secondary block">Promised Amount</span>
                <span className="text-sm font-bold text-primary mt-0.5 block">
                  {formatCurrency ? formatCurrency(promise.promisedAmount) : `₹${(promise.promisedAmount / 100).toLocaleString()}`}
                </span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-secondary block">Status</span>
                <span className={`inline-block mt-1 ${MANAGER_FINANCE_PAYMENT_PROMISE_STATUS_BADGE[promise.status] || 'fin-badge'}`}>
                  {promise.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-secondary block">Expected Date</span>
                <span className="font-semibold text-primary mt-0.5 flex items-center gap-1">
                  <Calendar size={12} /> {promise.expectedDate}
                </span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-secondary block">Timeline Maturity</span>
                <span className="font-semibold text-primary mt-0.5 flex items-center gap-1">
                  <Clock size={12} /> {promise.daysUntilDue >= 0 ? `${promise.daysUntilDue}d remaining` : `${Math.abs(promise.daysUntilDue)}d overdue`}
                </span>
              </div>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <span className="text-secondary block">Reschedule History</span>
              <span className="font-semibold text-primary mt-0.5 block">
                {promise.timesChanged > 0 ? `${promise.timesChanged} time(s) extended` : 'Never rescheduled'}
              </span>
            </div>

            {promise.remarks && (
              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-secondary block">Remarks & Student Reason</span>
                <p className="text-primary mt-0.5">{promise.remarks}</p>
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="mgr-btn-ghost text-xs focus-visible:ring-2 focus-visible:ring-primary"
              >
                Close
              </button>
              {promise.status !== 'fulfilled' && onSwitchToEdit && (
                <button
                  type="button"
                  onClick={onSwitchToEdit}
                  className="mgr-btn-primary text-xs flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Edit3 size={13} /> Edit / Extend
                </button>
              )}
            </div>
          </div>
        ) : (
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
                className="mgr-btn-ghost text-xs focus-visible:ring-2 focus-visible:ring-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="mgr-btn-primary text-xs flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
              >
                <CheckCircle size={14} /> Save Commitment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
