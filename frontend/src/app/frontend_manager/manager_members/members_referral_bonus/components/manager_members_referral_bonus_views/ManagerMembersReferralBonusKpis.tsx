'use client';

import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';
import { Clock,DollarSign,Users } from 'lucide-react';
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
      id: 'total',
      status: 'All' as const,
      label: tManagerUi('total_referrals'),
      value: records.length,
      icon: Users,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/20 border border-indigo-500/40',
      valueColor: 'text-white',
      badge: timeHorizonLabel || 'All Time',
      badgeStyle: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
      subtext: 'All referral records',
      stroke: '#818cf8',
      unselectedBg: 'border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 via-[#141842]/70 to-indigo-900/40 hover:border-indigo-400/60 shadow-lg shadow-indigo-950/30',
      activeBorder: 'border-2 border-indigo-400 shadow-xl shadow-indigo-500/40 bg-gradient-to-br from-indigo-950/90 via-[#191d52] to-indigo-900/70',
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
      iconBg: 'bg-amber-500/20 border border-amber-500/40',
      valueColor: pendingCount > 0 ? 'text-amber-400' : 'text-white',
      badge: `${pendingCount} Pending`,
      badgeStyle: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
      subtext: 'Needs manager review',
      stroke: '#fbbf24',
      unselectedBg: 'border-amber-500/30 bg-gradient-to-br from-amber-950/60 via-[#261708]/70 to-amber-900/40 hover:border-amber-400/60 shadow-lg shadow-amber-950/30',
      activeBorder: 'border-2 border-amber-400 shadow-xl shadow-amber-500/40 bg-gradient-to-br from-amber-950/90 via-[#36210b] to-amber-900/70',
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
      iconBg: 'bg-emerald-500/20 border border-emerald-500/40',
      valueColor: 'text-emerald-400',
      badge: `${creditedCount} Credited`,
      badgeStyle: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
      subtext: 'Successfully disbursed',
      stroke: '#34d399',
      unselectedBg: 'border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-[#0a241b]/70 to-emerald-900/40 hover:border-emerald-400/60 shadow-lg shadow-emerald-950/30',
      activeBorder: 'border-2 border-emerald-400 shadow-xl shadow-emerald-500/40 bg-gradient-to-br from-emerald-950/90 via-[#0e3326] to-emerald-900/70',
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
            className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 text-left transition-all duration-300 cursor-pointer ${
              isSelected
                ? `${kpi.activeBorder} scale-[1.01] -translate-y-0.5 z-10 opacity-100 shadow-xl`
                : `${kpi.unselectedBg} opacity-85 hover:opacity-100 hover:scale-[1.01]`
            }`}
            title={`Filter by: ${kpi.label}`}
          >
            {/* Top glowing accent bar when selected */}
            {isSelected && (
              <div className={`absolute top-0 left-0 right-0 h-1 ${kpi.activeTopBar}`} />
            )}

            {/* Decorative Sparkline */}
            <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
              <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke={kpi.stroke} strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <div className="flex items-center justify-between gap-2 min-w-0 relative z-10">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`text-xs font-semibold uppercase tracking-wider truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {kpi.label}
                </span>
                {isSelected && (
                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0 ${kpi.activeTag}`}>
                    Active
                  </span>
                )}
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs shrink-0 transition-transform group-hover:scale-110 ${kpi.iconBg} ${kpi.iconColor}`}>
                <kpi.icon size={18} />
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  suppressHydrationWarning
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${kpi.valueColor}`}
                >
                  {kpi.value}
                </span>
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${kpi.badgeStyle}`}>
                  {kpi.badge}
                </span>
              </div>
              <p className={`mt-1 text-xs truncate ${isSelected ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
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
