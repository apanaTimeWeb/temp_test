'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the System domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_system/layout.tsx -> role-level navigation registry and child route content.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';



/**
 * Performs the domain layout operation within layout.tsx; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: { children: ReactNode; }.
 */
export default function DomainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('SUPERADMIN_AUDIT_LOGS');
  const routes = [
    { key: 'audit_logs', label: t('COPY.NAV_AUDIT_LOGS'), href: SUPERADMIN_NAVIGATION_ROUTES.audit_logs },
    { key: 'backup_configuration', label: t('COPY.NAV_BACKUP_CONFIGURATION'), href: SUPERADMIN_NAVIGATION_ROUTES.backup_configuration },
    { key: 'backup_history', label: t('COPY.NAV_BACKUP_HISTORY'), href: SUPERADMIN_NAVIGATION_ROUTES.backup_history },
    { key: 'backup_overview', label: t('COPY.NAV_BACKUP_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.backup_overview },
    { key: 'backup_schedules', label: t('COPY.NAV_BACKUP_SCHEDULES'), href: SUPERADMIN_NAVIGATION_ROUTES.backup_schedules },
    { key: 'data_export_jobs', label: t('COPY.NAV_DATA_EXPORT_JOBS'), href: SUPERADMIN_NAVIGATION_ROUTES.data_export_jobs },
    { key: 'system_health_overview', label: t('COPY.NAV_SYSTEM_HEALTH_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.system_health_overview },
  ] as const;
  return (
    <div className="min-w-0">
      <nav aria-label={t('COPY.NAVIGATION_SECONDARY')} className="mb-5 border-b border-border" data-testid="superadmin_system-secondary-navigation">
        <ul className="flex min-w-0 flex-wrap gap-2" role="list">
          {routes.map((route) => {
            const active = pathname === route.href;
            return (
              <li key={route.key} className="min-w-0">
                <Link href={route.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-focus bg-primary-subtle text-primary' : 'border-transparent text-secondary hover:bg-surface-hover hover:text-primary'}`} data-testid={`superadmin_system-secondary-link-${route.key}`}>
                  {route.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
