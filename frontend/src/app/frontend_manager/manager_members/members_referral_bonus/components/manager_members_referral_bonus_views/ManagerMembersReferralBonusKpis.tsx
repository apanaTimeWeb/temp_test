'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Users, Clock, DollarSign } from 'lucide-react';
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

  const isAllActive = statusFilter === 'All';
  const isPendingActive = statusFilter === 'Pending';
  const isCreditedActive = statusFilter === 'Credited';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
      {/* 1. Total Referrals Card (Filters table to All) */}
      <button
        type="button"
        onClick={() => onSelectStatusFilter('All')}
        aria-pressed={isAllActive}
        className={`mgr-card p-4 sm:p-5 text-left cursor-pointer transition-all rounded-xl relative overflow-hidden ${
          isAllActive
            ? '!border-2 !border-primary bg-primary-subtle/30 shadow-md ring-2 ring-primary/20'
            : 'border border-border bg-card hover:border-primary/50 hover:bg-surface-hover/60'
        }`}
      >
        {/* Prominent top edge color bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 transition-colors ${
            isAllActive ? 'bg-primary' : 'bg-transparent'
          }`}
        />

        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${isAllActive ? 'text-primary' : 'text-secondary'}`}>
            {tManagerUi('total_referrals')}
          </span>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isAllActive
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-primary-subtle text-primary border border-border'
            }`}
          >
            <Users size={20} className={isAllActive ? 'text-on-primary' : 'text-primary'} />
          </div>
        </div>

        <div className="mt-3">
          <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-primary">
            {records.length}
          </p>
        </div>
      </button>

      {/* 2. Pending Approvals Card (Filters table to Pending) */}
      <button
        type="button"
        onClick={() => onSelectStatusFilter(isPendingActive ? 'All' : 'Pending')}
        aria-pressed={isPendingActive}
        className={`mgr-card p-4 sm:p-5 text-left cursor-pointer transition-all rounded-xl relative overflow-hidden ${
          isPendingActive
            ? '!border-2 !border-warning bg-warning-bg/40 shadow-md ring-2 ring-warning/20'
            : 'border border-border bg-card hover:border-warning/50 hover:bg-surface-hover/60'
        }`}
      >
        {/* Prominent top edge color bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 transition-colors ${
            isPendingActive ? 'bg-warning' : 'bg-transparent'
          }`}
        />

        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${isPendingActive ? 'text-warning' : 'text-secondary'}`}>
            {tManagerUi('pending_approvals')}
          </span>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isPendingActive
                ? 'bg-warning text-white shadow-xs'
                : 'bg-warning-bg text-warning border border-border'
            }`}
          >
            <Clock size={20} className={isPendingActive ? 'text-white' : 'text-warning'} />
          </div>
        </div>

        <div className="mt-3">
          <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-warning">
            {pendingCount}
          </p>
        </div>
      </button>

      {/* 3. Total Bonus Distributed Card (Filters table to Credited) */}
      <button
        type="button"
        onClick={() => onSelectStatusFilter(isCreditedActive ? 'All' : 'Credited')}
        aria-pressed={isCreditedActive}
        className={`mgr-card p-4 sm:p-5 text-left cursor-pointer transition-all rounded-xl relative overflow-hidden ${
          isCreditedActive
            ? '!border-2 !border-success bg-success-bg/40 shadow-md ring-2 ring-success/20'
            : 'border border-border bg-card hover:border-success/50 hover:bg-surface-hover/60'
        }`}
      >
        {/* Prominent top edge color bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 transition-colors ${
            isCreditedActive ? 'bg-success' : 'bg-transparent'
          }`}
        />

        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${isCreditedActive ? 'text-success' : 'text-secondary'}`}>
            {tManagerUi('total_bonus_distributed')}
          </span>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isCreditedActive
                ? 'bg-success text-white shadow-xs'
                : 'bg-success-bg text-success border border-border'
            }`}
          >
            <DollarSign size={20} className={isCreditedActive ? 'text-white' : 'text-success'} />
          </div>
        </div>

        <div className="mt-3">
          <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-success">
            ₹{totalBonusAmount.toLocaleString('en-IN')}
          </p>
        </div>
      </button>
    </div>
  );
}

export default ManagerMembersReferralBonusKpis;
