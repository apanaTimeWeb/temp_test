'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the Plans domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_plans/layout.tsx -> role-level navigation registry and child route content.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Package, Tag } from 'lucide-react';

/**
 * Performs the domain layout operation within layout.tsx; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: { children: ReactNode; }.
 */
export default function DomainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('SUPERADMIN_SUBSCRIPTIONS');
  const routes = [
    { key: 'plans_pricing_catalog', label: t('COPY.NAV_PLANS_PRICING_CATALOG'), href: SUPERADMIN_NAVIGATION_ROUTES.plans_pricing_catalog, icon: Package },
    { key: 'plans_promotions', label: t('COPY.NAV_PLANS_PROMOTIONS'), href: SUPERADMIN_NAVIGATION_ROUTES.plans_promotions, icon: Tag },
  ] as const;

  return (
    <div className="w-full max-w-full min-w-0 p-0">
      <nav aria-label={t('COPY.NAVIGATION_SECONDARY')} className="mb-6 border-b border-indigo-500/20" data-testid="superadmin_plans-secondary-navigation">
        <ul className="flex min-w-0 flex-wrap gap-2" role="list">
          {routes.map((route) => {
            const active = pathname === route.href;
            const Icon = route.icon;
            return (
              <li key={route.key} className="min-w-0">
                <Link
                  href={route.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-xs sm:text-sm font-semibold motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    active
                      ? 'border-b-2 border-indigo-400 bg-indigo-500/10 text-indigo-300 shadow-xs'
                      : 'border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                  data-testid={`superadmin_plans-secondary-link-${route.key}`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{route.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="w-full min-w-0">{children}</div>
    </div>
  );
}
