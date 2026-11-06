'use client';
// Responsibility: AdminFinanceReferralsKpiCards component owned by admin_finance_referrals.

import { Users, Trophy, IndianRupee } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_referrals/utils/AdminFinanceReferralsFormat';

interface AdminFinanceReferralsKpiCardsProps {
  totalReferrals: number;
  totalBonus: number;
  topReferrer: { name: string; referredNames: string[] };
  timeRangeLabel: string;
}

export function AdminFinanceReferralsKpiCards({
  totalReferrals,
  totalBonus,
  topReferrer,
  timeRangeLabel,
}: AdminFinanceReferralsKpiCardsProps) {
  const t = useTranslations('ADMIN_FINANCE_REFERRALS');

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">
              {t('TOTAL_REFERRALS')}
            </span>
            <span className="inline-flex items-center rounded-full bg-primary-subtle px-2 py-0.5 text-[10px] font-semibold text-primary">
              [{timeRangeLabel}]
            </span>
          </div>
          <Users size={18} strokeWidth={2} className="text-text-secondary" />
        </div>
        <p className="mt-2 text-kpi font-bold text-text-primary">{totalReferrals}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">
              {t('TOTAL_BONUS')}
            </span>
            <span className="inline-flex items-center rounded-full bg-primary-subtle px-2 py-0.5 text-[10px] font-semibold text-primary">
              [{timeRangeLabel}]
            </span>
          </div>
          <IndianRupee size={18} className="text-text-secondary" strokeWidth={2} />
        </div>
        <p className="mt-2 text-kpi font-bold text-text-primary text-success-text">
          {formatAdminFinanceCurrency(totalBonus)}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">
              {t('TOP_REFERRER')}
            </span>
            <span className="inline-flex items-center rounded-full bg-primary-subtle px-2 py-0.5 text-[10px] font-semibold text-primary">
              [{timeRangeLabel}]
            </span>
          </div>
          <Trophy size={18} className="text-warning-text" strokeWidth={2} />
        </div>
        <p className="mt-2 text-kpi font-bold text-text-primary">{topReferrer.name}</p>
        <p className="text-caption text-text-secondary">
          {t('LISTED_REFERRALS', { count: topReferrer.referredNames.length })}
        </p>
      </div>
    </div>
  );
}

export default AdminFinanceReferralsKpiCards;

