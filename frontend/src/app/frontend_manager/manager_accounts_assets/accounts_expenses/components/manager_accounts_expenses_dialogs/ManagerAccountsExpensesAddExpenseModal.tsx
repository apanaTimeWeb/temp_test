'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, CheckCircle, Receipt, Wallet, Smartphone, CreditCard, Building } from 'lucide-react';
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

const PAYMENT_MODES = [
  {
    id: 'cash',
    label: 'Cash (Counter)',
    icon: Wallet,
    activeStyle: {
      boxShadow: '0 0 14px rgba(16, 185, 129, 0.45)',
      backgroundColor: '#10b981',
      borderColor: '#34d399',
      color: '#ffffff',
    },
  },
  {
    id: 'upi',
    label: 'UPI / QR',
    icon: Smartphone,
    activeStyle: {
      boxShadow: '0 0 14px rgba(14, 165, 233, 0.45)',
      backgroundColor: '#0ea5e9',
      borderColor: '#38bdf8',
      color: '#ffffff',
    },
  },
  {
    id: 'card',
    label: 'Card (POS)',
    icon: CreditCard,
    activeStyle: {
      boxShadow: '0 0 14px rgba(168, 85, 247, 0.45)',
      backgroundColor: '#a855f7',
      borderColor: '#c084fc',
      color: '#ffffff',
    },
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    icon: Building,
    activeStyle: {
      boxShadow: '0 0 14px rgba(245, 158, 11, 0.45)',
      backgroundColor: '#f59e0b',
      borderColor: '#fbbf24',
      color: '#000000',
    },
  },
];

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
      source: (data as any).source || (data.mode === 'cash' ? 'petty_cash' : 'bank_direct'),
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-border bg-surface-highlight/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary border border-primary/25 flex items-center justify-center">
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
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer transition-colors"
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
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary">₹</span>
                <input
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
                id="expense-voucher-input"
                type="text"
                placeholder="e.g. V-9901, REC-441"
                {...register('voucherNo')}
                className="w-full px-3.5 py-2.5 bg-card border border-border rounded-xl text-xs text-primary outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Expense Fund Source: Petty Cash Float vs Bank Expense */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-secondary">
                Expense Fund Source <span className="text-destructive">*</span>
              </label>
              <span className="text-[11px] text-secondary">Separates counter cash float from bank</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setValue('source', 'petty_cash');
                  if (selectedMode !== 'cash') setValue('mode', 'cash');
                }}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left ${
                  selectedSource === 'petty_cash'
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400 shadow-sm'
                    : 'border-border bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Wallet size={16} />
                </div>
                <div>
                  <p className="font-bold">Petty Cash Float</p>
                  <p className="text-[10px] opacity-80">Counter cash drawer spend</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setValue('source', 'bank_direct');
                  if (selectedMode === 'cash') setValue('mode', 'bank');
                }}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left ${
                  selectedSource === 'bank_direct'
                    ? 'border-sky-500/50 bg-sky-500/15 text-sky-400 shadow-sm'
                    : 'border-border bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Building size={16} />
                </div>
                <div>
                  <p className="font-bold">Bank / Owner Account</p>
                  <p className="text-[10px] opacity-80">Direct bank/UPI/Owner outflow</p>
                </div>
              </button>
            </div>
          </div>

          {/* Interactive Payment Mode Selection Tiles (Glowing on Click) */}
          <div>
            <label className="text-xs font-semibold text-secondary block mb-1.5">
              Payment Mode <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAYMENT_MODES.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      setValue('mode', mode.id as any, { shouldValidate: true });
                      if (mode.id === 'cash') {
                        setValue('source', 'petty_cash');
                      } else {
                        setValue('source', 'bank_direct');
                      }
                    }}
                    style={isSelected ? mode.activeStyle : undefined}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'border shadow-sm font-bold'
                        : 'bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover border-border/80'
                    }`}
                  >
                    <Icon size={16} className="mb-1" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="expense-paidby-input" className="text-xs font-semibold text-secondary block mb-1">
              Disbursed By (Staff / Manager Name)
            </label>
            <input
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
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-secondary hover:text-primary cursor-pointer shadow-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle size={14} />
              <span>Record Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManagerAccountsExpensesAddExpenseModal;
