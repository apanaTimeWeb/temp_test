'use client';
// RESPONSIBILITY: AdminLockersLockerMatrixStats component owned by admin_lockers; responsibility folder: admin_lockers_components_cards.

import type { AdminLockersLockerMatrixStatsProps } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';
import { CheckCircle, Lock, UserCheck, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AdminLockersLockerMatrixStats(stats: AdminLockersLockerMatrixStatsProps) {
  const t = useTranslations('ADMIN_LOCKERS');
  const cards = [
    {
      label: t('totalCapacity'),
      value: stats.total,
      icon: Lock,
      iconBox: 'bg-info-bg border-info text-info-text',
      strokeColor: 'var(--chart-info)',
      badgeBg: 'border-info bg-info-bg text-info-text',
      trend: 'Total Units',
    },
    {
      label: t('available'),
      value: stats.free,
      icon: CheckCircle,
      iconBox: 'bg-success-bg border-success text-success-text',
      strokeColor: 'var(--chart-success)',
      badgeBg: 'border-success bg-success-bg text-success-text',
      trend: 'Ready to Assign',
    },
    {
      label: t('statusOccupied'),
      value: stats.occupied,
      icon: UserCheck,
      iconBox: 'bg-primary-subtle border-border-focus text-primary',
      strokeColor: 'var(--chart-primary)',
      badgeBg: 'border-border-focus bg-primary-subtle text-primary',
      trend: 'Assigned',
    },
    {
      label: t('serviceRequired'),
      value: stats.maintenance,
      icon: Wrench,
      iconBox: 'bg-danger-bg border-danger text-danger-text',
      strokeColor: 'var(--chart-danger)',
      badgeBg: 'border-danger bg-danger-bg text-danger-text',
      trend: 'Maintenance',
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label={t('lockerMatrixTitle')}>
      {cards.map((c) => (
        <div
          key={c.label}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]"
        >
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={c.strokeColor} strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary truncate">{c.label}</span>
            <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${c.iconBox}`}>
              <c.icon size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
          </div>
          <div className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary tabular-nums">{c.value}</div>
          <div className="relative z-10 mt-3.5 pt-2.5 border-t border-border flex items-center gap-1.5">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-card ${c.badgeBg}`}>
              {c.trend}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}

export type { AdminLockersLockerMatrixStatsProps };
