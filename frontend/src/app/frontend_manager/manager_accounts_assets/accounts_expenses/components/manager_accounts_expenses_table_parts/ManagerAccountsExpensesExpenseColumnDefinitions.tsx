'use client';

import type { NativeCellParams,NativeColumn } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_table_parts/ManagerAccountsExpensesNativeTable';
import type { ManagerAccountsExpensesExpenseSample } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/hooks/ManagerAccountsExpensesDemoRepository';
import type { CurrencyFormatter,Labels,PaymentMode } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';
import { Eye,Trash2 } from 'lucide-react';

const MODE_BADGE: Record<PaymentMode, string> = {
  cash: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  upi: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
  card: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  bank: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
};

/** Build localized, presentation-only column definitions for the sample expense ledger. */
export function createManagerExpensesExpenseColumnDefinitions(
  labels: Labels,
  formatCurrency: CurrencyFormatter,
  onViewDetails?: (expense: ManagerAccountsExpensesExpenseSample) => void,
  onDeleteExpense?: (id: number) => void,
): NativeColumn<ManagerAccountsExpensesExpenseSample>[] {
  return [
    {
      field: 'date',
      headerName: labels.date,
      width: 120,
      cellRenderer: (params: NativeCellParams<ManagerAccountsExpensesExpenseSample>) => (
        <span className="text-secondary text-xs font-mono">{params.value}</span>
      ),
    },
    {
      field: 'category',
      headerName: labels.category,
      width: 140,
      cellRenderer: (params: NativeCellParams<ManagerAccountsExpensesExpenseSample>) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-subtle text-primary border border-border">
          {params.value}
        </span>
      ),
    },
    {
      field: 'description',
      headerName: labels.description,
      flex: 1,
      minWidth: 190,
      cellRenderer: (params: NativeCellParams<ManagerAccountsExpensesExpenseSample>) => (
        <span className="font-semibold text-primary text-xs">{params.value}</span>
      ),
    },
    {
      field: 'amount',
      headerName: labels.amount,
      width: 130,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (params: NativeCellParams<ManagerAccountsExpensesExpenseSample>) => (
        <span className="text-rose-400 font-bold font-mono text-xs">
          {formatCurrency(Number(params.value ?? 0))}
        </span>
      ),
    },
    {
      field: 'mode',
      headerName: labels.mode,
      width: 140,
      cellRenderer: (params: NativeCellParams<ManagerAccountsExpensesExpenseSample>) => {
        const mode = (params.value as PaymentMode) || 'cash';
        const badgeClass = MODE_BADGE[mode] || 'bg-muted text-secondary border border-border';
        const isPettyCash = params.data?.source === 'petty_cash' || (!params.data?.source && mode === 'cash');
        return (
          <div className="flex flex-col gap-0.5">
            <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeClass}`}>
              {mode}
            </span>
            <span className={`text-[10px] font-medium ${isPettyCash ? 'text-emerald-400' : 'text-sky-400'}`}>
              {isPettyCash ? '• Petty Cash' : '• Bank / Owner'}
            </span>
          </div>
        );
      },
    },
    {
      field: 'paidBy',
      headerName: labels.paidBy,
      width: 140,
      cellRenderer: (params: NativeCellParams<ManagerAccountsExpensesExpenseSample>) => (
        <span className="text-secondary text-xs">{params.value || '—'}</span>
      ),
    },
    {
      headerName: labels.actions,
      width: 120,
      sortable: false,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (params: NativeCellParams<ManagerAccountsExpensesExpenseSample>) => {
        const expense = params.data;
        if (!expense) return null;

        return (
          <div className="h-full flex justify-end items-center gap-1.5">
            {onViewDetails && (
              <button
                type="button"
                onClick={() => onViewDetails(expense)}
                className="p-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/15 motion-safe:transition-colors cursor-pointer"
                title={`View voucher for ${expense.description}`}
                aria-label={`View voucher for ${expense.description}`}
              >
                <Eye size={15} />
              </button>
            )}

            {onDeleteExpense ? (
              <button
                type="button"
                onClick={() => onDeleteExpense(expense.id)}
                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 motion-safe:transition-colors cursor-pointer"
                title="Delete expense voucher"
                aria-label={`Delete expense voucher ${expense.id}`}
              >
                <Trash2 size={15} />
              </button>
            ) : (
              <button
                type="button"
                className="fin-badge fin-badge--danger cursor-not-allowed opacity-50"
                disabled
                title={labels.deleteUnavailable}
                aria-label={labels.deleteUnavailable}
              >
                <Trash2 size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        );
      },
    },
  ];
}

export default createManagerExpensesExpenseColumnDefinitions;
