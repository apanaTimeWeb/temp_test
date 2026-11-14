'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the Security domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_security/layout.tsx -> role-level navigation registry and child route content.
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
  const t = useTranslations('SUPERADMIN_SECURITY');
  const routes = [
    { key: 'security_active_sessions', label: t('COPY.NAV_SECURITY_ACTIVE_SESSIONS'), href: SUPERADMIN_NAVIGATION_ROUTES.security_active_sessions },
    { key: 'security_api_keys', label: t('COPY.NAV_SECURITY_API_KEYS'), href: SUPERADMIN_NAVIGATION_ROUTES.security_api_keys },
    { key: 'security_ip_firewall', label: t('COPY.NAV_SECURITY_IP_FIREWALL'), href: SUPERADMIN_NAVIGATION_ROUTES.security_ip_firewall },
    { key: 'security_login_security', label: t('COPY.NAV_SECURITY_LOGIN_SECURITY'), href: SUPERADMIN_NAVIGATION_ROUTES.security_login_security },
    { key: 'security_mfa', label: t('COPY.NAV_SECURITY_MFA'), href: SUPERADMIN_NAVIGATION_ROUTES.security_mfa },
    { key: 'security_overview', label: t('COPY.NAV_SECURITY_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.security_overview },
    { key: 'security_password_policy', label: t('COPY.NAV_SECURITY_PASSWORD_POLICY'), href: SUPERADMIN_NAVIGATION_ROUTES.security_password_policy },
    { key: 'security_threats', label: t('COPY.NAV_SECURITY_THREATS'), href: SUPERADMIN_NAVIGATION_ROUTES.security_threats },
    { key: 'security_user_sessions', label: t('COPY.NAV_SECURITY_USER_SESSIONS'), href: SUPERADMIN_NAVIGATION_ROUTES.security_user_sessions },
  ] as const;
  return (
    <div className="min-w-0">
      <nav aria-label={t('COPY.NAVIGATION_SECONDARY')} className="mb-5 border-b border-border" data-testid="superadmin_security-secondary-navigation">
        <ul className="flex min-w-0 flex-wrap gap-2" role="list">
          {routes.map((route) => {
            const active = pathname === route.href;
            return (
              <li key={route.key} className="min-w-0">
                <Link href={route.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-focus bg-primary-subtle text-primary' : 'border-transparent text-secondary hover:bg-surface-hover hover:text-primary'}`} data-testid={`superadmin_security-secondary-link-${route.key}`}>
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
