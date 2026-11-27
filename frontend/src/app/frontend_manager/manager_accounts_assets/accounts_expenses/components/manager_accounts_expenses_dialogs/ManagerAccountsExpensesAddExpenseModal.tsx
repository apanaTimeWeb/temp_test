'use client';

import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { ManagerAccountsExpensesPaymentModeSelector } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_dialogs/ManagerAccountsExpensesPaymentModeSelector';
import { MANAGER_ACCOUNTING_EXPENSE_CATEGORIES as CATEGORIES } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/constants/ManagerAccountsExpensesConstants';
import {
  managerAccountsExpensesAddExpenseModalSchema,
  type ManagerAccountsExpensesAddExpenseModalFormData,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/schemas/ManagerAccountsExpensesExpenseDraftSchema';
import type { Expense } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, IndianRupee, Receipt, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

interface ManagerAccountsExpensesAddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Expense, amount: number) => void;
}

export function ManagerAccountsExpensesAddExpenseModal({
  isOpen,
  onClose,
  onAddExpense,
}: ManagerAccountsExpensesAddExpenseModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ManagerAccountsExpensesAddExpenseModalFormData>({
    resolver: zodResolver(managerAccountsExpensesAddExpenseModalSchema),
    defaultValues: {
      category: CATEGORIES[0] || 'Utilities',
      description: '',
      amount: '',
      mode: 'cash',
      source: 'petty_cash',
      paidBy: 'Manager Counter',
      voucherNo: '',
    },
  });

  const selectedMode = useWatch({ control, name: 'mode' });
  const selectedSource = useWatch({ control, name: 'source' }) || (selectedMode === 'cash' ? 'petty_cash' : 'bank_direct');

  useEffect(() => {
    if (!isOpen) {
      reset();
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, reset, onClose]);

  if (!isOpen) return null;

  const onSubmit = (data: ManagerAccountsExpensesAddExpenseModalFormData) => {
    const amt = Number(data.amount);
    const newExpense: Expense = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      category: data.category,
      description: data.voucherNo?.trim()
        ? `${data.description.trim()} (Bill #${data.voucherNo.trim()})`
        : data.description.trim(),
      amount: Math.round(amt * 100),
      mode: data.mode,
      source: data.source || (data.mode === 'cash' ? 'petty_cash' : 'bank_direct'),
      paidBy: data.paidBy?.trim() || 'Manager Counter',
    };

    onAddExpense(newExpense, amt);
    reset();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-add-expense-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 motion-safe:animate-in fade-in motion-safe:duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto motion-safe:animate-in zoom-in-95 motion-safe:duration-150">
        <div className="flex items-center justify-between p-5 border-b border-border bg-surface-highlight">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-subtle text-primary border border-border flex items-center justify-center">
              <Receipt size={18} />
            </div>
            <div>
              <h3 id="modal-add-expense-title" className="font-bold text-primary text-base">
                Record Operational Expense
              </h3>
              <p className="text-[11px] text-secondary">Log branch disbursement voucher into general ledger</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer motion-safe:transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6 space-y-4" noValidate>
          <div>
            <label htmlFor="expense-category-select" className="text-xs font-semibold text-secondary block mb-1">
              Expense Category <span className="text-destructive">*</span>
            </label>
            <select
              id="expense-category-select"
              {...register('category')}
              className="w-full px-3.5 py-2.5 bg-card border border-border rounded-xl text-xs text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-destructive mt-1" role="alert">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="expense-description-input" className="text-xs font-semibold text-secondary block mb-1">
              Description / Purpose <span className="text-destructive">*</span>
            </label>
            <input
              maxLength={250}
              id="expense-description-input"
              type="text"
              placeholder="e.g. Broadband recharge, RO filter service, Study hall cleaning..."
              {...register('description')}
              aria-invalid={Boolean(errors.description)}
              className="w-full px-3.5 py-2.5 bg-card border border-border rounded-xl text-xs text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="expense-amount-input" className="text-xs font-semibold text-secondary block mb-1">
                Amount (INR) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <IndianRupee size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" aria-hidden="true" />
                <input
                  maxLength={30}
                  id="expense-amount-input"
                  type="number"
                  step="any"
                  min="1"
                  placeholder="0.00"
                  {...register('amount')}
                  aria-invalid={Boolean(errors.amount)}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-card border border-border rounded-xl text-xs text-primary outline-none focus:border-primary font-bold font-mono"
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-destructive mt-1" role="alert">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="expense-voucher-input" className="text-xs font-semibold text-secondary block mb-1">
                Bill / Voucher # <span className="font-normal text-xs text-secondary">(Optional)</span>
              </label>
              <input
                maxLength={30}
                id="expense-voucher-input"
                type="text"
                placeholder="e.g. V-9901, REC-441"
                {...register('voucherNo')}
                className="w-full px-3.5 py-2.5 bg-card border border-border rounded-xl text-xs text-primary outline-none focus:border-primary"
              />
            </div>
          </div>

          <ManagerAccountsExpensesPaymentModeSelector
            selectedMode={selectedMode}
            selectedSource={selectedSource}
            setValue={setValue}
          />

          <div>
            <label htmlFor="expense-paidby-input" className="text-xs font-semibold text-secondary block mb-1">
              Disbursed By (Staff / Manager Name)
            </label>
            <input
              maxLength={30}
              id="expense-paidby-input"
              type="text"
              placeholder="e.g. Branch Manager Satyam"
              {...register('paidBy')}
              className="w-full px-3.5 py-2.5 bg-card border border-border rounded-xl text-xs text-primary outline-none focus:border-primary"
            />
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-secondary hover:text-primary cursor-pointer shadow-xs motion-safe:transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-xs motion-safe:transition-all cursor-pointer"
            >
              {isSubmitting ? <ButtonLoader icon="receipt" /> : <CheckCircle size={14} />}
              <span>{isSubmitting ? 'Recording...' : 'Record Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManagerAccountsExpensesAddExpenseModal;
