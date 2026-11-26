'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the Settings domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_settings/layout.tsx -> role-level navigation registry and child route content.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Sliders, Palette } from 'lucide-react';

const TAB_CONFIG = {
  settings_general: {
    icon: Sliders,
    activeClasses: 'bg-gradient-to-r from-amber-500/20 to-amber-600/15 border-amber-500/40 text-amber-300 shadow-md shadow-amber-950/30',
    iconColor: 'text-amber-400',
  },
  settings_branding: {
    icon: Palette,
    activeClasses: 'bg-gradient-to-r from-purple-500/20 to-purple-600/15 border-purple-500/40 text-purple-300 shadow-md shadow-purple-950/30',
    iconColor: 'text-purple-400',
  },
} as const;

export default function DomainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const routes = [
    { key: 'settings_general', label: 'Platform Rules & Defaults', href: SUPERADMIN_NAVIGATION_ROUTES.settings_general },
    { key: 'settings_branding', label: 'Branding & White-label', href: SUPERADMIN_NAVIGATION_ROUTES.settings_branding },
  ] as const;

  return (
    <div className="w-full max-w-full min-w-0 p-0">
      {/* Segmented Floating Cyber Navigation Bar matching Superadmin Support styling */}
      <nav
        aria-label="Global Settings Navigation"
        className="mb-8"
        data-testid="superadmin_settings-secondary-navigation"
      >
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-indigo-500/25 backdrop-blur-md shadow-lg shadow-black/40">
          <ul className="flex min-w-0 flex-wrap items-center gap-1.5" role="list">
            {routes.map((route) => {
              const active =
                pathname === route.href ||
                pathname.startsWith(route.href + '/') ||
                (route.key === 'settings_general' && pathname.includes('/settings_overview'));
              const cfg = TAB_CONFIG[route.key as keyof typeof TAB_CONFIG] ?? TAB_CONFIG.settings_general;
              const Icon = cfg.icon;
              return (
                <li key={route.key} className="min-w-0">
                  <Link
                    href={route.href}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-4 py-2 text-xs sm:text-sm font-semibold motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer ${
                      active
                        ? `${cfg.activeClasses} font-bold`
                        : 'border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                    data-testid={`superadmin_settings-secondary-link-${route.key}`}
                  >
                    <Icon size={16} className={active ? cfg.iconColor : 'text-slate-400'} />
                    <span>{route.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      <div className="w-full max-w-full min-w-0">{children}</div>
    </div>
  );
}
