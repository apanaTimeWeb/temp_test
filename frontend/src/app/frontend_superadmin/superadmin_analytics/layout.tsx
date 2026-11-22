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
  },
  {
    key: 'billing_reports',
    label: 'Billing Reports',
    href: SUPERADMIN_NAVIGATION_ROUTES.analytics_billing_reports,
    icon: Receipt,
  },
  {
    key: 'usage_reports',
    label: 'Usage Reports',
    href: SUPERADMIN_NAVIGATION_ROUTES.analytics_usage_reports,
    icon: Gauge,
  },
  {
    key: 'security_reports',
    label: 'Security Reports',
    href: SUPERADMIN_NAVIGATION_ROUTES.analytics_security_reports,
    icon: ShieldCheck,
  },
] as const;

export default function SuperadminAnalyticsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full max-w-full min-w-0 p-0 space-y-6">
      {/* ── Sub-navigation Tab Bar (Pattern A Canonical Top Tab Bar) ── */}
      <nav
        aria-label="Reports and Analytics Navigation"
        className="flex items-center gap-2 border-b border-border pb-px mb-6 overflow-x-auto"
        data-testid="superadmin_analytics-secondary-navigation"
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
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer whitespace-nowrap ${
                    active
                      ? 'border-b-2 border-primary text-primary font-semibold relative'
                      : 'border-b-2 border-transparent text-secondary hover:text-primary font-medium'
                  }`}
                  data-testid={`superadmin_analytics-secondary-link-${tab.key}`}
                >
                  <Icon size={16} className={active ? 'text-primary' : 'text-secondary'} />
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
