'use client';
// Responsibility: AdminFinanceReferralsKpiCards component owned by admin_finance_referrals.

import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_referrals/utils/AdminFinanceReferralsFormat';
import { IndianRupee, TrendingUp, Trophy, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminFinanceReferralsKpiCardsProps {
  totalReferrals: number;
  totalBonus: number;
  topReferrer: { name: string; referredNames: string[] };
  timeRangeLabel: string;
  activeCount?: number;
}

const generateSparkline = (title: string) =>
  `M0,32 Q${15 + (title.length % 10)},${42 - (title.length % 15)} ${35 + (title.length % 10)},22 T${75 + (title.length % 10)},26 T${115 + (title.length % 10)},12 T150,6`;

export function AdminFinanceReferralsKpiCards({
  totalReferrals,
  totalBonus,
  topReferrer,
  timeRangeLabel,
  activeCount,
}: AdminFinanceReferralsKpiCardsProps) {
  const t = useTranslations('ADMIN_FINANCE_REFERRALS');

  const cards = [
    {
      label: t('TOTAL_REFERRALS'),
      value: totalReferrals,
      footer: `${timeRangeLabel} conversions`,
      footerCls: 'text-text-secondary',
      valueCls: 'text-text-primary',
      iconCls: 'border-info bg-info-bg text-info-text',
      stroke: 'var(--chart-info)',
      path: generateSparkline('referrals'),
      Icon: Users,
    },
    {
      label: t('TOTAL_BONUS'),
      value: formatAdminFinanceCurrency(totalBonus),
      footer: 'Earned by advocates',
      footerCls: 'text-text-secondary',
      valueCls: 'text-success-text',
      iconCls: 'border-success bg-success-bg text-success-text',
      stroke: 'var(--chart-success)',
      path: generateSparkline('bonus'),
      Icon: IndianRupee,
    },
    {
      label: t('TOP_REFERRER'),
      value: topReferrer.name,
      footer: t('LISTED_REFERRALS', { count: topReferrer.referredNames.length }),
      footerCls: 'text-warning-text font-semibold',
      valueCls: 'text-text-primary text-xl sm:text-2xl',
      iconCls: 'border-warning bg-warning-bg text-warning-text',
      stroke: 'var(--chart-warning)',
      path: generateSparkline('top_referrer'),
      Icon: Trophy,
    },
    {
      label: 'Advocates',
      value: activeCount ?? 6,
      footer: 'Enrolled promoters',
      footerCls: 'text-text-secondary',
      valueCls: 'text-text-primary',
      iconCls: 'border-border-focus bg-primary-subtle text-primary',
      stroke: 'var(--chart-primary)',
      path: generateSparkline('advocates'),
      Icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.Icon;
        return (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]"
          >
            <svg
              aria-hidden="true"
              className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity pointer-events-none"
              viewBox="0 0 150 45"
            >
              <path d={card.path} fill="none" stroke={card.stroke} strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="relative z-10 flex items-start justify-between gap-3">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary truncate">{card.label}</span>
              <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${card.iconCls}`}>
                <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
              </div>
            </div>
            <p className={`relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight tabular-nums truncate ${card.valueCls}`}>
              {card.value}
            </p>
            <p className={`relative z-10 mt-3.5 pt-2.5 border-t border-border text-xs font-medium truncate ${card.footerCls}`}>
              {card.footer}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default AdminFinanceReferralsKpiCards;
