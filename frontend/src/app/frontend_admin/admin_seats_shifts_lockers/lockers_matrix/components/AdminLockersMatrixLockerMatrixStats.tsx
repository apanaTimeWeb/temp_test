// RESPONSIBILITY: AdminLockersLockerMatrixStats component owned by admin_lockers; responsibility folder: admin_lockers_components_cards.
'use client';

import { useTranslations } from 'next-intl';
import type { AdminLockersLockerMatrixStatsProps } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';


export default function AdminLockersLockerMatrixStats(stats: AdminLockersLockerMatrixStatsProps) {
  const t = useTranslations('ADMIN_LOCKERS');
  const cards = [
    ['totalCapacity', stats.total, 'font-medium text-primary', 'font-medium text-primary'],
    ['available', stats.free, 'text-success-text', 'text-success-text'],
    ['statusOccupied', stats.occupied, 'text-danger-text', 'text-danger-text'],
    ['serviceRequired', stats.maintenance, 'text-warning-text', 'text-warning-text'],
    ['unknownStatus', stats.unknown, 'font-medium text-primary', 'font-medium text-primary'],
  ] as const;

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label={t('lockerMatrixTitle')}>
      {cards.map(([label, value, border, valueClass]) => (
        <div key={label} className={`min-w-0 rounded-xl border border-border bg-card p-4 shadow-card ${border}`}>
          <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t(label)}</span>
          <span className={`min-w-0 rounded-xl border border-border bg-card p-4 ${valueClass}`}>{value}</span>
        </div>
      ))}
    </section>
  );
}


export type { AdminLockersLockerMatrixStatsProps };
