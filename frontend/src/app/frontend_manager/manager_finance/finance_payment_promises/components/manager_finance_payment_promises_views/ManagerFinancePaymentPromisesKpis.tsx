'use client';

import type { ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesTypes';
import { AlertTriangle, CheckCircle2, Clock, IndianRupee } from 'lucide-react';

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

  const cards = [
    {
      key: 'total',
      variant: 'indigo',
      label: 'Total Commitments',
      value: formatCurrency(totalAmount),
      valClass: 'text-white',
      chip: isScopedHorizon ? timeHorizonLabel : 'Total Pipeline',
      subtitle: `${promises.length} promises recorded`,
      Icon: IndianRupee,
    },
    {
      key: 'pending',
      variant: 'amber',
      label: 'Pending Promises',
      value: String(pendingCount),
      valClass: 'text-amber-400',
      chip: 'Awaiting Due',
      subtitle: 'Scheduled for upcoming collection',
      Icon: Clock,
    },
    {
      key: 'overdue',
      variant: 'rose',
      label: 'Broken / Overdue',
      value: String(overdueCount),
      valClass: 'text-rose-400',
      chip: 'Action Needed',
      subtitle: 'Commitment deadline passed',
      Icon: AlertTriangle,
    },
    {
      key: 'fulfilled',
      variant: 'emerald',
      label: 'Fulfilled Commitments',
      value: String(fulfilledCount),
      valClass: 'text-emerald-400',
      chip: 'Cleared',
      subtitle: 'Successfully collected promises',
      Icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, variant, label, value, valClass, chip, subtitle, Icon }) => (
        <div
          key={key}
          className={`fin-promise-kpi-card--${variant} group relative overflow-hidden rounded-2xl border p-5 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between`}
        >
          <svg
            aria-hidden="true"
            className="fin-promise-kpi-spark absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none"
            viewBox="0 0 150 45"
          >
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</span>
              <div className="fin-promise-kpi-icon w-10 h-10 rounded-xl border flex items-center justify-center motion-safe:transition-transform group-hover:scale-110 shadow-xs">
                <Icon size={20} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between gap-2">
                <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${valClass}`}>{value}</div>
                <span className="fin-promise-kpi-chip text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border">
                  {chip}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
