'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the Analytics domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_analytics/layout.tsx -> role-level navigation registry and child route content.
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
  const t = useTranslations('SUPERADMIN_REPORTS');
  const routes = [
    { key: 'analytics_financials', label: t('COPY.NAV_ANALYTICS_FINANCIALS'), href: SUPERADMIN_NAVIGATION_ROUTES.analytics_financials },
    { key: 'analytics_library_growth', label: t('COPY.NAV_ANALYTICS_LIBRARY_GROWTH'), href: SUPERADMIN_NAVIGATION_ROUTES.analytics_library_growth },
    { key: 'analytics_overview', label: t('COPY.NAV_ANALYTICS_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.analytics_overview },
    { key: 'analytics_subscription_mix', label: t('COPY.NAV_ANALYTICS_SUBSCRIPTION_MIX'), href: SUPERADMIN_NAVIGATION_ROUTES.analytics_subscription_mix },
  ] as const;
  return (
    <div className="min-w-0">
      <nav aria-label={t('COPY.NAVIGATION_SECONDARY')} className="mb-5 border-b border-border" data-testid="superadmin_analytics-secondary-navigation">
        <ul className="flex min-w-0 flex-wrap gap-2" role="list">
          {routes.map((route) => {
            const active = pathname === route.href;
            return (
              <li key={route.key} className="min-w-0">
                <Link href={route.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-focus bg-primary-subtle text-primary' : 'border-transparent text-secondary hover:bg-surface-hover hover:text-primary'}`} data-testid={`superadmin_analytics-secondary-link-${route.key}`}>
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
