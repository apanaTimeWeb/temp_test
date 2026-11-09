'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { X, CheckCircle, Receipt } from 'lucide-react';
import type { Expense } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';
import { MANAGER_ACCOUNTING_EXPENSE_CATEGORIES as CATEGORIES } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/constants/ManagerAccountsExpensesConstants';

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
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<string>(CATEGORIES[0] || 'Utilities');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseMode, setExpenseMode] = useState<'cash' | 'upi' | 'card' | 'bank'>('cash');
  const [expensePaidBy, setExpensePaidBy] = useState('Manager Counter');
  const [voucherNo, setVoucherNo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc.trim()) {
      toast.error('Expense description is required.');
      return;
    }
    const amt = Number(expenseAmount);
    if (!amt || amt <= 0) {
      toast.error('Valid positive expense amount is required.');
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      category: expenseCategory,
      description: voucherNo.trim() ? `${expenseDesc.trim()} (Bill #${voucherNo.trim()})` : expenseDesc.trim(),
      amount: Math.round(amt * 100),
      mode: expenseMode,
      paidBy: expensePaidBy.trim() || 'Manager Counter',
    };

    onAddExpense(newExpense, amt);
    setExpenseDesc('');
    setExpenseAmount('');
    setVoucherNo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop backdrop-blur-xs p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden motion-safe:animate-scale-up">
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted">
          <div className="flex items-center gap-2">
            <Receipt className="text-primary" size={18} />
            <h3 className="font-bold text-primary text-base">Record Operational Expense</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-primary cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-secondary block mb-1">
              Expense Category <span className="text-destructive">*</span>
            </label>
            <select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary block mb-1">
              Description / Purpose <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Broadband recharge, RO filter service, Printing..."
              value={expenseDesc}
              onChange={(e) => setExpenseDesc(e.target.value)}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-secondary block mb-1">
                Amount (INR) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary">₹</span>
                <input
                  type="number"
                  step="any"
                  min="1"
                  placeholder="0.00"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-secondary block mb-1">Payment Mode</label>
              <select
                value={expenseMode}
                onChange={(e) => setExpenseMode(e.target.value as 'cash' | 'upi' | 'card' | 'bank')}
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
              <label className="text-xs font-semibold text-secondary block mb-1">
                Bill / Voucher # <span className="font-normal text-xs text-secondary">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Optional voucher no."
                value={voucherNo}
                onChange={(e) => setVoucherNo(e.target.value)}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-secondary block mb-1">Paid By (Disbursed by)</label>
              <input
                type="text"
                value={expensePaidBy}
                onChange={(e) => setExpensePaidBy(e.target.value)}
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

