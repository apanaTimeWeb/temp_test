'use client';

import React from 'react';
import { IndianRupee, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesPaymentPromiseSampleFixtures';

interface ManagerFinancePaymentPromisesKpisProps {
  promises: ManagerFinancePaymentPromisesPaymentPromiseSample[];
  timeHorizonLabel: string;
  formatCurrency: (amount: number) => string;
}

export function ManagerFinancePaymentPromisesKpis({
  promises,
  timeHorizonLabel,
  formatCurrency,
}: ManagerFinancePaymentPromisesKpisProps) {
  const totalAmount = promises.reduce((acc, p) => acc + p.promisedAmount, 0);
  const pendingCount = promises.filter((p) => p.status === 'pending').length;
  const overdueCount = promises.filter((p) => p.status === 'overdue').length;
  const fulfilledCount = promises.filter((p) => p.status === 'fulfilled').length;
  const isScopedHorizon = Boolean(timeHorizonLabel && timeHorizonLabel !== 'All Time');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Promised Amount */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Total Commitments</span>
          <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary border border-border flex items-center justify-center">
            <IndianRupee size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-primary">
              {formatCurrency(totalAmount)}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {isScopedHorizon ? timeHorizonLabel : 'Total Pipeline'}
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">{promises.length} promises recorded</p>
        </div>
      </div>

      {/* Pending Commitments */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Pending Promises</span>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {pendingCount}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Awaiting Due
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Scheduled for upcoming collection</p>
        </div>
      </div>

      {/* Overdue Commitments */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Broken / Overdue</span>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              {overdueCount}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Action Needed
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Commitment deadline passed</p>
        </div>
      </div>

      {/* Fulfilled Commitments */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Fulfilled Commitments</span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {fulfilledCount}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Cleared
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Dues collected successfully</p>
        </div>
      </div>
    </div>
  );
}
