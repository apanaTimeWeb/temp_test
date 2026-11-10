'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, CheckCircle, Receipt } from 'lucide-react';
import type { Expense } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';
import { MANAGER_ACCOUNTING_EXPENSE_CATEGORIES as CATEGORIES } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/constants/ManagerAccountsExpensesConstants';
import {
  managerAccountsExpensesAddExpenseModalSchema,
  type ManagerAccountsExpensesAddExpenseModalFormData,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/schemas/ManagerAccountsExpensesExpenseDraftSchema';

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
    formState: { errors, isSubmitting },
  } = useForm<ManagerAccountsExpensesAddExpenseModalFormData>({
    resolver: zodResolver(managerAccountsExpensesAddExpenseModalSchema),
    defaultValues: {
      category: CATEGORIES[0] || 'Utilities',
      description: '',
      amount: '',
      mode: 'cash',
      paidBy: 'Manager Counter',
      voucherNo: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: ManagerAccountsExpensesAddExpenseModalFormData) => {
    const amt = Number(data.amount);
    const newExpense: Expense = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      category: data.category,
      description: data.voucherNo?.trim() ? `${data.description.trim()} (Bill #${data.voucherNo.trim()})` : data.description.trim(),
      amount: Math.round(amt * 100),
      mode: data.mode,
      paidBy: data.paidBy?.trim() || 'Manager Counter',
    };

    onAddExpense(newExpense, amt);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop backdrop-blur-xs p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden motion-safe:animate-scale-up" role="dialog" aria-modal="true" aria-labelledby="modal-add-expense-title">
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted">
          <div className="flex items-center gap-2">
            <Receipt className="text-primary" size={18} />
            <h3 id="modal-add-expense-title" className="font-bold text-primary text-base">Record Operational Expense</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-primary cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
          <div>
            <label htmlFor="expense-category-select" className="text-xs font-semibold text-secondary block mb-1">
              Expense Category <span className="text-destructive">*</span>
            </label>
            <select
              id="expense-category-select"
              {...register('category')}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-destructive mt-1" role="alert">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="expense-description-input" className="text-xs font-semibold text-secondary block mb-1">
              Description / Purpose <span className="text-destructive">*</span>
            </label>
            <input
              id="expense-description-input"
              type="text"
              placeholder="e.g. Broadband recharge, RO filter service, Printing..."
              {...register('description')}
              aria-invalid={Boolean(errors.description)}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
            />
            {errors.description && <p className="text-xs text-destructive mt-1" role="alert">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="expense-amount-input" className="text-xs font-semibold text-secondary block mb-1">
                Amount (INR) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary">₹</span>
                <input
                  id="expense-amount-input"
                  type="number"
                  step="any"
                  min="1"
                  placeholder="0.00"
                  {...register('amount')}
                  aria-invalid={Boolean(errors.amount)}
                  className="w-full pl-7 pr-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary font-bold"
                />
              </div>
              {errors.amount && <p className="text-xs text-destructive mt-1" role="alert">{errors.amount.message}</p>}
            </div>

            <div>
              <label htmlFor="expense-mode-select" className="text-xs font-semibold text-secondary block mb-1">Payment Mode</label>
              <select
                id="expense-mode-select"
                {...register('mode')}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary uppercase"
              >
                <option value="cash">Cash (Counter)</option>
                <option value="upi">UPI / QR</option>
                <option value="card">Card (POS)</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="expense-voucher-input" className="text-xs font-semibold text-secondary block mb-1">
                Bill / Voucher # <span className="font-normal text-xs text-secondary">(Optional)</span>
              </label>
              <input
                id="expense-voucher-input"
                type="text"
                placeholder="Optional voucher no."
                {...register('voucherNo')}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="expense-paidby-input" className="text-xs font-semibold text-secondary block mb-1">Paid By (Disbursed by)</label>
              <input
                id="expense-paidby-input"
                type="text"
                {...register('paidBy')}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-secondary hover:text-primary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mgr-btn-primary px-4 py-2 rounded-xl text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
            >
              <CheckCircle size={14} /> Record Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
