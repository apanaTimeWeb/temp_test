'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the Settings domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_settings/layout.tsx -> role-level navigation registry and child route content.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import {
  LayoutDashboard, User, History, Shield, Palette, Bookmark,
  Settings, Plug, Wrench, HardDrive,
} from 'lucide-react';

const TAB_ICONS = {
  settings_overview: LayoutDashboard,
  profile_overview: User,
  profile_active_sessions: Shield,
  profile_login_history: History,
  profile_security: Shield,
  settings_appearance: Palette,
  settings_branding: Bookmark,
  settings_general: Settings,
  settings_integrations: Plug,
  settings_maintenance_mode: Wrench,
  settings_storage: HardDrive,
} as const;

export default function DomainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('SUPERADMIN_PROFILE');
  const routes = [
    { key: 'settings_overview', label: t('COPY.NAV_SETTINGS_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_overview },
    { key: 'settings_general', label: t('COPY.NAV_SETTINGS_GENERAL'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_general },
    { key: 'settings_appearance', label: t('COPY.NAV_SETTINGS_APPEARANCE'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_appearance },
    { key: 'settings_branding', label: t('COPY.NAV_SETTINGS_BRANDING'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_branding },
    { key: 'settings_integrations', label: t('COPY.NAV_SETTINGS_INTEGRATIONS'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_integrations },
    { key: 'settings_maintenance_mode', label: t('COPY.NAV_SETTINGS_MAINTENANCE_MODE'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_maintenance_mode },
    { key: 'settings_storage', label: t('COPY.NAV_SETTINGS_STORAGE'), href: SUPERADMIN_NAVIGATION_ROUTES.settings_storage },
    { key: 'profile_overview', label: t('COPY.NAV_PROFILE_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.profile_overview },
  ] as const;
  return (
    <div className="w-full max-w-full min-w-0 px-3 sm:px-6 lg:px-8 py-4">
      <nav aria-label={t('COPY.NAVIGATION_SECONDARY')} className="mb-8 border-b border-border/80" data-testid="superadmin_settings-secondary-navigation">
        <ul className="flex min-w-0 flex-wrap gap-2" role="list">
          {routes.map((route) => {
            const active =
              route.key === 'profile_overview'
                ? pathname.includes('/profile_')
                : pathname === route.href || pathname.startsWith(route.href + '/');
            const Icon = TAB_ICONS[route.key as keyof typeof TAB_ICONS] ?? Settings;
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
                  data-testid={`superadmin_settings-secondary-link-${route.key}`}
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
