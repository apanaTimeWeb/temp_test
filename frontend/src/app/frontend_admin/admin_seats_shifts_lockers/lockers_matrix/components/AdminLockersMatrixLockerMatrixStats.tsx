'use client';
// RESPONSIBILITY: AdminLockersLockerMatrixStats component owned by admin_lockers; responsibility folder: admin_lockers_components_cards.

import { useTranslations } from 'next-intl';
import { Lock, CheckCircle, UserCheck, Wrench } from 'lucide-react';
import type { AdminLockersLockerMatrixStatsProps } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';

export default function AdminLockersLockerMatrixStats(stats: AdminLockersLockerMatrixStatsProps) {
  const t = useTranslations('ADMIN_LOCKERS');
  const cards = [
    {
      label: t('totalCapacity'),
      value: stats.total,
      icon: Lock,
      cardBorderBg: 'border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30',
      iconBox: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
      strokeColor: '#22d3ee',
      badgeBg: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-400',
      trend: 'Total Units',
    },
    {
      label: t('available'),
      value: stats.free,
      icon: CheckCircle,
      cardBorderBg: 'border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30',
      iconBox: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      strokeColor: '#34d399',
      badgeBg: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
      trend: 'Ready to Assign',
    },
    {
      label: t('statusOccupied'),
      value: stats.occupied,
      icon: UserCheck,
      cardBorderBg: 'border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-indigo-950/30',
      iconBox: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
      strokeColor: '#818cf8',
      badgeBg: 'border-indigo-500/30 bg-indigo-500/15 text-indigo-400',
      trend: 'Assigned',
    },
    {
      label: t('serviceRequired'),
      value: stats.maintenance,
      icon: Wrench,
      cardBorderBg: 'border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30',
      iconBox: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      strokeColor: '#f87171',
      badgeBg: 'border-rose-500/30 bg-rose-500/15 text-rose-400',
      trend: 'Maintenance',
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label={t('lockerMatrixTitle')}>
      {cards.map((c) => (
        <div
          key={c.label}
          className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${c.cardBorderBg}`}
        >
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={c.strokeColor} strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{c.label}</span>
            <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs ${c.iconBox}`}>
              <c.icon size={18} strokeWidth={2.2} />
            </div>
          </div>
          <div className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">{c.value}</div>
          <div className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 flex items-center gap-1.5">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-xs ${c.badgeBg}`}>
              {c.trend}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}


export type { AdminLockersLockerMatrixStatsProps };
