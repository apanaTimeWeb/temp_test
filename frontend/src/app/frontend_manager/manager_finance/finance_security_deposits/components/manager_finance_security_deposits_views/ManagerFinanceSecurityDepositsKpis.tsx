'use client';

import type { ManagerFinanceSecurityDepositsSampleDeposit } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';
import { formatDepositInr } from '@/app/frontend_manager/manager_finance/finance_security_deposits/utils/ManagerFinanceSecurityDepositsHelpers';
import { AlertCircle, ArrowDownLeft, IndianRupee, ShieldCheck } from 'lucide-react';

interface ManagerFinanceSecurityDepositsKpisProps {
  deposits: ManagerFinanceSecurityDepositsSampleDeposit[];
  timeHorizonLabel: string;
}

export function ManagerFinanceSecurityDepositsKpis({
  deposits,
  timeHorizonLabel,
}: ManagerFinanceSecurityDepositsKpisProps) {
  const totalEscrow = deposits.filter((d) => d.status === 'held').reduce((acc, d) => acc + d.depositAmount, 0);
  const forfeitedCount = deposits.filter((d) => d.status === 'forfeited').length;
  const totalDeductions = deposits.reduce((acc, d) => acc + (d.deductionAmount || 0), 0);
  const refundedCount = deposits.filter((d) => d.status === 'refunded').length;
  const isScopedHorizon = Boolean(timeHorizonLabel && timeHorizonLabel !== 'All Time' && timeHorizonLabel !== 'All Deposits');

  const cards = [
    {
      key: 'escrow',
      variant: 'cyan',
      label: 'Active Escrow Pool',
      labelCls: 'text-cyan-300',
      val: formatDepositInr(totalEscrow),
      valCls: 'text-cyan-300',
      chip: isScopedHorizon ? timeHorizonLabel : 'In Escrow',
      sub: 'Secured caution funds in vault',
      subCls: 'text-cyan-200/70',
      Icon: ShieldCheck,
    },
    {
      key: 'forfeited',
      variant: 'amber',
      label: 'Forfeited Deposits',
      labelCls: 'text-slate-300',
      val: String(forfeitedCount),
      valCls: 'text-amber-400',
      chip: 'Forfeited',
      sub: 'Policy violation retentions',
      subCls: 'text-slate-400',
      Icon: AlertCircle,
    },
    {
      key: 'deductions',
      variant: 'rose',
      label: 'Damages / Deductions',
      labelCls: 'text-slate-300',
      val: formatDepositInr(totalDeductions),
      valCls: 'text-rose-400',
      chip: 'Damage Recovery',
      sub: 'Penalty forfeitures applied',
      subCls: 'text-slate-400',
      Icon: IndianRupee,
    },
    {
      key: 'refunded',
      variant: 'emerald',
      label: 'Disbursed Refunds',
      labelCls: 'text-slate-300',
      val: String(refundedCount),
      valCls: 'text-emerald-400',
      chip: 'Disbursed',
      sub: 'Returned to checkout students',
      subCls: 'text-slate-400',
      Icon: ArrowDownLeft,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, variant, label, labelCls, val, valCls, chip, sub, subCls, Icon }) => (
        <div
          key={key}
          className={`fin-deposit-kpi-card--${variant} group relative overflow-hidden rounded-2xl border p-5 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between`}
        >
          <svg
            aria-hidden="true"
            className="fin-deposit-kpi-spark absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none"
            viewBox="0 0 150 45"
          >
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold uppercase tracking-wider ${labelCls}`}>{label}</span>
              <div className="fin-deposit-kpi-icon w-10 h-10 rounded-xl border flex items-center justify-center motion-safe:transition-transform group-hover:scale-110 shadow-xs">
                <Icon size={20} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between gap-2">
                <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${valCls}`}>{val}</div>
                <span className="fin-deposit-kpi-chip text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border">
                  {chip}
                </span>
              </div>
              <p className={`mt-1 text-xs ${subCls}`}>{sub}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
