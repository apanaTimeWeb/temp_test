'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the Analytics domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_analytics/layout.tsx -> role-level navigation registry and child route content.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { LayoutDashboard, DollarSign, TrendingUp, PieChart } from 'lucide-react';

const TAB_ICONS = {
  analytics_overview: LayoutDashboard,
  analytics_financials: DollarSign,
  analytics_library_growth: TrendingUp,
  analytics_subscription_mix: PieChart,
} as const;

export default function DomainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('SUPERADMIN_REPORTS');
  const routes = [
    { key: 'analytics_overview', label: t('COPY.NAV_ANALYTICS_OVERVIEW'), href: SUPERADMIN_NAVIGATION_ROUTES.analytics_overview },
    { key: 'analytics_financials', label: t('COPY.NAV_ANALYTICS_FINANCIALS'), href: SUPERADMIN_NAVIGATION_ROUTES.analytics_financials },
    { key: 'analytics_library_growth', label: t('COPY.NAV_ANALYTICS_LIBRARY_GROWTH'), href: SUPERADMIN_NAVIGATION_ROUTES.analytics_library_growth },
    { key: 'analytics_subscription_mix', label: t('COPY.NAV_ANALYTICS_SUBSCRIPTION_MIX'), href: SUPERADMIN_NAVIGATION_ROUTES.analytics_subscription_mix },
  ] as const;
  return (
    <div className="w-full max-w-full min-w-0 px-2 sm:px-4 lg:px-6 py-2">
      <nav aria-label={t('COPY.NAVIGATION_SECONDARY')} className="mb-6 border-b border-border/80" data-testid="superadmin_analytics-secondary-navigation">
        <ul className="flex min-w-0 flex-wrap gap-2" role="list">
          {routes.map((route) => {
            const active = pathname === route.href || pathname.startsWith(route.href + '/');
            const Icon = TAB_ICONS[route.key as keyof typeof TAB_ICONS] ?? LayoutDashboard;
            return (
              <li key={route.key} className="min-w-0">
                <Link
                  href={route.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-t-xl border-b-2 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer ${
                    active
                      ? 'border-indigo-400 bg-indigo-500/10 text-indigo-300 shadow-xs'
                      : 'border-transparent text-slate-400 hover:bg-surface-hover hover:text-slate-200'
                  }`}
                  data-testid={`superadmin_analytics-secondary-link-${route.key}`}
                >
                  <Icon size={15} className={active ? 'text-indigo-400' : 'text-slate-400'} />
                  <span>{route.label}</span>
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
