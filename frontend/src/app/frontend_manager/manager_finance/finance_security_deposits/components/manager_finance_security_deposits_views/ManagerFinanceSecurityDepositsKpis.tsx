'use client';

import React from 'react';
import { ShieldCheck, IndianRupee, AlertCircle, ArrowDownLeft } from 'lucide-react';
import type { ManagerFinanceSecurityDepositsSampleDeposit } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Escrow Pool */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Active Escrow Pool</span>
          <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary border border-border flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-primary">
              ₹{totalEscrow.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {isScopedHorizon ? timeHorizonLabel : 'In Escrow'}
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Secured caution funds in vault</p>
        </div>
      </div>

      {/* Forfeited Deposits */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-amber-500/40 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Forfeited Deposits</span>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {forfeitedCount}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Forfeited
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Policy violation retentions</p>
        </div>
      </div>

      {/* Total Deductions / Penalties */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-rose-500/40 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Damages / Deductions</span>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <IndianRupee size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              ₹{totalDeductions.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Damage Recovery
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Penalty forfeitures applied</p>
        </div>
      </div>

      {/* Disbursed Refunds */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-emerald-500/40 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Disbursed Refunds</span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <ArrowDownLeft size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {refundedCount}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Disbursed
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Returned to checkout students</p>
        </div>
      </div>
    </div>
  );
}
export default ManagerFinanceSecurityDepositsKpis;
