'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Users, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';

export interface ManagerMembersReferralBonusKpisProps {
  records: ReferralRow[];
  timeHorizonLabel?: string;
  statusFilter: 'All' | 'Credited' | 'Pending';
  onSelectStatusFilter: (status: 'All' | 'Credited' | 'Pending') => void;
}

export function ManagerMembersReferralBonusKpis({
  records,
  timeHorizonLabel,
  statusFilter,
  onSelectStatusFilter,
}: ManagerMembersReferralBonusKpisProps) {
  const tManagerUi = useTranslations('manager.manager_referral_bonus.ui');

  const parseBonusAmount = (val: string | number) => {
    if (typeof val === 'number') return val;
    const digits = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(digits);
    return isNaN(num) ? 0 : Math.round(num);
  };

  const totalBonusAmount = records
    .filter((r) => r.status === 'Credited')
    .reduce((sum, r) => sum + parseBonusAmount(r.bonus), 0);

  const pendingCount = records.filter((r) => r.status === 'Pending').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
      {/* 1. Total Referrals Card (Filters table to All) */}
      <button
        type="button"
        onClick={() => onSelectStatusFilter('All')}
        aria-pressed={statusFilter === 'All'}
        className={`mgr-card p-4 sm:p-5 text-left cursor-pointer transition-all rounded-xl relative ${
          statusFilter === 'All'
            ? 'border-2 border-primary bg-primary-subtle/40 ring-4 ring-primary/10 shadow-md'
            : 'border border-border bg-card hover:border-primary/50 hover:bg-surface-hover/60'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-secondary font-semibold uppercase tracking-wider">
            {tManagerUi('total_referrals')}
          </span>
          <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary border border-border flex items-center justify-center shrink-0">
            <Users size={20} className="text-primary shrink-0" />
          </div>
        </div>
        <div className="mt-3">
          <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-primary">
            {records.length}
          </p>
        </div>
        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
          {statusFilter === 'All' ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
              <CheckCircle2 size={13} className="text-primary shrink-0" />
              <span>Showing All Records</span>
            </span>
          ) : (
            <span className="text-secondary text-xs hover:text-primary transition-colors">
              Click to show all
            </span>
          )}
          {statusFilter === 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white shadow-xs">
              <CheckCircle2 size={11} className="text-white shrink-0" />
              <span>Active</span>
            </span>
          )}
        </div>
      </button>

      {/* 2. Pending Approvals Card (Filters table to Pending) */}
      <button
        type="button"
        onClick={() => onSelectStatusFilter(statusFilter === 'Pending' ? 'All' : 'Pending')}
        aria-pressed={statusFilter === 'Pending'}
        className={`mgr-card p-4 sm:p-5 text-left cursor-pointer transition-all rounded-xl relative ${
          statusFilter === 'Pending'
            ? 'border-2 border-warning bg-warning-bg/40 ring-4 ring-warning/10 shadow-md'
            : 'border border-border bg-card hover:border-warning/50 hover:bg-surface-hover/60'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-secondary font-semibold uppercase tracking-wider">
            {tManagerUi('pending_approvals')}
          </span>
          <div className="w-10 h-10 rounded-xl bg-warning-bg text-warning border border-border flex items-center justify-center shrink-0">
            <Clock size={20} className="text-warning shrink-0" />
          </div>
        </div>
        <div className="mt-3">
          <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-warning">
            {pendingCount}
          </p>
        </div>
        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
          {statusFilter === 'Pending' ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-warning">
              <CheckCircle2 size={13} className="text-warning shrink-0" />
              <span>Filtered: Pending Only</span>
            </span>
          ) : (
            <span className="text-secondary text-xs hover:text-warning transition-colors">
              Click to filter pending
            </span>
          )}
          {statusFilter === 'Pending' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-warning text-white shadow-xs">
              <CheckCircle2 size={11} className="text-white shrink-0" />
              <span>Active</span>
            </span>
          )}
        </div>
      </button>

      {/* 3. Total Bonus Distributed Card (Filters table to Credited) */}
      <button
        type="button"
        onClick={() => onSelectStatusFilter(statusFilter === 'Credited' ? 'All' : 'Credited')}
        aria-pressed={statusFilter === 'Credited'}
        className={`mgr-card p-4 sm:p-5 text-left cursor-pointer transition-all rounded-xl relative ${
          statusFilter === 'Credited'
            ? 'border-2 border-success bg-success-bg/40 ring-4 ring-success/10 shadow-md'
            : 'border border-border bg-card hover:border-success/50 hover:bg-surface-hover/60'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-secondary font-semibold uppercase tracking-wider">
            {tManagerUi('total_bonus_distributed')}
          </span>
          <div className="w-10 h-10 rounded-xl bg-success-bg text-success border border-border flex items-center justify-center shrink-0">
            <DollarSign size={20} className="text-success shrink-0" />
          </div>
        </div>
        <div className="mt-3">
          <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-success">
            ₹{totalBonusAmount.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
          {statusFilter === 'Credited' ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success">
              <CheckCircle2 size={13} className="text-success shrink-0" />
              <span>Filtered: Credited Only</span>
            </span>
          ) : (
            <span className="text-secondary text-xs hover:text-success transition-colors">
              Click to filter credited
            </span>
          )}
          {statusFilter === 'Credited' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success text-white shadow-xs">
              <CheckCircle2 size={11} className="text-white shrink-0" />
              <span>Active</span>
            </span>
          )}
        </div>
      </button>
    </div>
  );
}

export default ManagerMembersReferralBonusKpis;
