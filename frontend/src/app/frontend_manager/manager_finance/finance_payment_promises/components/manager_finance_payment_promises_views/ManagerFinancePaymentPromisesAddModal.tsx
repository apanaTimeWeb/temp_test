'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AlertCircle, CheckCircle, IndianRupee, Plus, X } from 'lucide-react';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { MANAGER_MEMBERS_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryFixtures';
import type { ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesPaymentPromiseSampleFixtures';
import { useManagerPaymentPromisesDialogFocus } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/ManagerFinancePaymentPromisesDialogFocus';
import { managerFinancePaymentPromiseAddSchema } from '@/app/frontend_manager/manager_finance/finance_payment_promises/schemas/ManagerFinancePaymentPromisesSchema';

export interface ManagerFinancePaymentPromisesAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPromise: (promise: ManagerFinancePaymentPromisesPaymentPromiseSample) => void;
}

export function ManagerFinancePaymentPromisesAddModal({
  isOpen,
  onClose,
  onAddPromise,
}: ManagerFinancePaymentPromisesAddModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [smartId, setSmartId] = useState('');
  const [_phone, setPhone] = useState('');
  const [amount, setAmount] = useState('1500');
  const [expectedDate, setExpectedDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().slice(0, 10);
  });
  const [remarks, setRemarks] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ student?: string; amount?: string; date?: string }>({});

  useManagerPaymentPromisesDialogFocus(dialogRef, onClose, isOpen);

  useEffect(() => {
    if (!isOpen) {
      setFieldErrors({});
    }
  }, [isOpen]);

  const studentOptions: ComboboxOption[] = useMemo(() => {
    return MANAGER_MEMBERS_DEMO_RECORDS.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.id})`,
      subLabel: s.seat ? `Seat ${s.seat} · ${s.phone}` : s.phone,
      badge: s.status,
    }));
  }, []);

  if (!isOpen) return null;

  const handleSelectStudent = (val: string) => {
    if (!val) {
      setSelectedStudentId('');
      setStudentName('');
      setSmartId('');
      setPhone('');
      return;
    }
    const student = MANAGER_MEMBERS_DEMO_RECORDS.find((s) => s.id === val);
    if (student) {
      setSelectedStudentId(student.id);
      setStudentName(student.name);
      setSmartId(student.id);
      setPhone(student.phone);
      setFieldErrors((prev) => ({ ...prev, student: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = managerFinancePaymentPromiseAddSchema.safeParse({
      studentName,
      smartId,
      amount,
      expectedDate,
      remarks,
    });

    if (!result.success) {
      const errors: { student?: string; amount?: string; date?: string } = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === 'studentName') errors.student = issue.message;
        if (issue.path[0] === 'amount') errors.amount = issue.message;
        if (issue.path[0] === 'expectedDate') errors.date = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    const sanitizedRupees = Math.max(1, Math.round(Number(amount)) || 1000);
    const sanitizedAmountMinor = sanitizedRupees * 100;

    const newPromise: ManagerFinancePaymentPromisesPaymentPromiseSample = {
      id: Date.now(),
      studentName: studentName.trim(),
      smartId: smartId || `LIB-${Math.floor(100 + Math.random() * 900)}`,
      promisedAmount: sanitizedAmountMinor,
      expectedDate: expectedDate || new Date().toISOString().slice(0, 10),
      daysUntilDue: 7,
      status: 'pending',
      timesChanged: 0,
      remarks: remarks.trim() || 'Student counter commitment recorded by branch manager.',
    };

    onAddPromise(newPromise);
    setSelectedStudentId('');
    setStudentName('');
    setSmartId('');
    setPhone('');
    setRemarks('');
    setFieldErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-promise-modal-title"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-subtle text-primary flex items-center justify-center">
              <Plus size={18} />
            </div>
            <h2 id="add-promise-modal-title" className="text-base font-bold text-primary">
              Record Payment Commitment
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-primary outline-none"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label id="select-student-label" className="text-xs font-semibold text-primary block mb-1">
              Select Student *
            </label>
            <SearchableCombobox
              options={studentOptions}
              value={selectedStudentId}
              onChange={handleSelectStudent}
              placeholder="Search student by name or Smart ID..."
              searchPlaceholder="Type name or LIB-ID..."
              aria-label="Select student for payment promise"
              aria-labelledby="select-student-label"
            />
            {fieldErrors.student && (
              <p role="alert" className="text-xs text-danger mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> {fieldErrors.student}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="add-promised-amount" className="text-xs font-semibold text-primary block mb-1">
                Promised Amount (₹) *
              </label>
              <div className="relative">
                <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  id="add-promised-amount"
                  name="promisedAmount"
                  type="number"
                  required
                  min="1"
                  aria-invalid={Boolean(fieldErrors.amount)}
                  aria-describedby={fieldErrors.amount ? 'add-amount-error' : undefined}
                  className="mgr-input pl-8 text-xs font-mono font-bold w-full focus-visible:ring-2 focus-visible:ring-primary"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (fieldErrors.amount) setFieldErrors((p) => ({ ...p, amount: undefined }));
                  }}
                />
              </div>
              {fieldErrors.amount && (
                <p id="add-amount-error" role="alert" className="text-xs text-danger mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {fieldErrors.amount}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="add-expected-date" className="text-xs font-semibold text-primary block mb-1">
                Expected Date *
              </label>
              <input
                id="add-expected-date"
                name="expectedDate"
                type="date"
                required
                aria-invalid={Boolean(fieldErrors.date)}
                aria-describedby={fieldErrors.date ? 'add-date-error' : undefined}
                className="mgr-input text-xs w-full focus-visible:ring-2 focus-visible:ring-primary"
                value={expectedDate}
                onChange={(e) => {
                  setExpectedDate(e.target.value);
                  if (fieldErrors.date) setFieldErrors((p) => ({ ...p, date: undefined }));
                }}
              />
              {fieldErrors.date && (
                <p id="add-date-error" role="alert" className="text-xs text-danger mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {fieldErrors.date}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="add-remarks" className="text-xs font-semibold text-primary block mb-1">
              Reason / Remarks <span className="font-normal text-xs text-secondary">(Optional)</span>
            </label>
            <textarea
              id="add-remarks"
              name="remarks"
              rows={2}
              className="mgr-input text-xs resize-none w-full focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="e.g. Student requested grace period until bank transfer from parents..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
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
              disabled={!studentName.trim() || !amount.trim()}
              className="mgr-btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary"
            >
              <CheckCircle size={14} /> Record Commitment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
