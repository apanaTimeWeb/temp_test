'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Building2, Receipt, Gauge, ShieldCheck } from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

// RESPONSIBILITY: Render secondary top tab navigation boundary for Superadmin Reports & Analytics domain.
// FLOW: Domain route -> superadmin_analytics/layout.tsx -> role-level navigation and autonomous sub-module views.

const TABS = [
  {
    key: 'platform_reports',
    label: 'Platform Reports',
    href: SUPERADMIN_NAVIGATION_ROUTES.analytics_platform_reports,
    icon: Building2,
    activeColor: 'text-sky-400',
    border: 'border-sky-400',
    bg: 'bg-sky-500/10',
  },
  {
    key: 'billing_reports',
    label: 'Billing Reports',
    href: SUPERADMIN_NAVIGATION_ROUTES.analytics_billing_reports,
    icon: Receipt,
    activeColor: 'text-amber-400',
    border: 'border-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    key: 'usage_reports',
    label: 'Usage Reports',
    href: SUPERADMIN_NAVIGATION_ROUTES.analytics_usage_reports,
    icon: Gauge,
    activeColor: 'text-emerald-400',
    border: 'border-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    key: 'security_reports',
    label: 'Security Reports',
    href: SUPERADMIN_NAVIGATION_ROUTES.analytics_security_reports,
    icon: ShieldCheck,
    activeColor: 'text-rose-400',
    border: 'border-rose-400',
    bg: 'bg-rose-500/10',
  },
] as const;

export default function SuperadminAnalyticsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full max-w-full min-w-0 px-3 sm:px-6 lg:px-8 py-4">
      {/* ── Sub-navigation Tab Bar ── */}
      <nav
        aria-label="Reports and Analytics Navigation"
        className="mb-6 border-b border-border/80 overflow-x-auto scrollbar-none"
        data-testid="superadmin_analytics-secondary-navigation"
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
                  className={`inline-flex min-h-10 items-center gap-2 rounded-t-xl border-b-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer ${
                    active
                      ? `${tab.border} ${tab.bg} ${tab.activeColor} shadow-xs font-bold`
                      : 'border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  }`}
                  data-testid={`superadmin_analytics-secondary-link-${tab.key}`}
                >
                  <Icon size={16} className={active ? tab.activeColor : 'text-muted-foreground'} />
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
