'use client';
/**
 * Responsibility: Render the primary navigation and layout boundary for the Superadmin Libraries domain.
 * Provides high-visibility, ultra-premium, vibrant colorful interactive buttons for:
 * 1. Libraries Overview
 * 2. Libraries Onboarding Setup
 * 3. Libraries Profile Configuration
 */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Building2, Rocket, Sliders, ArrowUpRight } from 'lucide-react';

interface LibraryNavRouteConfig {
  key: 'libraries_overview' | 'libraries_onboarding_setup' | 'libraries_profile_configuration';
  labelKey: string;
  badge: string;
  description: string;
  href: string;
  icon: typeof Building2;
  theme: {
    activeCard: string;
    inactiveCard: string;
    activeIconTile: string;
    inactiveIconTile: string;
    activeTitle: string;
    activeBadge: string;
    pulseDot: string;
    glowBorder: string;
  };
}

export default function DomainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('SUPERADMIN_SETUP_WIZARD');

  const routes: LibraryNavRouteConfig[] = [
    {
      key: 'libraries_overview',
      labelKey: 'COPY.NAV_LIBRARIES_OVERVIEW',
      badge: 'Live Directory',
      description: 'Tenants & Metrics',
      href: SUPERADMIN_NAVIGATION_ROUTES.libraries_overview,
      icon: Building2,
      theme: {
        activeCard:
          'border-blue-400/80 bg-gradient-to-br from-blue-950/90 via-slate-900/90 to-indigo-950/80 shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/40',
        inactiveCard:
          'border-slate-800/80 bg-slate-900/60 hover:border-blue-500/40 hover:bg-blue-950/25 hover:shadow-md hover:shadow-blue-500/15',
        activeIconTile:
          'bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 text-white shadow-md shadow-blue-500/40',
        inactiveIconTile:
          'bg-blue-500/15 text-blue-400 border border-blue-500/30 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-cyan-400 group-hover:text-white',
        activeTitle: 'text-white font-extrabold',
        activeBadge: 'bg-blue-500/25 text-blue-200 border-blue-400/40',
        pulseDot: 'bg-cyan-400',
        glowBorder: 'from-blue-500 via-cyan-400 to-indigo-500',
      },
    },
    {
      key: 'libraries_onboarding_setup',
      labelKey: 'COPY.NAV_LIBRARIES_ONBOARDING_SETUP',
      badge: '5-Step Wizard',
      description: 'Branch Launch Flow',
      href: SUPERADMIN_NAVIGATION_ROUTES.libraries_onboarding_setup,
      icon: Rocket,
      theme: {
        activeCard:
          'border-emerald-400/80 bg-gradient-to-br from-emerald-950/90 via-slate-900/90 to-teal-950/80 shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/40',
        inactiveCard:
          'border-slate-800/80 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-emerald-950/25 hover:shadow-md hover:shadow-emerald-500/15',
        activeIconTile:
          'bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-400 text-white shadow-md shadow-emerald-500/40',
        inactiveIconTile:
          'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-emerald-400 group-hover:to-teal-500 group-hover:text-white',
        activeTitle: 'text-white font-extrabold',
        activeBadge: 'bg-emerald-500/25 text-emerald-200 border-emerald-400/40',
        pulseDot: 'bg-emerald-400',
        glowBorder: 'from-emerald-400 via-teal-400 to-amber-400',
      },
    },
    {
      key: 'libraries_profile_configuration',
      labelKey: 'COPY.NAV_LIBRARIES_PROFILE_CONFIGURATION',
      badge: 'Root Config',
      description: 'Identity & Security',
      href: SUPERADMIN_NAVIGATION_ROUTES.libraries_profile_configuration,
      icon: Sliders,
      theme: {
        activeCard:
          'border-purple-400/80 bg-gradient-to-br from-purple-950/90 via-slate-900/90 to-fuchsia-950/80 shadow-lg shadow-purple-500/25 ring-1 ring-purple-400/40',
        inactiveCard:
          'border-slate-800/80 bg-slate-900/60 hover:border-purple-500/40 hover:bg-purple-950/25 hover:shadow-md hover:shadow-purple-500/15',
        activeIconTile:
          'bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 text-white shadow-md shadow-purple-500/40',
        inactiveIconTile:
          'bg-purple-500/15 text-purple-400 border border-purple-500/30 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white',
        activeTitle: 'text-white font-extrabold',
        activeBadge: 'bg-purple-500/25 text-purple-200 border-purple-400/40',
        pulseDot: 'bg-fuchsia-400',
        glowBorder: 'from-purple-500 via-fuchsia-400 to-pink-500',
      },
    },
  ];

  return (
    <div className="w-full max-w-full min-w-0 px-0 sm:px-1 py-1">
      {/* ── Secondary Navigation: High-Impact Colorful Button Cards ── */}
      <nav
        aria-label={t('COPY.NAVIGATION_SECONDARY')}
        className="mb-6"
        data-testid="superadmin_libraries-secondary-navigation"
      >
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 min-w-0" role="list">
          {routes.map((route) => {
            const active = pathname === route.href || pathname.startsWith(route.href + '/');
            const Icon = route.icon;
            const theme = route.theme;

            return (
              <li key={route.key} className="min-w-0">
                <Link
                  href={route.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 active:scale-[0.98] ${
                    active ? theme.activeCard : theme.inactiveCard
                  }`}
                  data-testid={`superadmin_libraries-secondary-link-${route.key}`}
                >
                  {/* Active Top Glowing Accent Line */}
                  {active && (
                    <div
                      className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${theme.glowBorder}`}
                    />
                  )}

                  {/* Top Bar: Icon Tile + Badge + Arrow */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                          active ? theme.activeIconTile : theme.inactiveIconTile
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          active
                            ? theme.activeBadge
                            : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
                        }`}
                      >
                        {active && (
                          <span className={`h-1.5 w-1.5 rounded-full ${theme.pulseDot} animate-pulse`} />
                        )}
                        {route.badge}
                      </span>
                    </div>

                    <ArrowUpRight
                      size={16}
                      className={`transition-all duration-200 ${
                        active
                          ? 'text-white opacity-90 translate-x-0.5 -translate-y-0.5'
                          : 'text-slate-500 opacity-40 group-hover:text-white group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                      }`}
                    />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight transition-colors ${
                        active ? theme.activeTitle : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {t(route.labelKey)}
                    </h3>
                    <p
                      className={`text-xs mt-0.5 transition-colors line-clamp-1 ${
                        active ? 'text-slate-300 font-medium' : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    >
                      {route.description}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="w-full max-w-full min-w-0">{children}</div>
    </div>
  );
}
