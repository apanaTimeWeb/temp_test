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
    activeColor: 'text-pink-400',
    border: 'border-pink-400',
    bg: 'bg-pink-500/10',
  },
  {
    key: 'data_backup_operations',
    label: 'Backup Schedules & Policies',
    href: SUPERADMIN_NAVIGATION_ROUTES.data_backup_operations,
    icon: CalendarClock,
    activeColor: 'text-amber-400',
    border: 'border-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    key: 'data_restore_operations',
    label: 'Restore & Sandbox Testing',
    href: SUPERADMIN_NAVIGATION_ROUTES.data_restore_operations,
    icon: RotateCcw,
    activeColor: 'text-emerald-400',
    border: 'border-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    key: 'data_export_management',
    label: 'Tenant & Branch Export',
    href: SUPERADMIN_NAVIGATION_ROUTES.data_export_management,
    icon: ArrowUpFromLine,
    activeColor: 'text-sky-400',
    border: 'border-sky-400',
    bg: 'bg-sky-500/10',
  },
  {
    key: 'data_import_migration',
    label: 'Data Import & Migration',
    href: SUPERADMIN_NAVIGATION_ROUTES.data_import_migration,
    icon: ArrowDownToLine,
    activeColor: 'text-violet-400',
    border: 'border-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    key: 'data_archive_retention',
    label: 'Archive & Retention Rules',
    href: SUPERADMIN_NAVIGATION_ROUTES.data_archive_retention,
    icon: Archive,
    activeColor: 'text-rose-400',
    border: 'border-rose-400',
    bg: 'bg-rose-500/10',
  },
] as const;

export default function SuperadminDataLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full max-w-full min-w-0 px-3 sm:px-6 lg:px-8 py-4">
      {/* ── Sub-navigation Tab Bar ── */}
      <nav
        aria-label="Data, Backup and Disaster Recovery Navigation"
        className="mb-6 border-b border-border/80 overflow-x-auto scrollbar-none"
        data-testid="superadmin_data-secondary-navigation"
      >
        <ul className="flex min-w-max flex-nowrap sm:flex-wrap gap-2 pb-px" role="list">
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
                  className={`inline-flex min-h-10 items-center gap-2 rounded-t-xl border-b-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 cursor-pointer ${
                    active
                      ? `${tab.border} ${tab.bg} ${tab.activeColor} shadow-xs font-bold`
                      : 'border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  }`}
                  data-testid={`superadmin_data-secondary-link-${tab.key}`}
                >
                  <Icon size={16} className={active ? tab.activeColor : 'text-muted-foreground'} />
                  <span>{tab.label}</span>
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
