'use client';

import { ShieldCheck, IndianRupee, AlertCircle, ArrowDownLeft } from 'lucide-react';
import type { AdminFinanceSecurityDeposit } from '../types/AdminFinanceSecurityDepositsTypes';

export interface AdminFinanceSecurityDepositsKpisProps {
  deposits: AdminFinanceSecurityDeposit[];
  timeHorizonLabel: string;
}

export function AdminFinanceSecurityDepositsKpis({
  deposits,
  timeHorizonLabel,
}: AdminFinanceSecurityDepositsKpisProps) {
  const totalEscrow = deposits
    .filter((d) => d.status === 'held')
    .reduce((acc, d) => acc + (d.depositAmount - (d.deductionAmount || 0)), 0);

  const forfeitedList = deposits.filter((d) => d.status === 'forfeited');
  const forfeitedCount = forfeitedList.length;
  const forfeitedAmount = forfeitedList.reduce((acc, d) => acc + d.depositAmount, 0);

  const totalDeductions = deposits.reduce((acc, d) => acc + (d.deductionAmount || 0), 0);

  const refundedList = deposits.filter((d) => d.status === 'refunded');
  const refundedCount = refundedList.length;
  const refundedAmount = refundedList.reduce(
    (acc, d) => acc + (d.depositAmount - (d.deductionAmount || 0)),
    0
  );

  const isScoped = timeHorizonLabel !== 'All Time';

  const CARDS = [
    {
      title: 'Active Escrow Pool',
      subtitle: 'Secured caution funds held in vault',
      value: `₹${totalEscrow.toLocaleString('en-IN')}`,
      chip: isScoped ? timeHorizonLabel : 'In Escrow',
      chipCls: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      icon: ShieldCheck,
      iconCls: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
      cardBg:
        'border-indigo-500/30 bg-gradient-to-br from-indigo-950/70 via-card to-indigo-900/40 shadow-xs hover:border-indigo-400/50',
      stroke: '#818cf8',
      valColor: 'text-primary',
    },
    {
      title: 'Forfeited Deposits',
      subtitle: `Policy violation retentions (₹${forfeitedAmount.toLocaleString('en-IN')})`,
      value: `${forfeitedCount} Accounts`,
      chip: 'Forfeited',
      chipCls: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      icon: AlertCircle,
      iconCls: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      cardBg:
        'border-amber-500/30 bg-gradient-to-br from-amber-950/70 via-card to-amber-900/40 shadow-xs hover:border-amber-400/50',
      stroke: '#fbbf24',
      valColor: 'text-amber-500 dark:text-amber-400',
    },
    {
      title: 'Damage & Deductions',
      subtitle: 'Key lost, chair/desk damage recovery',
      value: `₹${totalDeductions.toLocaleString('en-IN')}`,
      chip: 'Penalty Recovery',
      chipCls: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      icon: IndianRupee,
      iconCls: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      cardBg:
        'border-rose-500/30 bg-gradient-to-br from-rose-950/70 via-card to-rose-900/40 shadow-xs hover:border-rose-400/50',
      stroke: '#f87171',
      valColor: 'text-rose-500 dark:text-rose-400',
    },
    {
      title: 'Disbursed Refunds',
      subtitle: `Returned to checkout students (₹${refundedAmount.toLocaleString('en-IN')})`,
      value: `${refundedCount} Returned`,
      chip: 'Disbursed',
      chipCls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: ArrowDownLeft,
      iconCls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      cardBg:
        'border-emerald-500/30 bg-gradient-to-br from-emerald-950/70 via-card to-emerald-900/40 shadow-xs hover:border-emerald-400/50',
      stroke: '#34d399',
      valColor: 'text-emerald-500 dark:text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(
        ({
          title,
          subtitle,
          value,
          chip,
          chipCls,
          icon: Icon,
          iconCls,
          cardBg,
          stroke,
          valColor,
        }) => (
          <div
            key={title}
            className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg flex flex-col justify-between ${cardBg}`}
          >
            <svg
              aria-hidden="true"
              className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none"
              viewBox="0 0 150 45"
            >
              <path
                d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6"
                fill="none"
                stroke={stroke}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`p-2.5 rounded-xl border transition-transform group-hover:scale-110 shadow-xs ${iconCls}`}
                >
                  <Icon size={18} />
                </div>
                <span
                  className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${chipCls}`}
                >
                  {chip}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                  {title}
                </p>
                <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${valColor}`}>
                  {value}
                </h3>
                <p className="text-[11px] text-secondary mt-1">{subtitle}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
