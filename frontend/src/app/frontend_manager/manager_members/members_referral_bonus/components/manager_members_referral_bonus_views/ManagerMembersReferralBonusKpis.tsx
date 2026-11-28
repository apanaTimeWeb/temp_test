'use client';

import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';
import { formatReferralInr } from '@/app/frontend_manager/manager_members/members_referral_bonus/utils/ManagerMembersReferralBonusRenewalAdjustment';
import { Clock, DollarSign, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface ManagerMembersReferralBonusKpisProps {
  records: ReferralRow[];
  timeHorizonLabel?: string;
  statusFilter: 'All' | 'Credited' | 'Pending' | 'Adjusted in Renewal';
  onSelectStatusFilter: (status: 'All' | 'Credited' | 'Pending' | 'Adjusted in Renewal') => void;
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
    .filter((r) => r.status === 'Credited' || r.status === 'Adjusted in Renewal')
    .reduce((sum, r) => sum + parseBonusAmount(r.bonus), 0);

  const pendingCount = records.filter((r) => r.status === 'Pending').length;
  const creditedCount = records.filter((r) => r.status === 'Credited' || r.status === 'Adjusted in Renewal').length;

  const kpis = [
    {
      id: 'total', status: 'All' as const, label: tManagerUi('total_referrals'), value: records.length, icon: Users,
      iconColor: 'text-indigo-400', iconBg: 'bg-indigo-500/20 border border-indigo-500/40', valueColor: 'text-white',
      badge: timeHorizonLabel || 'All Time', badgeStyle: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
      subtext: 'All referral records', strokeClass: 'text-indigo-400',
      unselectedBg: 'mref-kpi-indigo', activeBorder: 'mref-kpi-indigo-active',
      activeTopBar: 'mref-bar-indigo', activeTag: 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/50',
    },
    {
      id: 'pending', status: 'Pending' as const, label: tManagerUi('pending_approvals'), value: pendingCount, icon: Clock,
      iconColor: 'text-amber-400', iconBg: 'bg-amber-500/20 border border-amber-500/40',
      valueColor: pendingCount > 0 ? 'text-amber-400' : 'text-white',
      badge: `${pendingCount} Pending`, badgeStyle: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
      subtext: 'Needs manager review', strokeClass: 'text-amber-400',
      unselectedBg: 'mref-kpi-amber', activeBorder: 'mref-kpi-amber-active',
      activeTopBar: 'mref-bar-amber', activeTag: 'bg-amber-500/30 text-amber-300 border border-amber-400/50',
    },
    {
      id: 'credited', status: 'Credited' as const, label: tManagerUi('total_bonus_distributed'),
      value: formatReferralInr(totalBonusAmount), icon: DollarSign,
      iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/20 border border-emerald-500/40', valueColor: 'text-emerald-400',
      badge: `${creditedCount} Credited`, badgeStyle: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
      subtext: 'Successfully disbursed', strokeClass: 'text-emerald-400',
      unselectedBg: 'mref-kpi-emerald', activeBorder: 'mref-kpi-emerald-active',
      activeTopBar: 'mref-bar-emerald', activeTag: 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50',
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
            onClick={() => onSelectStatusFilter(kpi.status === 'All' ? 'All' : isSelected ? 'All' : kpi.status)}
            aria-pressed={isSelected}
            className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 flex flex-col justify-between gap-3 text-left motion-safe:transition-all motion-safe:duration-slow cursor-pointer ${
              isSelected ? `${kpi.activeBorder} scale-[1.01] -translate-y-0.5 z-10 opacity-100 shadow-xl` : `${kpi.unselectedBg} opacity-85 hover:opacity-100 hover:scale-[1.01]`
            }`}
            title={`Filter by: ${kpi.label}`}
          >
            {isSelected && <div className={`absolute top-0 left-0 right-0 h-1 ${kpi.activeTopBar}`} />}
            <svg aria-hidden="true" className={`absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none ${kpi.strokeClass}`} viewBox="0 0 150 45">
              <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="flex items-center justify-between gap-2 min-w-0 relative z-10">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`text-xs font-semibold uppercase tracking-wider truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>{kpi.label}</span>
                {isSelected && <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0 ${kpi.activeTag}`}>Active</span>}
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs shrink-0 motion-safe:transition-transform group-hover:scale-110 ${kpi.iconBg} ${kpi.iconColor}`}>
                <kpi.icon size={18} />
              </div>
            </div>
            <div className="relative z-10">
              <div className="flex items-baseline justify-between gap-2">
                <span suppressHydrationWarning className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${kpi.valueColor}`}>{kpi.value}</span>
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${kpi.badgeStyle}`}>{kpi.badge}</span>
              </div>
              <p className={`mt-1 text-xs truncate ${isSelected ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>{kpi.subtext}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ManagerMembersReferralBonusKpis;
