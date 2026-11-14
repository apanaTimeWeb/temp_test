'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the Settings domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_settings/layout.tsx -> role-level navigation registry and child route content.
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
  const t = useTranslations('SUPERADMIN_PROFILE');
  const routes = [
    { key: 'profile_active_sessions', label: t('COPY.NAV_PROFILE_ACTIVE_SESSIONS'), href: SUPERADMIN_NAVIGATION_ROUTES.profile_active_sessions },
    { key: 'profile_login_history', label: t('COPY.NAV_PROFILE_LOGIN_HISTORY'), href: SUPERADMIN_NAVIGATION_ROUTES.profile_login_history },
    { key: 'profile_overview', label: t('COPY.NAV_PROFILE_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.profile_overview },
    { key: 'profile_security', label: t('COPY.NAV_PROFILE_SECURITY'), href: SUPERADMIN_NAVIGATION_ROUTES.profile_security },
    { key: 'settings_appearance', label: t('COPY.NAV_SETTINGS_APPEARANCE'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_appearance },
    { key: 'settings_branding', label: t('COPY.NAV_SETTINGS_BRANDING'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_branding },
    { key: 'settings_general', label: t('COPY.NAV_SETTINGS_GENERAL'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_general },
    { key: 'settings_integrations', label: t('COPY.NAV_SETTINGS_INTEGRATIONS'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_integrations },
    { key: 'settings_maintenance_mode', label: t('COPY.NAV_SETTINGS_MAINTENANCE_MODE'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_maintenance_mode },
    { key: 'settings_overview', label: t('COPY.NAV_SETTINGS_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_overview },
    { key: 'settings_storage', label: t('COPY.NAV_SETTINGS_STORAGE'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_storage },
  ] as const;
  return (
    <div className="min-w-0">
      <nav aria-label={t('COPY.NAVIGATION_SECONDARY')} className="mb-5 border-b border-border" data-testid="superadmin_settings-secondary-navigation">
        <ul className="flex min-w-0 flex-wrap gap-2" role="list">
          {routes.map((route) => {
            const active = pathname === route.href;
            return (
              <li key={route.key} className="min-w-0">
                <Link href={route.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-focus bg-primary-subtle text-primary' : 'border-transparent text-secondary hover:bg-surface-hover hover:text-primary'}`} data-testid={`superadmin_settings-secondary-link-${route.key}`}>
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
