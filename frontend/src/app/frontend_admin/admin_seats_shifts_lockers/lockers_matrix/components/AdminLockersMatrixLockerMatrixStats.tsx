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
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      glow: 'bg-cyan-500/10 text-cyan-400',
      badge: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400',
      trend: 'Total Units',
    },
    {
      label: t('available'),
      value: stats.free,
      icon: CheckCircle,
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      glow: 'bg-emerald-500/10 text-emerald-400',
      badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
      trend: 'Ready to Assign',
    },
    {
      label: t('statusOccupied'),
      value: stats.occupied,
      icon: UserCheck,
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      glow: 'bg-indigo-500/10 text-indigo-400',
      badge: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400',
      trend: 'Assigned',
    },
    {
      label: t('serviceRequired'),
      value: stats.maintenance,
      icon: Wrench,
      border: 'border-rose-500/20 hover:border-rose-500/40',
      glow: 'bg-rose-500/10 text-rose-400',
      badge: 'border-rose-500/20 bg-rose-500/10 text-rose-400',
      trend: 'Maintenance',
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label={t('lockerMatrixTitle')}>
      {cards.map((c) => (
        <div
          key={c.label}
          className={`relative overflow-hidden rounded-2xl border ${c.border} bg-slate-900/60 backdrop-blur-xl p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{c.label}</span>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.glow}`}>
              <c.icon size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-white">{c.value}</div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${c.badge}`}>
              {c.trend}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}


export type { AdminLockersLockerMatrixStatsProps };
