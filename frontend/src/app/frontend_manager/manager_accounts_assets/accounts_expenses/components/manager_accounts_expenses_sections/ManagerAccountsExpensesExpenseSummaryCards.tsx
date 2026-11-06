'use client';
import type { ManagerAccountsExpensesExpenseSummaryCardsProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';
import { TrendingDown, Calendar, FileSpreadsheet, Layers } from 'lucide-react';

// RESPONSIBILITY: Render the accounts expenses expense summary cards section with executive design system styling.

export default function ManagerAccountsExpensesExpenseSummaryCards({
  expenses,
  visibleExpenses,
  formatCurrency,
  labels,
  timeHorizonLabel = 'This Month',
}: ManagerAccountsExpensesExpenseSummaryCardsProps) {
  const totalOutflow = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const activeHorizonOutflow = visibleExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalEntries = visibleExpenses.length;
  const distinctCategories = new Set(visibleExpenses.map((expense) => expense.category)).size;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Outflow */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{labels.totalExpenses}</span>
          <div className="w-10 h-10 rounded-xl bg-danger-bg text-danger border border-border flex items-center justify-center">
            <TrendingDown size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-danger">
              {formatCurrency(totalOutflow)}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-danger border border-border">
              [All Time]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Cumulative recorded outflow</p>
        </div>
      </div>

      {/* Selected Horizon Expenses */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{labels.thisMonth}</span>
          <div className="w-10 h-10 rounded-xl bg-warning-bg text-warning-text border border-border flex items-center justify-center">
            <Calendar size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-primary">
              {formatCurrency(activeHorizonOutflow)}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-warning-text border border-border">
              [{timeHorizonLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Filtered time horizon spend ({timeHorizonLabel})</p>
        </div>
      </div>

      {/* Entries Count */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{labels.entries}</span>
          <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary border border-border flex items-center justify-center">
            <FileSpreadsheet size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-primary">
              {totalEntries}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
              [{timeHorizonLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Disbursement vouchers ({timeHorizonLabel})</p>
        </div>
      </div>

      {/* Distinct Categories */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{labels.categories}</span>
          <div className="w-10 h-10 rounded-xl bg-muted text-secondary border border-border flex items-center justify-center">
            <Layers size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-primary">
              {distinctCategories}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-secondary border border-border">
              [{timeHorizonLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Active budget cost heads ({timeHorizonLabel})</p>
        </div>
      </div>
    </div>
  );
}
