'use client';
/** Responsibility: Superadmin Dashboard Main; owns the dashboard route composition boundary. */
/** Data-Flow: route -> Main -> availability hook -> module API contract; no mock fixture is a production data source. */
import Link from 'next/link';
import { Activity } from 'lucide-react';
import { useTranslations } from 'next-intl';
import SuperadminDashboardOverviewEmptyState from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewEmptyState';
import { useSuperadminDashboardOverviewAvailability } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/hooks/useSuperadminDashboardOverviewAvailability';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config';

/** The route remains unavailable rather than displaying fixture records as live platform analytics. */
export default function SuperadminDashboardOverviewMain() {
  const t = useTranslations('SUPERADMIN_DASHBOARD');
  const { available } = useSuperadminDashboardOverviewAvailability();

  return (
    <main className="min-w-0">
      <header className="mb-8 flex flex-col gap-2">
        <div className="sa-breadcrumb">
          <span>{t('COPY.LIBRARY_OS')}</span><span>/</span><span>{t('COPY.SUPER_ADMIN')}</span><span>/</span><span>{t('COPY.DASHBOARD')}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <h1 className="sa-page-title">{t('COPY.PLATFORM_OVERVIEW')}</h1>
          <Link href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.AUDIT_LOGS} className="sa-btn-ghost sa-btn-ghost--sm" data-testid="superadmin-dashboard-dashboard_overview-link-1">
            <Activity size={18} aria-hidden="true" /> {t('COPY.VIEW_AUDIT_LOGS')}
          </Link>
        </div>
      </header>
      {!available ? (
        <section className="rounded-xl border border-border bg-warning-bg p-6 text-warning" role="status" aria-live="polite" data-testid="dashboard-overview-api-unavailable">
          <h2 className="mb-2 font-semibold">{t('COPY.DASHBOARD_READ_CONTRACT_UNAVAILABLE_TITLE')}</h2>
          <p>{t('COPY.DASHBOARD_READ_CONTRACT_UNAVAILABLE_MESSAGE')}</p>
          <div className="mt-5"><SuperadminDashboardOverviewEmptyState /></div>
        </section>
      ) : (
        <section role="status" aria-live="polite">{t('COPY.DASHBOARD_READ_CONTRACT_UNAVAILABLE_MESSAGE')}</section>
      )}
    </main>
  );
}
