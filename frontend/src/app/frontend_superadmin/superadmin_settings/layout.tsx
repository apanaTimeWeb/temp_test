'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the Settings domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_settings/layout.tsx -> role-level navigation registry and child route content.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Sliders, Palette } from 'lucide-react';

const TAB_CONFIG = {
  settings_general: { icon: Sliders, activeColor: 'text-amber-400', border: 'border-amber-400', bg: 'bg-amber-500/10' },
  settings_branding: { icon: Palette, activeColor: 'text-purple-400', border: 'border-purple-400', bg: 'bg-purple-500/10' },
} as const;

export default function DomainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const routes = [
    { key: 'settings_general', label: 'Platform Rules & Defaults', href: SUPERADMIN_NAVIGATION_ROUTES.settings_general },
    { key: 'settings_branding', label: 'Branding & White-label', href: SUPERADMIN_NAVIGATION_ROUTES.settings_branding },
  ] as const;

  return (
    <div className="w-full max-w-full min-w-0 px-3 sm:px-6 lg:px-8 py-4">
      <nav aria-label="Global Settings Navigation" className="mb-8 border-b border-border/80" data-testid="superadmin_settings-secondary-navigation">
        <ul className="flex min-w-0 flex-wrap gap-2" role="list">
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
                  className={`inline-flex min-h-10 items-center gap-2 rounded-t-xl border-b-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer ${
                    active
                      ? `${cfg.border} ${cfg.bg} ${cfg.activeColor} shadow-xs font-bold`
                      : 'border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  }`}
                  data-testid={`superadmin_settings-secondary-link-${route.key}`}
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
