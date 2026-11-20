'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the System domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_system/layout.tsx -> role-level navigation registry and child route content.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Activity, ScrollText, Download, DatabaseBackup } from 'lucide-react';

const TAB_ICONS = {
  system_health_overview: Activity,
  audit_logs: ScrollText,
  backup_overview: DatabaseBackup,
  data_export_jobs: Download,
} as const;

export default function DomainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('SUPERADMIN_AUDIT_LOGS');
  const routes = [
    { key: 'system_health_overview', label: t('COPY.NAV_SYSTEM_HEALTH_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.system_health_overview },
    { key: 'audit_logs', label: t('COPY.NAV_AUDIT_LOGS'), href: SUPERADMIN_NAVIGATION_ROUTES.audit_logs },
    { key: 'backup_overview', label: t('COPY.NAV_BACKUP_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.backup_overview },
    { key: 'data_export_jobs', label: t('COPY.NAV_DATA_EXPORT_JOBS'), href: SUPERADMIN_NAVIGATION_ROUTES.data_export_jobs },
  ] as const;
  return (
    <div className="w-full max-w-full min-w-0 px-2 sm:px-4 lg:px-6 py-2">
      <nav aria-label={t('COPY.NAVIGATION_SECONDARY')} className="mb-6 border-b border-border/80" data-testid="superadmin_system-secondary-navigation">
        <ul className="flex min-w-0 flex-wrap gap-2" role="list">
          {routes.map((route) => {
            const active =
              route.key === 'backup_overview'
                ? pathname.includes('/backup_') || pathname.includes('/system_backup')
                : pathname === route.href || pathname.startsWith(route.href + '/');
            const Icon = TAB_ICONS[route.key as keyof typeof TAB_ICONS] ?? Activity;
            return (
              <li key={route.key} className="min-w-0">
                <Link
                  href={route.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-t-xl border-b-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer ${
                    active
                      ? 'border-indigo-400 bg-indigo-500/10 text-indigo-300 shadow-xs'
                      : 'border-transparent text-slate-400 hover:bg-surface-hover hover:text-slate-200'
                  }`}
                  data-testid={`superadmin_system-secondary-link-${route.key}`}
                >
                  <Icon size={15} className={active ? 'text-indigo-400' : 'text-slate-400'} />
                  <span>{route.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="w-full max-w-full min-w-0">{children}</div>
    </div>
  );
}
