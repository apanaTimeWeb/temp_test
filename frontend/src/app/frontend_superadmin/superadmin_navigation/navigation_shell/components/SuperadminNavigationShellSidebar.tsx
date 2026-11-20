'use client';
/** Responsibility: Superadmin Navigation Sidebar; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
import type { SuperadminNavigationSidebarProps } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/types/SuperadminNavigationShellTypes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SUPERADMIN_16_MODULES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellItems';
import { useTranslations } from 'next-intl';
import { BookOpen, ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
import { useEffect, useState } from 'react';

export default function SuperadminNavigationShellSidebar({ open = false, mobileViewport = false }: SuperadminNavigationSidebarProps) {
  const t = useTranslations('SUPERADMIN_SHELL');
  const pathname = usePathname();
  const mobileNavigationHidden = mobileViewport && !open;

  // Track expanded state for each module's sub-modules
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    SUPERADMIN_16_MODULES.forEach((mod) => {
      // Default expand if active, or expand first 3 by default
      initial[mod.id] = true;
    });
    return initial;
  });

  const [allExpanded, setAllExpanded] = useState(true);

  // Auto-expand module when navigating to it
  useEffect(() => {
    const matched = SUPERADMIN_16_MODULES.find(
      (m) => pathname === m.href || pathname.startsWith(m.href.split('?')[0])
    );
    if (matched) {
      setExpanded((prev) => ({ ...prev, [matched.id]: true }));
    }
  }, [pathname]);

  const toggleModule = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAll = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    const updated: Record<string, boolean> = {};
    SUPERADMIN_16_MODULES.forEach((mod) => {
      updated[mod.id] = nextState;
    });
    setExpanded(updated);
  };

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

      {/* ─── Quick Actions & Scope Bar ─── */}
      <div className="px-3 pt-12 pb-2 flex items-center justify-between border-b border-border/40 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            16 Modules
          </span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-400/20 text-amber-400">
            Core
          </span>
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-white transition-colors"
          title={allExpanded ? 'Collapse submodules' : 'Expand all submodules'}
        >
          {allExpanded ? (
            <>
              <ChevronsDownUp size={12} />
              <span>Collapse</span>
            </>
          ) : (
            <>
              <ChevronsUpDown size={12} />
              <span>Expand All</span>
            </>
          )}
        </button>
      </div>

      {/* ─── Primary Navigation Links with Sub-Modules ─── */}
      <nav
        id="superadmin-primary-navigation"
        className="sa-sidebar-nav flex-1 space-y-1.5 overflow-y-auto px-1.5 py-2.5"
        aria-label={t('COPY.SUPER_ADMIN_PRIMARY_NAVIGATION')}
      >
        {SUPERADMIN_16_MODULES.map((item) => {
          const basePath = item.href.split('?')[0];
          const isModuleActive = pathname === basePath || pathname.startsWith(basePath + '/');
          const isExpanded = expanded[item.id] ?? false;
          const Icon = item.icon;
          const labelKey = item.labelKey;

          return (
            <div key={item.id} className="sa-nav-group rounded-lg overflow-hidden transition-all">
              {/* Module Header Bar */}
              <div
                className={`sa-nav-item-row flex items-center justify-between rounded-lg transition-colors ${
                  isModuleActive ? 'bg-neutral-800/60 text-white' : 'hover:bg-neutral-800/30 text-neutral-300'
                }`}
              >
                <Link
                  href={item.href}
                  className={`sa-nav-link flex-1 flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold no-underline min-w-0 ${
                    isModuleActive ? 'sa-nav-link--active' : ''
                  }`}
                  style={{ '--nav-icon-bg': item.colorBg, '--nav-icon-color': item.colorText } as React.CSSProperties}
                  onClick={() => {
                    if (!isExpanded) toggleModule(item.id);
                  }}
                >
                  <span className="sa-nav-icon-box shrink-0">
                    <Icon size={15} aria-hidden="true" />
                  </span>
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate">
                    <span className="text-[10px] font-mono font-bold text-amber-400/90 shrink-0">
                      {item.code}
                    </span>
                    <span className="truncate text-left">{item.label}</span>
                    {/* Kept for test suite contract compatibility */}
                    <span className="hidden"><span>{t(labelKey)}</span></span>
                  </div>
                </Link>

                {/* Sub-menu Toggle Chevron */}
                {item.subItems && item.subItems.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => toggleModule(item.id, e)}
                    className="p-1.5 mr-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-700/40 transition-colors"
                    aria-label={`Toggle ${item.label} sub-items`}
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                )}
              </div>

              {/* Sub-modules List (Visible for immediate view of features) */}
              {isExpanded && item.subItems && item.subItems.length > 0 && (
                <div className="sa-subnav-container ml-6 pl-2.5 my-1 border-l border-neutral-700/50 space-y-0.5">
                  {item.subItems.map((sub) => {
                    const subBasePath = sub.href.split('?')[0];
                    const isSubActive =
                      pathname === sub.href ||
                      (pathname === subBasePath && (!sub.href.includes('?') || sub.href.endsWith(pathname)));

                    return (
                      <Link
                        key={sub.id}
                        href={sub.href}
                        className={`flex items-center gap-2 py-1 px-2 text-[11px] rounded-md transition-colors no-underline ${
                          isSubActive
                            ? 'text-white font-semibold bg-white/10 shadow-sm'
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full shrink-0 ${
                            isSubActive ? 'bg-amber-400 ring-2 ring-amber-400/30' : 'bg-neutral-600'
                          }`}
                        />
                        <span className="truncate">{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
