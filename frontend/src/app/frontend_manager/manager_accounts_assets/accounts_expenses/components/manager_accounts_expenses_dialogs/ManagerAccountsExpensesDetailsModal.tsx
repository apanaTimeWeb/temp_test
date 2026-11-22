'use client';

import type { Expense } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';
import { Calendar,Printer,Receipt,ShieldCheck,Tag,User,Wallet,X } from 'lucide-react';
import { useEffect } from 'react';

export interface ManagerAccountsExpensesDetailsModalProps {
  isOpen: boolean;
  expense: Expense | null;
  formatCurrency: (val: number) => string;
  onClose: () => void;
  onDeleteExpense?: (id: number) => void;
}

export function ManagerAccountsExpensesDetailsModal({
  isOpen,
  expense,
  formatCurrency,
  onClose,
  onDeleteExpense,
}: ManagerAccountsExpensesDetailsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !expense) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="expense-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Receipt size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-highlight border border-border text-secondary">
                  VOUCHER #{expense.id}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-primary-subtle text-primary border border-primary/20">
                  {expense.category}
                </span>
              </div>
              <h2 id="expense-details-title" className="text-base font-bold text-primary mt-1">
                {expense.description}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Amount Banner */}
        {(() => {
          const isPetty = expense.source === 'petty_cash' || (!expense.source && expense.mode === 'cash');
          return (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-between">
              <div>
                <span className="text-xs text-rose-300 font-semibold uppercase tracking-wider block">
                  Disbursed Amount
                </span>
                <span className="text-[11px] font-medium text-secondary">
                  Fund Source:{' '}
                  <strong className={isPetty ? 'text-emerald-400' : 'text-sky-400'}>
                    {isPetty ? 'Petty Cash Float (Counter)' : 'Bank / Owner Account'}
                  </strong>
                </span>
              </div>
              <span className="text-2xl font-black font-mono text-rose-400">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          );
        })()}

        {/* Voucher Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Calendar size={12} className="text-primary" /> Disbursement Date
            </span>
            <p className="font-semibold text-primary">{expense.date}</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Wallet size={12} className="text-emerald-400" /> Payment Mode
            </span>
            <p className="font-semibold text-emerald-400 uppercase tracking-wide">
              {expense.mode}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <User size={12} className="text-indigo-400" /> Paid By / Disbursed By
            </span>
            <p className="font-semibold text-primary">{expense.paidBy || 'Branch Counter'}</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Tag size={12} className="text-amber-400" /> Accounting Head
            </span>
            <p className="font-semibold text-amber-400">{expense.category}</p>
          </div>
        </div>

        {/* Verification Notice */}
        <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border text-[11px] text-secondary leading-relaxed flex items-start gap-2">
          <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
          <span>
            Expense voucher verified against branch treasury guidelines. Synchronized with internal ledger reconciliations.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
          >
            <Printer size={14} /> Print Expense Voucher
          </button>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
            >
              Close
            </button>
            {onDeleteExpense && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDeleteExpense(expense.id);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25 text-xs font-semibold shadow-xs cursor-pointer transition-all"
              >
                Delete Record
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerAccountsExpensesDetailsModal;
