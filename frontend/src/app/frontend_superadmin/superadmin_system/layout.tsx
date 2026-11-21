'use client';
// RESPONSIBILITY: Render secondary top tab navigation boundary for Superadmin System Health & Monitoring.
// FLOW: Domain route -> superadmin_system/layout.tsx -> Technical health & monitoring sub-monitors.
// STRICT ALIGNMENT: Sidebar Module 15 ("Server, database, API, queue, error aur uptime monitoring").

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { Activity, Server, Database, Globe, Shield, Rocket } from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

const SYSTEM_HEALTH_TABS = [
  { key: 'all', label: 'All Technical Monitors', tab: 'all', icon: Activity },
  { key: 'server', label: 'Server & Application Status', tab: 'server', icon: Server },
  { key: 'database', label: 'Database & Storage Capacity', tab: 'database', icon: Database },
  { key: 'queues', label: 'API, Webhooks & Queues', tab: 'queues', icon: Globe },
  { key: 'security', label: 'Security Alerts & Maintenance', tab: 'security', icon: Shield },
  { key: 'releases', label: 'Releases & Feature Controls', tab: 'releases', icon: Rocket },
] as const;

function SystemHealthTabNav() {
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'all';

  return (
    <nav
      aria-label="System Health and Monitoring"
      className="mb-6 border-b border-border/80 overflow-x-auto scrollbar-none"
      data-testid="superadmin_system-secondary-navigation"
    >
      <ul className="flex min-w-max flex-nowrap sm:flex-wrap gap-2 pb-px" role="list">
        {SYSTEM_HEALTH_TABS.map((route) => {
          const active = currentTab === route.tab;
          const Icon = route.icon;
          const href =
            route.tab === 'all'
              ? SUPERADMIN_NAVIGATION_ROUTES.system_health_overview
              : `${SUPERADMIN_NAVIGATION_ROUTES.system_health_overview}?tab=${route.tab}`;

          return (
            <li key={route.key} className="min-w-0">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex min-h-10 items-center gap-2 rounded-t-xl border-b-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 cursor-pointer ${
                  active
                    ? 'border-teal-400 bg-teal-500/10 text-teal-300 shadow-xs font-bold'
                    : 'border-transparent text-slate-400 hover:bg-muted/40 hover:text-slate-200'
                }`}
                data-testid={`superadmin_system-secondary-link-${route.key}`}
              >
                <Icon size={15} className={active ? 'text-teal-400' : 'text-slate-400'} />
                <span>{route.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function SystemHealthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-full min-w-0 px-2 sm:px-4 lg:px-6 py-2">
      <Suspense fallback={<div className="h-10 mb-6 border-b border-border/60 animate-pulse bg-muted/20 rounded-t-xl" />}>
        <SystemHealthTabNav />
      </Suspense>
      <div className="w-full max-w-full min-w-0">{children}</div>
    </div>
  );
}
