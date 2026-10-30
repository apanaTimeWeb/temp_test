// RESPONSIBILITY: Owns the AdminDashboardOverviewMain presentation responsibility for the dashboard_overview module. It does not own cross-module business logic or API transport.
import Link from 'next/link';
import { Armchair, Users, WalletCards } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_admin/admin_dashboard/dashboard_overview/config/admin_dashboard_overview.url_config';

const destinations = [
  {
    key: 'MEMBERS',
    Icon: Users,
    href: ADMIN_DASHBOARD_OVERVIEW_ROUTES.MEMBERS_DIRECTORY,
  },
  {
    key: 'SEATS',
    Icon: Armchair,
    href: ADMIN_DASHBOARD_OVERVIEW_ROUTES.SEATS_MATRIX,
  },
  {
    key: 'FINANCE',
    Icon: WalletCards,
    href: ADMIN_DASHBOARD_OVERVIEW_ROUTES.FINANCE_DASHBOARD,
  },
] as const;

/**
 * Renders the canonical dashboard landing page for the multi-library Admin.
 * Destination metrics remain explicitly unavailable until source contracts exist.
 */
export default function AdminDashboardOverviewMain() {
  const t = useTranslations('ADMIN_DASHBOARD');

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 text-text-primary sm:p-6 lg:p-8">
      <header className="border-b border-border pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {t('LIBRARY_OVERVIEW_EYEBROW')}
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          {t('LIBRARY_OVERVIEW_TITLE')}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
          {t('LIBRARY_OVERVIEW_DESCRIPTION')}
        </p>
      </header>

      <section
        aria-label={t('LIBRARY_DESTINATIONS')}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {destinations.map(({ key, Icon, href }) => (
          <article
            key={key}
            className="rounded-xl border border-border bg-card p-5"
          >
            <Icon className="h-6 w-6 text-text-secondary" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold">
              {t(`LIBRARY_${key}_TITLE`)}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {t(`LIBRARY_${key}_UNAVAILABLE`)}
            </p>
            <Link
              href={href}
              className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-border px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t('LIBRARY_OPEN_DESTINATION')}
            </Link>
          </article>
        ))}
      </section>

      <aside
        role="status"
        className="rounded-xl border border-border bg-card p-4 text-sm text-text-secondary"
      >
        <h2 className="font-semibold text-text-primary">
          {t('LIBRARY_DATA_PENDING_TITLE')}
        </h2>
        <p className="mt-1">{t('LIBRARY_DATA_PENDING_DESCRIPTION')}</p>
      </aside>
    </main>
  );
}
