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

export function AdminFinanceReferralsKpiCards({
  totalReferrals,
  totalBonus,
  topReferrer,
  timeRangeLabel,
  activeCount,
}: AdminFinanceReferralsKpiCardsProps) {
  const t = useTranslations('ADMIN_FINANCE_REFERRALS');

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
      {/* Total Referrals */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-linear-to-br from-cyan-500/10 via-card to-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {t('TOTAL_REFERRALS')}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
            <Users size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{totalReferrals}</p>
        <p className="mt-1 text-xs text-text-secondary">{timeRangeLabel} conversions</p>
      </div>

      {/* Total Bonus */}
      <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-linear-to-br from-emerald-500/10 via-card to-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {t('TOTAL_BONUS')}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <IndianRupee size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
          {formatAdminFinanceCurrency(totalBonus)}
        </p>
        <p className="mt-1 text-xs text-text-secondary">Earned by advocates</p>
      </div>

      {/* Top Referrer */}
      <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 via-card to-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {t('TOP_REFERRER')}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Trophy size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-xl font-bold tracking-tight text-text-primary truncate">{topReferrer.name}</p>
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
          {t('LISTED_REFERRALS', { count: topReferrer.referredNames.length })}
        </p>
      </div>

      {/* Active Referrers */}
      <div className="relative overflow-hidden rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/10 via-card to-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Advocates
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
            <TrendingUp size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono">
          {activeCount ?? 6}
        </p>
        <p className="mt-1 text-xs text-text-secondary">Enrolled promoters</p>
      </div>
    </div>
  );
}

export default AdminFinanceReferralsKpiCards;
