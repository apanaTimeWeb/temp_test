'use client';

import { Plus, Receipt } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { AdminAccountsExpensesHeaderSectionProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';

export function AdminAccountsExpensesHeaderSection({ onAddExpense, canMutate }: AdminAccountsExpensesHeaderSectionProps) {
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');

  return (
    <header className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300">
          <Receipt className="h-3.5 w-3.5" />
          Operational Expense Ledger
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Library Operational Expenses</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Track utility bills, facility maintenance, housekeeping purchases, and branch petty cash approvals
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canMutate}
          title={!canMutate ? t('CREATE_BLOCKED') : undefined}
          onClick={onAddExpense}
        >
          <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
          {t('ADD_EXPENSE')}
        </button>
      </div>
    </header>
  );
}

export default AdminAccountsExpensesHeaderSection;
