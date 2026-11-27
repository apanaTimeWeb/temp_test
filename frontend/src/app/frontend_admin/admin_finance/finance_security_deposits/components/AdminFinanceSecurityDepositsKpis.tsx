'use client';

import type { AdminFinanceSecurityDeposit } from '@/app/frontend_admin/admin_finance/finance_security_deposits/types/AdminFinanceSecurityDepositsTypes';
import { AlertCircle, ArrowDownLeft, IndianRupee, ShieldCheck } from 'lucide-react';

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
      chipCls: 'bg-primary-subtle text-primary border-border-focus',
      icon: ShieldCheck,
      iconCls: 'bg-primary-subtle text-primary border-border-focus',
      stroke: 'var(--chart-primary)',
      valColor: 'text-text-primary',
    },
    {
      title: 'Forfeited Deposits',
      subtitle: `Policy violation retentions (₹${forfeitedAmount.toLocaleString('en-IN')})`,
      value: `${forfeitedCount} Accounts`,
      chip: 'Forfeited',
      chipCls: 'bg-warning-bg text-warning-text border-warning',
      icon: AlertCircle,
      iconCls: 'bg-warning-bg text-warning-text border-warning',
      stroke: 'var(--chart-warning)',
      valColor: 'text-warning-text',
    },
    {
      title: 'Damage & Deductions',
      subtitle: 'Key lost, chair/desk damage recovery',
      value: `₹${totalDeductions.toLocaleString('en-IN')}`,
      chip: 'Penalty Recovery',
      chipCls: 'bg-danger-bg text-danger-text border-danger',
      icon: IndianRupee,
      iconCls: 'bg-danger-bg text-danger-text border-danger',
      stroke: 'var(--chart-danger)',
      valColor: 'text-danger-text',
    },
    {
      title: 'Disbursed Refunds',
      subtitle: `Returned to checkout students (₹${refundedAmount.toLocaleString('en-IN')})`,
      value: `${refundedCount} Returned`,
      chip: 'Disbursed',
      chipCls: 'bg-success-bg text-success-text border-success',
      icon: ArrowDownLeft,
      iconCls: 'bg-success-bg text-success-text border-success',
      stroke: 'var(--chart-success)',
      valColor: 'text-success-text',
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
          stroke,
          valColor,
        }) => (
          <div
            key={title}
            className="group relative overflow-hidden p-5 rounded-2xl border border-border bg-card shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01] flex flex-col justify-between"
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
                  className={`p-2.5 rounded-xl border motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${iconCls}`}
                >
                  <Icon size={18} aria-hidden="true" />
                </div>
                <span
                  className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${chipCls}`}
                >
                  {chip}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  {title}
                </p>
                <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${valColor}`}>
                  {value}
                </h3>
                <p className="text-[11px] text-text-secondary mt-1">{subtitle}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
export default AdminFinanceSecurityDepositsKpis;
