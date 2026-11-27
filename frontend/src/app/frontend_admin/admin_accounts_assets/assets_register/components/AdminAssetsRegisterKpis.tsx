// components/AdminAssetsRegisterKpis.tsx
'use client';

import type { AdminAssetRecord } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import {
  formatPaiseToRupees,
  isExpiringSoon,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';
import { AlertTriangle, Building2, IndianRupee, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface Props {
  records: AdminAssetRecord[];
}

const generateSparkline = (seed: number) =>
  `M0,32 Q${15 + (seed % 10)},${40 - (seed % 12)} ${35 + (seed % 10)},20 T${75 + (seed % 10)},24 T${115 + (seed % 10)},10 T150,4`;

export function AdminAssetsRegisterKpis({ records }: Props) {
  const t = useTranslations('ADMIN_ASSETS_REGISTER.KPIS');

  const { totalCount, totalCapEx, amcCount, expiringCount } = useMemo(() => {
    let capex = 0;
    let amc = 0;
    let expiring = 0;

    for (const r of records) {
      capex += r.purchaseCost;
      if (r.amcStatus === 'ACTIVE_AMC') amc++;
      if (isExpiringSoon(r.warrantyExpiryDate)) expiring++;
    }

    return {
      totalCount: records.length,
      totalCapEx: capex,
      amcCount: amc,
      expiringCount: expiring,
    };
  }, [records]);

  const cards = [
    {
      title: t('TOTAL_ASSETS'),
      value: String(totalCount),
      subtitle: t('SUB_ASSETS'),
      badge: `${records.length} Units Active`,
      icon: Building2,
      iconBox: 'bg-primary-subtle border-border-focus text-primary',
      stroke: 'var(--chart-primary)',
      badgeClass: 'bg-primary-subtle text-primary border-border-focus',
    },
    {
      title: t('TOTAL_CAPEX'),
      value: formatPaiseToRupees(totalCapEx),
      subtitle: t('SUB_CAPEX'),
      badge: 'Cumulative CapEx',
      icon: IndianRupee,
      iconBox: 'bg-success-bg border-success text-success-text',
      stroke: 'var(--chart-success)',
      badgeClass: 'bg-success-bg text-success-text border-success',
    },
    {
      title: t('ACTIVE_AMC'),
      value: String(amcCount),
      subtitle: t('SUB_AMC'),
      badge: `${totalCount > 0 ? Math.round((amcCount / totalCount) * 100) : 0}% AMC Coverage`,
      icon: ShieldCheck,
      iconBox: 'bg-info-bg border-info text-info-text',
      stroke: 'var(--chart-info)',
      badgeClass: 'bg-info-bg text-info-text border-info',
    },
    {
      title: t('WARRANTY_ALERTS'),
      value: String(expiringCount),
      subtitle: t('SUB_WARRANTY'),
      badge: expiringCount > 0 ? 'Expiring in 30 Days' : 'All Warranties Valid',
      icon: AlertTriangle,
      iconBox: expiringCount > 0
        ? 'bg-warning-bg border-warning text-warning-text'
        : 'bg-surface-highlight border-border text-text-secondary',
      stroke: expiringCount > 0 ? 'var(--chart-warning)' : 'var(--chart-info)',
      badgeClass: expiringCount > 0
        ? 'bg-warning-bg text-warning-text border-warning'
        : 'bg-surface-highlight text-text-secondary border-border',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="group relative overflow-hidden min-w-0 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]"
          >
            <svg
              aria-hidden="true"
              className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity pointer-events-none"
              viewBox="0 0 150 45"
            >
              <path d={generateSparkline(i * 7 + 3)} fill="none" stroke={card.stroke} strokeWidth="3" strokeLinecap="round" />
            </svg>

            <div className="relative z-10 flex items-start justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary truncate">
                {card.title}
              </span>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-card motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:scale-110 ${card.iconBox}`}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="relative z-10 mt-3 sm:mt-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tabular-nums text-text-primary tracking-tight">
                {card.value}
              </div>

              <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2.5 border-t border-border text-xs">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.badgeClass}`}>
                  {card.badge}
                </span>
                <span className="text-xs font-medium text-text-secondary truncate">{card.subtitle}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AdminAssetsRegisterKpis;
