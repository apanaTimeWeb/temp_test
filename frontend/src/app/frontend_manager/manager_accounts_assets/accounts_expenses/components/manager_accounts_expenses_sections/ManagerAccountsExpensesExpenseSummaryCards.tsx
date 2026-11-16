'use client';

import type { ManagerAccountsExpensesExpenseSummaryCardsProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';
import { TrendingDown, Calendar, FileSpreadsheet, Layers, Wallet, Building } from 'lucide-react';

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

  const isPettyCash = (exp: (typeof visibleExpenses)[0]) =>
    exp.source === 'petty_cash' || (!exp.source && exp.mode === 'cash');

  const pettyCashOutflow = visibleExpenses
    .filter(isPettyCash)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const bankOutflow = visibleExpenses
    .filter((e) => !isPettyCash(e))
    .reduce((sum, expense) => sum + expense.amount, 0);

  const pettyCashCount = visibleExpenses.filter(isPettyCash).length;
  const bankCount = visibleExpenses.filter((e) => !isPettyCash(e)).length;

  return (
    <div className="space-y-4">
      {/* Primary KPI Grid: Includes Petty Cash Float vs Bank Expense Split */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Outflow */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs cursor-default select-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              {labels.totalExpenses}
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-rose-400 font-mono">
              {formatCurrency(totalOutflow)}
            </div>
            <p className="mt-1 text-xs text-secondary">Cumulative recorded outflow</p>
          </div>
        </div>

        {/* Petty Cash Float (गल्ले से नकद खर्च) */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-xs cursor-default select-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Petty Cash Float (गल्ला)</span>
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Wallet size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-emerald-400 font-mono">
              {formatCurrency(pettyCashOutflow)}
            </div>
            <p className="mt-1 text-xs text-emerald-300/80">
              Counter drawer cash ({pettyCashCount} vouchers)
            </p>
          </div>
        </div>

        {/* Bank & Owner Direct Expenses (मालिक/बैंक खाता खर्च) */}
        <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5 shadow-xs cursor-default select-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Bank / Owner Account
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center">
              <Building size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-sky-400 font-mono">
              {formatCurrency(bankOutflow)}
            </div>
            <p className="mt-1 text-xs text-sky-300/80">
              Direct bank & UPI ({bankCount} vouchers)
            </p>
          </div>
        </div>

        {/* Selected Horizon Expenses */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs cursor-default select-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {labels.thisMonth}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-amber-400 font-mono">
              {formatCurrency(activeHorizonOutflow)}
            </div>
            <p className="mt-1 text-xs text-secondary">
              {totalEntries} {labels.entries} • {distinctCategories} {labels.categories}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
