'use client';
// Responsibility: AdminFinanceReferralsKpiCards component owned by admin_finance_referrals.

import { Users, Trophy, IndianRupee, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_referrals/utils/AdminFinanceReferralsFormat';

interface AdminFinanceReferralsKpiCardsProps {
  totalReferrals: number;
  totalBonus: number;
  topReferrer: { name: string; referredNames: string[] };
  timeRangeLabel: string;
  activeCount?: number;
}

// Generates decorative SVG sparkline path like Superadmin Dashboard
const generateSparkline = (title: string) => {
  return `M0,32 Q${15 + (title.length % 10)},${42 - (title.length % 15)} ${35 + (title.length % 10)},22 T${75 + (title.length % 10)},26 T${115 + (title.length % 10)},12 T150,6`;
};

export function AdminFinanceReferralsKpiCards({
  totalReferrals,
  totalBonus,
  topReferrer,
  timeRangeLabel,
  activeCount,
}: AdminFinanceReferralsKpiCardsProps) {
  const t = useTranslations('ADMIN_FINANCE_REFERRALS');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* Total Referrals */}
      <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-reduce:transition-none motion-safe:duration-500 pointer-events-none"
          viewBox="0 0 150 45"
        >
          <path d={generateSparkline('referrals')} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <div className="relative z-10 flex items-start justify-between gap-3">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">
            {t('TOTAL_REFERRALS')}
          </span>
          <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <Users size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">
          {totalReferrals}
        </p>
        <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400 truncate">
          {timeRangeLabel} conversions
        </p>
      </div>

      {/* Total Bonus */}
      <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-reduce:transition-none motion-safe:duration-500 pointer-events-none"
          viewBox="0 0 150 45"
        >
          <path d={generateSparkline('bonus')} fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <div className="relative z-10 flex items-start justify-between gap-3">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">
            {t('TOTAL_BONUS')}
          </span>
          <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <IndianRupee size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-400 tabular-nums">
          {formatAdminFinanceCurrency(totalBonus)}
        </p>
        <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400 truncate">
          Earned by advocates
        </p>
      </div>

      {/* Top Referrer */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-reduce:transition-none motion-safe:duration-500 pointer-events-none"
          viewBox="0 0 150 45"
        >
          <path d={generateSparkline('top_referrer')} fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <div className="relative z-10 flex items-start justify-between gap-3">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">
            {t('TOP_REFERRER')}
          </span>
          <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <Trophy size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
          {topReferrer.name}
        </p>
        <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-semibold text-amber-400 truncate">
          {t('LISTED_REFERRALS', { count: topReferrer.referredNames.length })}
        </p>
      </div>

      {/* Active Referrers */}
      <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-indigo-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-reduce:transition-none motion-safe:duration-500 pointer-events-none"
          viewBox="0 0 150 45"
        >
          <path d={generateSparkline('advocates')} fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <div className="relative z-10 flex items-start justify-between gap-3">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">
            Advocates
          </span>
          <div className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <TrendingUp size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">
          {activeCount ?? 6}
        </p>
        <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400 truncate">
          Enrolled promoters
        </p>
      </div>
    </div>
  );
}

export default AdminFinanceReferralsKpiCards;
