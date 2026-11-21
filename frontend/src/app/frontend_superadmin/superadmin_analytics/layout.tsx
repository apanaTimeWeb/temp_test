'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Building2, Receipt, Gauge, ShieldCheck } from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

// RESPONSIBILITY: Render secondary top tab navigation boundary for Superadmin Reports & Analytics domain with Cyber-Luxury styling.
// FLOW: Domain route -> superadmin_analytics/layout.tsx -> role-level navigation and autonomous sub-module views.

const TABS = [
  {
    key: 'platform_reports',
    label: 'Platform Reports',
    href: SUPERADMIN_NAVIGATION_ROUTES.analytics_platform_reports,
    icon: Building2,
    activeColor: 'text-sky-300',
    border: 'border-sky-500/50',
    bg: 'bg-sky-500/15',
    glow: 'shadow-sky-500/20',
  },
  {
    key: 'billing_reports',
    label: 'Billing Reports',
    href: SUPERADMIN_NAVIGATION_ROUTES.analytics_billing_reports,
    icon: Receipt,
    activeColor: 'text-amber-300',
    border: 'border-amber-500/50',
    bg: 'bg-amber-500/15',
    glow: 'shadow-amber-500/20',
  },
  {
    key: 'usage_reports',
    label: 'Usage Reports',
    href: SUPERADMIN_NAVIGATION_ROUTES.analytics_usage_reports,
    icon: Gauge,
    activeColor: 'text-emerald-300',
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-500/15',
    glow: 'shadow-emerald-500/20',
  },
  {
    key: 'security_reports',
    label: 'Security Reports',
    href: SUPERADMIN_NAVIGATION_ROUTES.analytics_security_reports,
    icon: ShieldCheck,
    activeColor: 'text-rose-300',
    border: 'border-rose-500/50',
    bg: 'bg-rose-500/15',
    glow: 'shadow-rose-500/20',
  },
] as const;

export default function SuperadminAnalyticsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full max-w-full min-w-0 p-0 space-y-6">
      {/* ── Sub-navigation Tab Bar ── */}
      <nav
        aria-label="Reports and Analytics Navigation"
        className="relative overflow-hidden rounded-2xl bg-[#0a0d24]/90 border border-indigo-500/25 p-1.5 sm:p-2 shadow-xl backdrop-blur-md"
        data-testid="superadmin_analytics-secondary-navigation"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-500/10 blur-xl" />
        <ul className="flex min-w-max items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none relative z-10" role="list">
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
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer ${
                    active
                      ? `${tab.border} ${tab.bg} ${tab.activeColor} ${tab.glow} border shadow-md font-bold`
                      : 'border border-transparent text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                  data-testid={`superadmin_analytics-secondary-link-${tab.key}`}
                >
                  <Icon size={16} className={active ? tab.activeColor : 'text-slate-400'} />
                  <span>{tab.label}</span>
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
