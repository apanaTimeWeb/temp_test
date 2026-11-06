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
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
              [{timeHorizonLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Secured caution funds</p>
        </div>
      </div>

      {/* Forfeited Deposits */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Forfeited Deposits</span>
          <div className="w-10 h-10 rounded-xl bg-warning-bg text-warning-text border border-border flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-warning-text">
              {forfeitedCount}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-warning-text border border-border">
              [{timeHorizonLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Policy violation deductions</p>
        </div>
      </div>

      {/* Total Deductions / Penalties */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Damages / Deductions</span>
          <div className="w-10 h-10 rounded-xl bg-danger-bg text-danger border border-border flex items-center justify-center">
            <IndianRupee size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-danger">
              ₹{totalDeductions.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-danger border border-border">
              [{timeHorizonLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Penalty forfeitures applied</p>
        </div>
      </div>

      {/* Disbursed Refunds */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Disbursed Refunds</span>
          <div className="w-10 h-10 rounded-xl bg-success-bg text-success border border-border flex items-center justify-center">
            <ArrowDownLeft size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-success">
              {refundedCount}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-success border border-border">
              [{timeHorizonLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Returned to members</p>
        </div>
      </div>
    </div>
  );
}
export default ManagerFinanceSecurityDepositsKpis;
