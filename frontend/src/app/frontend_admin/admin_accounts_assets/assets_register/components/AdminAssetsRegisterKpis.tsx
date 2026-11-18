// components/AdminAssetsRegisterKpis.tsx
'use client';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, IndianRupee, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { AdminAssetRecord } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import {
  formatPaiseToRupees,
  isExpiringSoon,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';

interface Props {
  records: AdminAssetRecord[];
}

const generateSparkline = (seed: number) => {
  return `M0,32 Q${15 + (seed % 10)},${40 - (seed % 12)} ${35 + (seed % 10)},20 T${75 + (seed % 10)},24 T${115 + (seed % 10)},10 T150,4`;
};

export function AdminAssetsRegisterKpis({ records }: Props) {
  const t = useTranslations('ADMIN_ASSETS_REGISTER.KPIS');

  const { totalCount, totalCapEx, amcCount, expiringCount } = useMemo(() => {
    let capex = 0;
    let amc = 0;
    let expiring = 0;

    for (const r of records) {
      capex += r.purchaseCost;
      if (r.amcStatus === 'ACTIVE_AMC') {
        amc++;
      }
      if (isExpiringSoon(r.warrantyExpiryDate)) {
        expiring++;
      }
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
      borderBg: 'border-indigo-500/30 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#141842]/80 shadow-indigo-950/30 hover:border-indigo-500/60',
      iconBox: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
      stroke: '#818cf8',
      badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    },
    {
      title: t('TOTAL_CAPEX'),
      value: formatPaiseToRupees(totalCapEx),
      subtitle: t('SUB_CAPEX'),
      badge: 'Cumulative CapEx',
      icon: IndianRupee,
      borderBg: 'border-emerald-500/30 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30 hover:border-emerald-500/60',
      iconBox: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      stroke: '#34d399',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    {
      title: t('ACTIVE_AMC'),
      value: String(amcCount),
      subtitle: t('SUB_AMC'),
      badge: `${totalCount > 0 ? Math.round((amcCount / totalCount) * 100) : 0}% AMC Coverage`,
      icon: ShieldCheck,
      borderBg: 'border-cyan-500/30 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30 hover:border-cyan-500/60',
      iconBox: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
      stroke: '#22d3ee',
      badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    },
    {
      title: t('WARRANTY_ALERTS'),
      value: String(expiringCount),
      subtitle: t('SUB_WARRANTY'),
      badge: expiringCount > 0 ? 'Expiring in 30 Days' : 'All Warranties Valid',
      icon: AlertTriangle,
      borderBg: expiringCount > 0
        ? 'border-amber-500/30 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30 hover:border-amber-500/60'
        : 'border-slate-800 bg-gradient-to-br from-[#111827]/95 via-[#111827]/90 to-[#1f2937]/80 shadow-slate-950/30 hover:border-slate-700',
      iconBox: expiringCount > 0 ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-slate-700/30 border-slate-700/50 text-slate-400',
      stroke: expiringCount > 0 ? '#fbbf24' : '#94a3b8',
      badgeClass: expiringCount > 0 ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-slate-700/30 text-slate-300 border-slate-700/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`group relative overflow-hidden min-w-0 rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${card.borderBg}`}
          >
            {/* Decorative SVG Sparkline */}
            <svg
              aria-hidden="true"
              className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity pointer-events-none"
              viewBox="0 0 150 45"
            >
              <path d={generateSparkline(i * 7 + 3)} fill="none" stroke={card.stroke} strokeWidth="3" strokeLinecap="round" />
            </svg>

            <div className="relative z-10 flex items-start justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">
                {card.title}
              </span>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-xs transition-transform duration-200 group-hover:scale-110 ${card.iconBox}`}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="relative z-10 mt-3 sm:mt-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tabular-nums text-white tracking-tight">
                {card.value}
              </div>

              <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2.5 border-t border-white/10 text-xs">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.badgeClass}`}>
                  {card.badge}
                </span>
                <span className="text-xs font-medium text-slate-400 truncate">
                  {card.subtitle}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AdminAssetsRegisterKpis;
