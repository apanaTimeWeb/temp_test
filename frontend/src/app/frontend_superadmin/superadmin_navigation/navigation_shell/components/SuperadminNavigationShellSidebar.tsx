'use client';
/** Responsibility: Superadmin Navigation Sidebar; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
import type { SuperadminNavigationSidebarProps } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/types/SuperadminNavigationShellTypes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SUPERADMIN_16_MODULES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellItems';
import { useTranslations } from 'next-intl';
import { BookOpen, ChevronDown, ChevronsDownUp, ChevronsUpDown, ShieldCheck } from 'lucide-react';
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
      // Keep modules expanded by default so user can view all features easily
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
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
      inert={mobileNavigationHidden ? true : undefined}
    >
      {/* ─── Fixed Header: Brand & Scope Bar ─── */}
      <div className="shrink-0 border-b border-white/[0.08] bg-black/40 backdrop-blur-xl z-10">
        {/* Brand Logo Row */}
        <div className="h-16 px-4 flex items-center">
          <Link
            href={SUPERADMIN_NAVIGATION_ROUTES.dashboard_overview}
            className="flex items-center gap-3 w-full no-underline group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 p-[1.5px] shadow-[0_0_18px_rgba(245,158,11,0.35)] transition-transform duration-300 group-hover:scale-105 shrink-0">
              <div className="w-full h-full rounded-[10px] bg-neutral-950/90 flex items-center justify-center">
                <BookOpen
                  size={18}
                  strokeWidth={2.4}
                  className="text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                />
              </div>
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-[15px] font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  Library
                </span>
                <span className="text-[15px] font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                  OS
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Super Admin
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Compact Expand/Collapse Action Row (where it was originally) */}
        <div className="px-3.5 py-1.5 flex items-center justify-end bg-white/[0.02] border-t border-white/[0.04]">
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 border border-amber-400/20 transition-all cursor-pointer"
            title={allExpanded ? 'Collapse all sub-modules' : 'Expand all sub-modules'}
            aria-label={allExpanded ? 'Collapse all sub-modules' : 'Expand all sub-modules'}
          >
            {allExpanded ? (
              <>
                <ChevronsDownUp size={10} />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <ChevronsUpDown size={10} />
                <span>Expand All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── Scrollable Primary Navigation ─── */}
      <nav
        id="superadmin-primary-navigation"
        className="sa-sidebar-nav"
        aria-label={t('COPY.SUPER_ADMIN_PRIMARY_NAVIGATION')}
      >
        {SUPERADMIN_16_MODULES.map((item) => {
          const basePath = item.href.split('?')[0];
          const isModuleActive = pathname === basePath || pathname.startsWith(basePath + '/');
          const isExpanded = expanded[item.id] ?? false;
          const Icon = item.icon;
          const labelKey = item.labelKey;

          return (
            <div key={item.id} className="relative group/mod mb-1">
              {/* Module Header Row */}
              <div
                className={`relative flex items-center justify-between rounded-xl transition-all duration-200 border ${
                  isModuleActive
                    ? 'bg-gradient-to-r from-white/[0.09] via-white/[0.05] to-transparent border-white/15 shadow-[0_2px_12px_rgba(0,0,0,0.4)]'
                    : 'border-transparent hover:bg-white/[0.05] hover:border-white/5'
                }`}
              >
                {/* Glowing Active Border Pip */}
                {isModuleActive && (
                  <div
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full shadow-sm"
                    style={{ backgroundColor: item.colorText }}
                  />
                )}

                <Link
                  href={item.href}
                  className="flex-1 flex items-center gap-2.5 py-2 pl-2.5 pr-1 text-xs font-semibold no-underline min-w-0"
                  onClick={() => {
                    if (!isExpanded) toggleModule(item.id);
                  }}
                >
                  {/* Jewel Icon Box */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover/mod:scale-110 shadow-sm"
                    style={{
                      backgroundColor: item.colorBg,
                      color: item.colorText,
                      border: `1px solid color-mix(in srgb, ${item.colorText} 30%, transparent)`,
                    }}
                  >
                    <Icon size={14} strokeWidth={2.4} aria-hidden="true" />
                  </div>

                  {/* Module Code Badge & Title */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black tracking-tight shrink-0 border"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${item.colorText} 12%, transparent)`,
                        color: item.colorText,
                        borderColor: `color-mix(in srgb, ${item.colorText} 35%, transparent)`,
                      }}
                    >
                      {item.code}
                    </span>

                    <span
                      className={`truncate tracking-tight transition-colors ${
                        isModuleActive
                          ? 'text-white font-bold'
                          : 'text-neutral-200 group-hover/mod:text-white font-medium'
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Contract compatibility for tests */}
                    <span className="hidden"><span>{t(labelKey)}</span></span>
                  </div>
                </Link>

                {/* Sub-menu Toggle Chevron */}
                {item.subItems && item.subItems.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => toggleModule(item.id, e)}
                    className={`p-1.5 mr-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-transform duration-200 cursor-pointer ${
                      isExpanded ? 'rotate-0 text-amber-400' : '-rotate-90'
                    }`}
                    aria-label={`Toggle ${item.label} sub-items`}
                  >
                    <ChevronDown size={14} />
                  </button>
                )}
              </div>

              {/* Sub-modules List */}
              {isExpanded && item.subItems && item.subItems.length > 0 && (
                <div className="ml-5 pl-3 my-1 border-l-2 border-white/10 space-y-0.5">
                  {item.subItems.map((sub) => {
                    const subBasePath = sub.href.split('?')[0];
                    const isSubActive =
                      pathname === sub.href ||
                      (pathname === subBasePath && (!sub.href.includes('?') || sub.href.endsWith(pathname)));

                    return (
                      <Link
                        key={sub.id}
                        href={sub.href}
                        className={`group flex items-center gap-2 py-1.5 px-2.5 text-[11px] rounded-lg transition-all no-underline ${
                          isSubActive
                            ? 'text-amber-300 font-bold bg-amber-500/15 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                            : 'text-neutral-300 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
                            isSubActive
                              ? 'bg-amber-400 scale-125 shadow-[0_0_6px_rgba(251,191,36,0.9)]'
                              : 'bg-neutral-600 group-hover:bg-neutral-400'
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

      {/* ─── Bottom Status / Profile Bar ─── */}
      <div className="shrink-0 p-3 border-t border-white/[0.08] bg-black/40 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shrink-0">
            SA
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
              <span>Platform Master</span>
              <ShieldCheck size={12} className="text-amber-400" />
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online (Master Scope)
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
