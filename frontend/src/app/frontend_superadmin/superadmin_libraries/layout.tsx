'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the Libraries domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_libraries/layout.tsx -> role-level navigation registry and child route content.
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
  const t = useTranslations('SUPERADMIN_SETUP_WIZARD');
  const routes = [
    { key: 'libraries_onboarding_setup', label: t('COPY.NAV_LIBRARIES_ONBOARDING_SETUP'), href: SUPERADMIN_NAVIGATION_ROUTES.libraries_onboarding_setup },
    { key: 'libraries_overview', label: t('COPY.NAV_LIBRARIES_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.libraries_overview },
    { key: 'libraries_profile_configuration', label: t('COPY.NAV_LIBRARIES_PROFILE_CONFIGURATION'), href: SUPERADMIN_NAVIGATION_ROUTES.libraries_profile_configuration },
  ] as const;
  return (
    <div className="min-w-0">
      <nav aria-label={t('COPY.NAVIGATION_SECONDARY')} className="mb-5 border-b border-border" data-testid="superadmin_libraries-secondary-navigation">
        <ul className="flex min-w-0 flex-wrap gap-2" role="list">
          {routes.map((route) => {
            const active = pathname === route.href;
            return (
              <li key={route.key} className="min-w-0">
                <Link href={route.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-focus bg-primary-subtle text-primary' : 'border-transparent text-secondary hover:bg-surface-hover hover:text-primary'}`} data-testid={`superadmin_libraries-secondary-link-${route.key}`}>
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
