'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Users, Clock, DollarSign } from 'lucide-react';
import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';

export interface ManagerMembersReferralBonusKpisProps {
  records: ReferralRow[];
  timeHorizonLabel: string;
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <button
        type="button"
        onClick={() => onSelectStatusFilter('All')}
        className={`mgr-card p-4 text-left cursor-pointer transition-all ${
          statusFilter === 'All' ? 'ring-2 ring-primary border-primary' : 'hover:border-primary'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-secondary font-medium">{tManagerUi('total_referrals')}</span>
          <div className="w-8 h-8 rounded-lg bg-primary-subtle text-primary flex items-center justify-center">
            <Users size={16} />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <p className="text-2xl font-bold text-primary">{records.length}</p>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
            [{timeHorizonLabel}]
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelectStatusFilter('Pending')}
        className={`mgr-card p-4 text-left cursor-pointer transition-all ${
          statusFilter === 'Pending' ? 'ring-2 ring-warning border-warning' : 'hover:border-warning'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-secondary font-medium">{tManagerUi('pending_approvals')}</span>
          <div className="w-8 h-8 rounded-lg bg-warning-bg text-warning border border-border flex items-center justify-center">
            <Clock size={16} />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <p className="text-2xl font-bold text-warning">{pendingCount}</p>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-warning border border-border">
            [{timeHorizonLabel}]
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelectStatusFilter('Credited')}
        className={`mgr-card p-4 text-left cursor-pointer transition-all ${
          statusFilter === 'Credited' ? 'ring-2 ring-success border-success' : 'hover:border-success'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-secondary font-medium">{tManagerUi('total_bonus_distributed')}</span>
          <div className="w-8 h-8 rounded-lg bg-success-bg text-success border border-border flex items-center justify-center">
            <DollarSign size={16} />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <p className="text-2xl font-bold text-success">₹{totalBonusAmount.toLocaleString('en-IN')}</p>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-success border border-border">
            [{timeHorizonLabel}]
          </span>
        </div>
      </button>
    </div>
  );
}
export default ManagerMembersReferralBonusKpis;

