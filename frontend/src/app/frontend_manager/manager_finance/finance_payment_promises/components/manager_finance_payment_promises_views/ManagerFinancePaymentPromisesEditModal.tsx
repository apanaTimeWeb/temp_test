'use client';

import { useManagerPaymentPromisesDialogFocus } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/ManagerFinancePaymentPromisesDialogFocus';
import { managerFinancePaymentPromiseEditSchema } from '@/app/frontend_manager/manager_finance/finance_payment_promises/schemas/ManagerFinancePaymentPromisesSchema';
import type { ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesTypes';
import { formatPromiseInr, getPromiseMajorUnits } from '@/app/frontend_manager/manager_finance/finance_payment_promises/utils/ManagerFinancePaymentPromisesHelpers';
import { AlertCircle, Calendar, CheckCircle, Clock, Edit3, Eye, IndianRupee, X } from 'lucide-react';
import React,{ useEffect,useRef,useState } from 'react';

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
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
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
            className="text-secondary hover:text-primary rounded-lg p-1 focus-visible:ring-2 focus-visible:ring-primary outline-none cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* View Mode (Details) */}
        {isDetails ? (
          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-surface rounded-xl border border-border flex items-center justify-between">
              <div>
                <p className="text-secondary font-medium">Student</p>
                <p className="text-sm font-bold text-primary mt-0.5">{promise.studentName}</p>
                <p className="font-mono text-secondary text-[11px]">{promise.smartId}</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                  promise.status === 'fulfilled'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : promise.status === 'overdue'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                }`}
              >
                {promise.status === 'fulfilled'
                  ? 'Fulfilled'
                  : promise.status === 'overdue'
                  ? 'Overdue'
                  : 'Pending'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-secondary block font-medium">Promised Amount</span>
                <span className="text-sm font-bold text-primary mt-0.5 block">
                  {formatCurrency
                    ? formatCurrency(promise.promisedAmount)
                    : formatPromiseInr(getPromiseMajorUnits(promise.promisedAmount))}
                </span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-secondary block font-medium">Expected Date</span>
                <span className="text-sm font-bold text-primary mt-0.5 flex items-center gap-1">
                  <Calendar size={13} className="text-secondary" /> {promise.expectedDate}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-secondary block font-medium">Timeline Status</span>
                <span
                  className={`font-semibold mt-0.5 flex items-center gap-1 ${
                    promise.daysUntilDue < 0
                      ? 'text-rose-600 dark:text-rose-400 font-bold'
                      : promise.daysUntilDue <= 2
                      ? 'text-amber-600 dark:text-amber-400 font-bold'
                      : 'text-primary'
                  }`}
                >
                  <Clock size={13} className="text-secondary" />
                  {promise.daysUntilDue === 0
                    ? 'Due Today'
                    : promise.daysUntilDue > 0
                    ? `${promise.daysUntilDue} days remaining`
                    : `${Math.abs(promise.daysUntilDue)} days overdue`}
                </span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-secondary block font-medium">Extension History</span>
                <span className="font-semibold text-primary mt-0.5 block">
                  {promise.timesChanged > 0
                    ? `Extended ${promise.timesChanged} time(s)`
                    : 'Original date'}
                </span>
              </div>
            </div>

            {promise.remarks && (
              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-secondary block font-medium mb-0.5">Remarks / Reason</span>
                <p className="text-primary">{promise.remarks}</p>
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
              >
                Close
              </button>
              {promise.status !== 'fulfilled' && onSwitchToEdit && (
                <button
                  type="button"
                  onClick={onSwitchToEdit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-xs motion-safe:transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Edit3 size={13} /> Edit Commitment
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="p-3 bg-surface rounded-xl border border-border">
              <p className="text-xs text-secondary font-medium">Student</p>
              <p className="text-sm font-bold text-primary mt-0.5">{promise.studentName}</p>
              <p className="text-xs font-mono text-secondary mt-0.5">{promise.smartId}</p>
            </div>

            <div>
              <label htmlFor="edit-promised-amount" className="text-xs font-semibold text-primary block mb-1">
                Promised Amount (INR) *
              </label>
              <div className="relative">
                <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input maxLength={30}
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
              <input maxLength={30}
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
              <textarea maxLength={1000}
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
                className="px-4 py-2 rounded-xl text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-xs motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
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
