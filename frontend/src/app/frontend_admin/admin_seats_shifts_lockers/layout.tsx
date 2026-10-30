'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

const SUBMODULE_NAVIGATION = [
  { href: ADMIN_ROUTES.SEATS_MATRIX, labelKey: 'SUBMODULE_SEATS_MATRIX' },
  { href: ADMIN_ROUTES.SEATS_MANAGEMENT, labelKey: 'SUBMODULE_SEATS_MANAGEMENT' },
  { href: ADMIN_ROUTES.SEATS_HISTORY, labelKey: 'SUBMODULE_SEATS_HISTORY' },
  { href: ADMIN_ROUTES.SEATS_MAINTENANCE, labelKey: 'SUBMODULE_SEATS_MAINTENANCE' },
  { href: ADMIN_ROUTES.SHIFTS_MANAGEMENT, labelKey: 'SUBMODULE_SHIFTS_MANAGEMENT' },
  { href: ADMIN_ROUTES.SHIFTS_MIGRATION, labelKey: 'SUBMODULE_SHIFTS_MIGRATION' },
  { href: ADMIN_ROUTES.SHIFTS_GAP, labelKey: 'SUBMODULE_SHIFTS_GAP' },
  { href: ADMIN_ROUTES.ALLOCATIONS, labelKey: 'SUBMODULE_ALLOCATIONS' },
  { href: ADMIN_ROUTES.LOCKERS_MANAGEMENT, labelKey: 'SUBMODULE_LOCKERS_MANAGEMENT' },
  { href: ADMIN_ROUTES.LOCKERS_MATRIX, labelKey: 'SUBMODULE_LOCKERS_MATRIX' }
] as const;

export default function AdminSeatsShiftsLockersLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('ADMIN_NAVIGATION');
  return (
    <div className="min-w-0 space-y-4">
      <nav aria-label={t('DOMAIN_SEATS_SHIFTS_LOCKERS_SECTIONS')} className="border-b border-border bg-card">
        <div className="flex min-w-0 gap-1 overflow-x-auto px-3 py-2">
          {SUBMODULE_NAVIGATION.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-primary bg-primary-subtle text-primary' : 'border-border text-text-secondary hover:bg-surface-hover hover:text-primary'}`}>
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
