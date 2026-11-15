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
  timeHorizonLabel = 'All Time',
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
  const creditedCount = records.filter((r) => r.status === 'Credited').length;

  const kpis = [
    {
      id: 'total',
      status: 'All' as const,
      label: tManagerUi('total_referrals'),
      value: records.length,
      icon: Users,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/15 border border-indigo-500/30',
      valueColor: 'text-white',
      badge: timeHorizonLabel || 'All Time',
      badgeStyle: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
      subtext: 'All referral records',
      activeBorder: 'border-2 border-indigo-400 shadow-xl shadow-indigo-500/35 bg-gradient-to-br from-indigo-950/90 via-[#0e1138] to-[#0c0f28]',
      activeTopBar: 'bg-indigo-400 shadow-[0_0_14px_rgba(99,102,241,1)]',
      activeTag: 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/50',
    },
    {
      id: 'pending',
      status: 'Pending' as const,
      label: tManagerUi('pending_approvals'),
      value: pendingCount,
      icon: Clock,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15 border border-amber-500/30',
      valueColor: pendingCount > 0 ? 'text-amber-400' : 'text-white',
      badge: `${pendingCount} Pending`,
      badgeStyle: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      subtext: 'Needs manager review',
      activeBorder: 'border-2 border-amber-400 shadow-xl shadow-amber-500/35 bg-gradient-to-br from-amber-950/90 via-[#261708] to-[#0c0f28]',
      activeTopBar: 'bg-amber-400 shadow-[0_0_14px_rgba(245,158,11,1)]',
      activeTag: 'bg-amber-500/30 text-amber-300 border border-amber-400/50',
    },
    {
      id: 'credited',
      status: 'Credited' as const,
      label: tManagerUi('total_bonus_distributed'),
      value: `₹${totalBonusAmount.toLocaleString('en-IN')}`,
      icon: DollarSign,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15 border border-emerald-500/30',
      valueColor: 'text-emerald-400',
      badge: `${creditedCount} Credited`,
      badgeStyle: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      subtext: 'Successfully disbursed',
      activeBorder: 'border-2 border-emerald-400 shadow-xl shadow-emerald-500/35 bg-gradient-to-br from-emerald-950/90 via-[#082218] to-[#0c0f28]',
      activeTopBar: 'bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,1)]',
      activeTag: 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 mb-6 w-full max-w-full min-w-0 px-1 py-1">
      {kpis.map((kpi) => {
        const isSelected = statusFilter === kpi.status;
        return (
          <button
            key={kpi.id}
            type="button"
            data-testid={`manager-referral-kpi-${kpi.id}`}
            onClick={() => {
              if (kpi.status === 'All') {
                onSelectStatusFilter('All');
              } else {
                onSelectStatusFilter(isSelected ? 'All' : kpi.status);
              }
            }}
            aria-pressed={isSelected}
            className={`relative overflow-hidden rounded-xl p-3.5 sm:p-4 flex flex-col justify-between gap-2.5 text-left transition-all cursor-pointer ${
              isSelected
                ? `${kpi.activeBorder} scale-[1.01] -translate-y-0.5 z-10 opacity-100`
                : 'border border-indigo-500/20 bg-[#0c0f28]/95 hover:border-indigo-400/50 hover:bg-[#101438] opacity-80 hover:opacity-100 shadow-md'
            }`}
            title={`Filter by: ${kpi.label}`}
          >
            {/* Top glowing accent bar when selected */}
            {isSelected && (
              <div className={`absolute top-0 left-0 right-0 h-1 ${kpi.activeTopBar}`} />
            )}

            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`text-[11px] font-bold uppercase tracking-wider truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {kpi.label}
                </span>
                {isSelected && (
                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0 ${kpi.activeTag}`}>
                    Active
                  </span>
                )}
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-xs shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}>
                <kpi.icon size={16} />
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-2">
                <span
                  suppressHydrationWarning
                  className={`text-xl sm:text-2xl font-black tracking-tight ${kpi.valueColor}`}
                >
                  {kpi.value}
                </span>
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${kpi.badgeStyle}`}>
                  {kpi.badge}
                </span>
              </div>
              <p className={`mt-1 text-[11px] truncate ${isSelected ? 'text-slate-300 font-medium' : 'text-slate-400'}`}>
                {kpi.subtext}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ManagerMembersReferralBonusKpis;
