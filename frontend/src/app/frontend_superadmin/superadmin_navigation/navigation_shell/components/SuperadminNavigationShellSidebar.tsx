'use client';
/** Responsibility: Superadmin Navigation Sidebar; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
import type { SuperadminNavigationSidebarProps } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/types/SuperadminNavigationShellTypes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SUPERADMIN_NAVIGATION_NAV_ITEMS } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellItems';
import { useTranslations } from 'next-intl';
import { BookOpen } from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

export default function SuperadminNavigationShellSidebar({ open = false, mobileViewport = false }: SuperadminNavigationSidebarProps) {
  const t = useTranslations('SUPERADMIN_SHELL');
  const pathname = usePathname();
  const mobileNavigationHidden = mobileViewport && !open;

  const colors = [
    { bg: 'rgba(250,204,21,0.15)',  color: '#facc15' },
    { bg: 'rgba(96,165,250,0.15)',   color: '#60a5fa' },
    { bg: 'rgba(74,222,128,0.15)',   color: '#4ade80' },
    { bg: 'rgba(248,113,113,0.15)',  color: '#f87171' },
    { bg: 'rgba(192,132,252,0.15)',  color: '#c084fc' },
    { bg: 'rgba(251,191,36,0.15)',   color: '#fbbf24' },
    { bg: 'rgba(52,211,153,0.15)',   color: '#34d399' },
    { bg: 'rgba(248,113,113,0.18)',  color: '#ef4444' },
    { bg: 'rgba(56,189,248,0.15)',   color: '#38bdf8' },
    { bg: 'rgba(163,230,53,0.15)',   color: '#a3e635' },
    { bg: 'rgba(249,115,22,0.15)',   color: '#fb923c' },
    { bg: 'rgba(34,211,238,0.15)',   color: '#22d3ee' },
    { bg: 'rgba(167,139,250,0.15)',  color: '#a78bfa' },
  ];

  return (
    <aside
      id="superadmin-navigation-sidebar"
      className={`sa-sidebar ${open ? 'sa-sidebar--open' : ''}`}
      aria-hidden={mobileNavigationHidden || undefined}
      inert={mobileNavigationHidden || undefined}
    >
      {/* ─── Top Brand Logo Row ─── */}
      <div className="sa-sidebar-logo-row">
        <Link
          href={SUPERADMIN_NAVIGATION_ROUTES.dashboard_overview}
          className="sa-sidebar-brand-link admin-sidebar-brand-link flex items-center gap-2.5 w-full no-underline group"
        >
          <span className="sa-sidebar-brand-mark shrink-0" aria-hidden="true">
            <BookOpen
              size={18}
              strokeWidth={2.2}
              className="text-white transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
            />
          </span>
          <div className="flex flex-col min-w-0 justify-center">
            <span className="sa-sidebar-brand-name flex items-center leading-none text-white font-extrabold tracking-tight text-sm sm:text-[15px]">
              <span>Library</span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-black ml-0.5">
                OS
              </span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 leading-none mt-1">
              Super Admin
            </span>
          </div>
        </Link>
      </div>

      <div className="sa-sidebar-divider my-2" />

      {/* ─── Primary Navigation Links ─── */}
      <nav
        id="superadmin-primary-navigation"
        className="sa-sidebar-nav flex-1 space-y-1 overflow-y-auto px-1"
        aria-label={t('COPY.SUPER_ADMIN_PRIMARY_NAVIGATION')}
      >
        {SUPERADMIN_NAVIGATION_NAV_ITEMS.map(({ href, icon: Icon, labelKey }, idx) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          const c = colors[idx % colors.length];

          return (
            <Link
              key={href}
              href={href}
              className={`sa-nav-link ${isActive ? 'sa-nav-link--active' : ''}`}
              style={{ '--nav-icon-bg': c.bg, '--nav-icon-color': c.color } as React.CSSProperties}
            >
              <span className="sa-nav-icon-box">
                <Icon size={16} aria-hidden="true" />
              </span>
              <span>{t(labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
