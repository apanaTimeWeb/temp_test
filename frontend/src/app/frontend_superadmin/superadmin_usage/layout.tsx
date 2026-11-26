'use client';

/**
 * Responsibility: Render the primary navigation shell and secondary tab bar for the Superadmin Usage domain.
 * Secondary Navigation Tabs:
 * 1. Usage Overview & Quotas (/superadmin/superadmin_usage/usage_overview)
 * 2. Branch & Quota Upgrade Requests (/superadmin/superadmin_usage/usage_quota_requests)
 */

import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Gauge, GitBranch, ShieldCheck } from 'lucide-react';

interface UsageNavRouteConfig {
  key: 'usage_overview' | 'usage_quota_requests';
  label: string;
  badge: string;
  description: string;
  href: string;
  icon: typeof Gauge;
  theme: {
    activeCard: string;
    inactiveCard: string;
    activeIconTile: string;
    inactiveIconTile: string;
    activeTitle: string;
    activeBadge: string;
    pulseDot: string;
  };
}

export default function SuperadminUsageLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const routes: UsageNavRouteConfig[] = [
    {
      key: 'usage_overview',
      label: '08.1 Usage & Limit Monitoring',
      badge: '12 Resources Live',
      description: 'Allowed vs Current for Branches, Admins, Storage, Messages & APIs',
      href: SUPERADMIN_NAVIGATION_ROUTES.usage_overview,
      icon: Gauge,
      theme: {
        activeCard:
          'border-sky-500/70 bg-gradient-to-br from-sky-950/80 via-[#0a0d24] to-blue-950/60 shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/30',
        inactiveCard:
          'border-indigo-500/20 bg-[#0a0d24]/70 hover:border-sky-500/40 hover:bg-sky-950/20 hover:shadow-md hover:shadow-sky-500/10',
        activeIconTile:
          'bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-400 text-white shadow-md shadow-sky-500/40',
        inactiveIconTile:
          'bg-sky-500/15 text-sky-400 border border-sky-500/30 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-cyan-400 group-hover:text-white',
        activeTitle: 'text-white font-extrabold',
        activeBadge: 'bg-sky-500/25 text-sky-200 border-sky-400/40',
        pulseDot: 'bg-cyan-400',
      },
    },
    {
      key: 'usage_quota_requests',
      label: '08.2 Quota Upgrade Requests',
      badge: 'Review & Action',
      description: 'SuperAdmin Approval/Rejection for 4th Branch & Quota Block Requests',
      href: SUPERADMIN_NAVIGATION_ROUTES.usage_quota_requests,
      icon: GitBranch,
      theme: {
        activeCard:
          'border-amber-500/70 bg-gradient-to-br from-amber-950/80 via-[#0a0d24] to-yellow-950/60 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30',
        inactiveCard:
          'border-indigo-500/20 bg-[#0a0d24]/70 hover:border-amber-500/40 hover:bg-amber-950/20 hover:shadow-md hover:shadow-amber-500/10',
        activeIconTile:
          'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 text-white shadow-md shadow-amber-500/40',
        inactiveIconTile:
          'bg-amber-500/15 text-amber-400 border border-amber-500/30 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-orange-500 group-hover:text-white',
        activeTitle: 'text-white font-extrabold',
        activeBadge: 'bg-amber-500/25 text-amber-200 border-amber-400/40',
        pulseDot: 'bg-amber-400',
      },
    },
  ];

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      {/* ── Secondary Navigation Header Tabs ── */}
      <div className="relative rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-xl p-4 sm:p-5 shadow-2xl shadow-indigo-950/40">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-indigo-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-md shadow-sky-500/30 text-white">
              <Gauge className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Usage & Limit Monitoring
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="h-3 w-3" /> Zero Silent Extra Billing Guarantee
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Track 12 core resource quotas across all libraries and manage branch expansion approval requests
              </p>
            </div>
          </div>
        </div>

        {/* ── Sub-module Action Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {routes.map((route) => {
            const isActive = pathname === route.href || pathname?.startsWith(route.href);
            const Icon = route.icon;

            return (
              <Link
                key={route.key}
                href={route.href}
                className={`group relative flex items-center justify-between rounded-xl border p-3.5 motion-safe:transition-all motion-safe:duration-200 ${
                  isActive ? route.theme.activeCard : route.theme.inactiveCard
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform motion-safe:duration-200 ${
                      isActive ? route.theme.activeIconTile : route.theme.inactiveIconTile
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold truncate ${isActive ? route.theme.activeTitle : 'text-slate-200'}`}>
                        {route.label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${
                          isActive ? route.theme.activeBadge : 'border-indigo-500/20 bg-slate-900/80 text-slate-400'
                        }`}
                      >
                        {isActive && <span className={`h-1.5 w-1.5 rounded-full motion-safe:animate-pulse ${route.theme.pulseDot}`} />}
                        {route.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{route.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Main Submodule Content ── */}
      <div className="w-full max-w-full min-w-0">{children}</div>
    </div>
  );
}