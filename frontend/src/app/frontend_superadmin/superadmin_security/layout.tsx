'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the Security domain with secondary tab bar; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_security/layout.tsx -> role-level navigation registry and child route content.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  ShieldCheck,
  Lock,
  Fingerprint,
  KeyRound,
  Network,
  Globe,
  Key,
  ShieldAlert,
} from 'lucide-react';

const TAB_CONFIG = {
  security_overview: { icon: ShieldCheck, activeColor: 'text-emerald-400', border: 'border-emerald-400', bg: 'bg-emerald-500/10' },
  security_login_security: { icon: Lock, activeColor: 'text-amber-400', border: 'border-amber-400', bg: 'bg-amber-500/10' },
  security_mfa: { icon: Fingerprint, activeColor: 'text-indigo-400', border: 'border-indigo-400', bg: 'bg-indigo-500/10' },
  security_password_policy: { icon: KeyRound, activeColor: 'text-sky-400', border: 'border-sky-400', bg: 'bg-sky-500/10' },
  security_active_sessions: { icon: Network, activeColor: 'text-purple-400', border: 'border-purple-400', bg: 'bg-purple-500/10' },
  security_ip_firewall: { icon: Globe, activeColor: 'text-rose-400', border: 'border-rose-400', bg: 'bg-rose-500/10' },
  security_api_keys: { icon: Key, activeColor: 'text-cyan-400', border: 'border-cyan-400', bg: 'bg-cyan-500/10' },
  security_threats: { icon: ShieldAlert, activeColor: 'text-red-400', border: 'border-red-400', bg: 'bg-red-500/10' },
} as const;

/**
 * Domain layout for the SuperAdmin Security domain.
 * Mounts standard secondary navigation top-tabs across security capabilities.
 */
export default function DomainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const routes = [
    { key: 'security_overview', label: 'Security & Posture', href: SUPERADMIN_NAVIGATION_ROUTES.security_overview },
    { key: 'security_login_security', label: 'Login & Brute Force', href: SUPERADMIN_NAVIGATION_ROUTES.security_login_security },
    { key: 'security_mfa', label: '2FA & MFA Protection', href: SUPERADMIN_NAVIGATION_ROUTES.security_mfa },
    { key: 'security_password_policy', label: 'Password Policy & Hashing', href: SUPERADMIN_NAVIGATION_ROUTES.security_password_policy },
    { key: 'security_active_sessions', label: 'Active Sessions & Devices', href: SUPERADMIN_NAVIGATION_ROUTES.security_active_sessions },
    { key: 'security_ip_firewall', label: 'IP Firewall & Geofencing', href: SUPERADMIN_NAVIGATION_ROUTES.security_ip_firewall },
    { key: 'security_api_keys', label: 'API Keys & Secrets', href: SUPERADMIN_NAVIGATION_ROUTES.security_api_keys },
    { key: 'security_threats', label: 'Threat Radar & Anomalies', href: SUPERADMIN_NAVIGATION_ROUTES.security_threats },
  ] as const;

  return (
    <div className="w-full max-w-full min-w-0 p-0">
      <nav aria-label="Security Center Navigation" className="mb-6 border-b border-border/80 overflow-x-auto no-scrollbar" data-testid="superadmin_security-secondary-navigation">
        <ul className="flex min-w-max flex-nowrap sm:flex-wrap gap-2" role="list">
          {routes.map((route) => {
            const active =
              pathname === route.href ||
              pathname.startsWith(route.href + '/');
            const cfg = TAB_CONFIG[route.key as keyof typeof TAB_CONFIG] ?? TAB_CONFIG.security_overview;
            const Icon = cfg.icon;
            return (
              <li key={route.key} className="min-w-0">
                <Link
                  href={route.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-t-xl border-b-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer ${
                    active
                      ? `${cfg.border} ${cfg.bg} ${cfg.activeColor} shadow-xs font-bold`
                      : 'border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  }`}
                  data-testid={`superadmin_security-secondary-link-${route.key}`}
                >
                  <Icon size={16} className={active ? cfg.activeColor : 'text-muted-foreground'} />
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
