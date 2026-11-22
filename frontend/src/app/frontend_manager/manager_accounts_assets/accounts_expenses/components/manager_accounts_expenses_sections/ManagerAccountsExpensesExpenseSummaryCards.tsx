'use client';

import type { ManagerAccountsExpensesExpenseSummaryCardsProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';
import { Building,Calendar,TrendingDown,Wallet } from 'lucide-react';

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
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-950/80 via-[#260e19] to-rose-900/60 p-5 shadow-lg shadow-rose-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-rose-400/60 hover:shadow-xl cursor-default select-none flex flex-col justify-between">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                {labels.totalExpenses}
              </span>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
                <TrendingDown size={20} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-400 font-mono">
                {formatCurrency(totalOutflow)}
              </div>
              <p className="mt-1 text-xs text-slate-400">Cumulative recorded outflow</p>
            </div>
          </div>
        </div>

        {/* Petty Cash Float */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0e2c21] to-emerald-900/60 p-5 shadow-lg shadow-emerald-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-400/60 hover:shadow-xl cursor-default select-none flex flex-col justify-between">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Petty Cash Float</span>
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
                <Wallet size={20} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400 font-mono">
                {formatCurrency(pettyCashOutflow)}
              </div>
              <p className="mt-1 text-xs text-emerald-200/70">
                Counter drawer cash ({pettyCashCount} vouchers)
              </p>
            </div>
          </div>
        </div>

        {/* Bank & Owner Direct Expenses */}
        <div className="group relative overflow-hidden rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-950/80 via-[#0e2540] to-sky-900/60 p-5 shadow-lg shadow-sky-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-sky-400/60 hover:shadow-xl cursor-default select-none flex flex-col justify-between">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Bank / Owner Account
              </span>
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
                <Building size={20} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-sky-400 font-mono">
                {formatCurrency(bankOutflow)}
              </div>
              <p className="mt-1 text-xs text-sky-200/70">
                Direct bank & UPI ({bankCount} vouchers)
              </p>
            </div>
          </div>
        </div>

        {/* Selected Horizon Expenses */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-[#261708] to-amber-900/60 p-5 shadow-lg shadow-amber-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl cursor-default select-none flex flex-col justify-between">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                {labels.thisMonth}
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
                <Calendar size={20} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-400 font-mono">
                {formatCurrency(activeHorizonOutflow)}
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {totalEntries} {labels.entries} • {distinctCategories} {labels.categories}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
