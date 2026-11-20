'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the Security domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_security/layout.tsx -> role-level navigation registry and child route content.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import {
  ShieldCheck,
  Activity,
  ShieldAlert,
  KeyRound,
  Smartphone,
  Flame,
  Lock,
  Key,
} from 'lucide-react';

const TAB_ICONS = {
  security_overview: ShieldCheck,
  security_active_sessions: Activity,
  security_threats: ShieldAlert,
  security_password_policy: KeyRound,
  security_mfa: Smartphone,
  security_ip_firewall: Flame,
  security_login_security: Lock,
  security_api_keys: Key,
} as const;

/**
 * Performs the domain layout operation within layout.tsx; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: { children: ReactNode; }.
 */
export default function DomainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('SUPERADMIN_SECURITY');
  const routes = [
    { key: 'security_overview', label: t('COPY.NAV_SECURITY_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.security_overview },
    { key: 'security_active_sessions', label: t('COPY.NAV_SECURITY_ACTIVE_SESSIONS'), href: SUPERADMIN_NAVIGATION_ROUTES.security_active_sessions },
    { key: 'security_threats', label: t('COPY.NAV_SECURITY_THREATS'), href: SUPERADMIN_NAVIGATION_ROUTES.security_threats },
    { key: 'security_password_policy', label: t('COPY.NAV_SECURITY_PASSWORD_POLICY'), href: SUPERADMIN_NAVIGATION_ROUTES.security_password_policy },
    { key: 'security_mfa', label: t('COPY.NAV_SECURITY_MFA'), href: SUPERADMIN_NAVIGATION_ROUTES.security_mfa },
    { key: 'security_ip_firewall', label: t('COPY.NAV_SECURITY_IP_FIREWALL'), href: SUPERADMIN_NAVIGATION_ROUTES.security_ip_firewall },
    { key: 'security_login_security', label: t('COPY.NAV_SECURITY_LOGIN_SECURITY'), href: SUPERADMIN_NAVIGATION_ROUTES.security_login_security },
    { key: 'security_api_keys', label: t('COPY.NAV_SECURITY_API_KEYS'), href: SUPERADMIN_NAVIGATION_ROUTES.security_api_keys },
  ] as const;

  return (
    <div className="w-full max-w-full min-w-0 px-2 sm:px-4 lg:px-6 py-2">
      <nav aria-label={t('COPY.NAVIGATION_SECONDARY')} className="mb-6 border-b border-border/80" data-testid="superadmin_security-secondary-navigation">
        <ul className="flex min-w-0 flex-wrap gap-2" role="list">
          {routes.map((route) => {
            const active =
              route.key === 'security_active_sessions'
                ? pathname.includes('sessions')
                : pathname === route.href || pathname.startsWith(route.href + '/');
            const Icon = TAB_ICONS[route.key as keyof typeof TAB_ICONS] ?? ShieldCheck;
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
                  data-testid={`superadmin_security-secondary-link-${route.key}`}
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
