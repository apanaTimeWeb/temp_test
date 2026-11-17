'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the Users domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_users/layout.tsx -> role-level navigation registry and child route content.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Users, LayoutDashboard, ShieldCheck } from 'lucide-react';

const TAB_ICONS = {
  users_directory: Users,
  users_overview: LayoutDashboard,
  users_roles_permissions: ShieldCheck,
} as const;

/**
 * Performs the domain layout operation within layout.tsx; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: { children: ReactNode; }.
 */
export default function DomainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('SUPERADMIN_USERS');
  const routes = [
    { key: 'users_directory', label: t('COPY.NAV_USERS_DIRECTORY'), href: SUPERADMIN_NAVIGATION_ROUTES.users_directory },
    { key: 'users_overview', label: t('COPY.NAV_USERS_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.users_overview },
    { key: 'users_roles_permissions', label: t('COPY.NAV_USERS_ROLES_PERMISSIONS'), href: SUPERADMIN_NAVIGATION_ROUTES.users_roles_permissions },
  ] as const;

  return (
    <div className="w-full max-w-full min-w-0 px-2 sm:px-4 lg:px-6 py-2">
      <nav aria-label={t('COPY.NAVIGATION_SECONDARY')} className="mb-6 border-b border-border/80" data-testid="superadmin_users-secondary-navigation">
        <ul className="flex min-w-0 flex-wrap gap-2" role="list">
          {routes.map((route) => {
            const active = pathname === route.href || pathname.startsWith(route.href + '/');
            const Icon = TAB_ICONS[route.key as keyof typeof TAB_ICONS] ?? Users;

            return (
              <li key={route.key} className="min-w-0">
                <Link
                  href={route.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-t-xl border-b-2 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer ${
                    active
                      ? 'border-indigo-400 bg-indigo-500/10 text-indigo-300 shadow-xs'
                      : 'border-transparent text-slate-400 hover:bg-surface-hover hover:text-slate-200'
                  }`}
                  data-testid={`superadmin_users-secondary-link-${route.key}`}
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
