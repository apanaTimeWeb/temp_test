'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  CalendarClock,
  Gauge,
  RotateCcw,
} from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

// RESPONSIBILITY: Render secondary top tab navigation boundary for Superadmin Data, Backup & Disaster Recovery.
// FLOW: Domain route -> superadmin_data/layout.tsx -> role-level navigation and autonomous sub-module views.

const TABS = [
  {
    key: 'data_overview',
    label: 'DR Cockpit & RPO/RTO',
    href: SUPERADMIN_NAVIGATION_ROUTES.data_overview,
    icon: Gauge,
    color: 'pink',
    activeStyle: 'border-pink-500/50 bg-gradient-to-r from-pink-950/80 via-pink-900/50 to-slate-900 text-white shadow-lg shadow-pink-500/25',
    iconBoxActive: 'bg-pink-500/30 border-pink-400/50 text-pink-300 shadow-sm shadow-pink-500/40',
    iconBoxInactive: 'bg-pink-500/10 text-pink-400/80 group-hover:text-pink-300 group-hover:bg-pink-500/20',
    dotColor: 'bg-pink-400',
  },
  {
    key: 'data_backup_operations',
    label: 'Backup Schedules & Policies',
    href: SUPERADMIN_NAVIGATION_ROUTES.data_backup_operations,
    icon: CalendarClock,
    color: 'amber',
    activeStyle: 'border-amber-500/50 bg-gradient-to-r from-amber-950/80 via-amber-900/50 to-slate-900 text-white shadow-lg shadow-amber-500/25',
    iconBoxActive: 'bg-amber-500/30 border-amber-400/50 text-amber-300 shadow-sm shadow-amber-500/40',
    iconBoxInactive: 'bg-amber-500/10 text-amber-400/80 group-hover:text-amber-300 group-hover:bg-amber-500/20',
    dotColor: 'bg-amber-400',
  },
  {
    key: 'data_restore_operations',
    label: 'Restore & Sandbox Testing',
    href: SUPERADMIN_NAVIGATION_ROUTES.data_restore_operations,
    icon: RotateCcw,
    color: 'emerald',
    activeStyle: 'border-emerald-500/50 bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-slate-900 text-white shadow-lg shadow-emerald-500/25',
    iconBoxActive: 'bg-emerald-500/30 border-emerald-400/50 text-emerald-300 shadow-sm shadow-emerald-500/40',
    iconBoxInactive: 'bg-emerald-500/10 text-emerald-400/80 group-hover:text-emerald-300 group-hover:bg-emerald-500/20',
    dotColor: 'bg-emerald-400',
  },
  {
    key: 'data_export_management',
    label: 'Tenant & Branch Export',
    href: SUPERADMIN_NAVIGATION_ROUTES.data_export_management,
    icon: ArrowUpFromLine,
    color: 'sky',
    activeStyle: 'border-sky-500/50 bg-gradient-to-r from-sky-950/80 via-sky-900/50 to-slate-900 text-white shadow-lg shadow-sky-500/25',
    iconBoxActive: 'bg-sky-500/30 border-sky-400/50 text-sky-300 shadow-sm shadow-sky-500/40',
    iconBoxInactive: 'bg-sky-500/10 text-sky-400/80 group-hover:text-sky-300 group-hover:bg-sky-500/20',
    dotColor: 'bg-sky-400',
  },
  {
    key: 'data_import_migration',
    label: 'Data Import & Migration',
    href: SUPERADMIN_NAVIGATION_ROUTES.data_import_migration,
    icon: ArrowDownToLine,
    color: 'violet',
    activeStyle: 'border-violet-500/50 bg-gradient-to-r from-violet-950/80 via-purple-900/50 to-slate-900 text-white shadow-lg shadow-violet-500/25',
    iconBoxActive: 'bg-violet-500/30 border-violet-400/50 text-violet-300 shadow-sm shadow-violet-500/40',
    iconBoxInactive: 'bg-violet-500/10 text-violet-400/80 group-hover:text-violet-300 group-hover:bg-violet-500/20',
    dotColor: 'bg-violet-400',
  },
  {
    key: 'data_archive_retention',
    label: 'Archive & Retention Rules',
    href: SUPERADMIN_NAVIGATION_ROUTES.data_archive_retention,
    icon: Archive,
    color: 'rose',
    activeStyle: 'border-rose-500/50 bg-gradient-to-r from-rose-950/80 via-rose-900/50 to-slate-900 text-white shadow-lg shadow-rose-500/25',
    iconBoxActive: 'bg-rose-500/30 border-rose-400/50 text-rose-300 shadow-sm shadow-rose-500/40',
    iconBoxInactive: 'bg-rose-500/10 text-rose-400/80 group-hover:text-rose-300 group-hover:bg-rose-500/20',
    dotColor: 'bg-rose-400',
  },
] as const;

export default function SuperadminDataLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full max-w-full min-w-0 px-3 sm:px-6 lg:px-8 py-4">
      {/* ── Sub-navigation Tab Bar ── */}
      <nav
        aria-label="Data, Backup and Disaster Recovery Navigation"
        className="mb-6 p-2 rounded-2xl border border-slate-800/80 bg-slate-950/70 shadow-2xl backdrop-blur-xl overflow-x-auto scrollbar-none"
        data-testid="superadmin_data-secondary-navigation"
      >
        <ul className="flex min-w-max items-center gap-2" role="list">
          {TABS.map((tab) => {
            const active =
              pathname === tab.href ||
              pathname.startsWith(tab.href + '/');
            const Icon = tab.icon;

            return (
              <li key={tab.key} className="min-w-0">
                <Link
                  href={tab.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ease-out cursor-pointer select-none active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                    active
                      ? `${tab.activeStyle}`
                      : 'border-transparent bg-slate-900/40 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 hover:border-slate-700/60 shadow-xs'
                  }`}
                  data-testid={`superadmin_data-secondary-link-${tab.key}`}
                >
                  {/* Colorful Icon Container */}
                  <span
                    className={`p-1.5 rounded-lg border transition-all duration-300 shrink-0 ${
                      active
                        ? tab.iconBoxActive
                        : `${tab.iconBoxInactive} border-transparent group-hover:scale-110`
                    }`}
                  >
                    <Icon size={16} />
                  </span>

                  <span className="tracking-tight whitespace-nowrap">{tab.label}</span>

                  {/* Active Indicator Pulse Glow */}
                  {active && (
                    <span className="relative flex h-2 w-2 ml-1">
                      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${tab.dotColor} opacity-75`} />
                      <span className={`relative inline-flex h-2 w-2 rounded-full ${tab.dotColor}`} />
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Autonomous Sub-Module Content Slot ── */}
      <div className="w-full max-w-full min-w-0">{children}</div>
    </div>
  );
}
