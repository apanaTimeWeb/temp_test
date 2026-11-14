// FLOW: Route/resource miss -> superadmin_billing/billing_member_finance_overview/not-found.tsx -> localized not-found UI.
/** Responsibility: localized not-found boundary for the owning Superadmin leaf. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const SUPERADMIN_DASHBOARD_ROUTE = '/superadmin/superadmin_dashboard/dashboard_overview';

export default function ModuleNotFound() {
  const t = useTranslations('SUPERADMIN_FINANCE');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-6 text-primary" role="status">
      <h1 className="text-xl font-semibold">{t('COPY.MODULE_NOT_FOUND_TITLE')}</h1>
      <p className="mt-2 text-sm text-secondary">{t('COPY.MODULE_NOT_FOUND_MESSAGE')}</p>
      <Link className="sa-btn-primary mt-4 inline-flex min-h-11 min-w-28 items-center justify-center" href={SUPERADMIN_DASHBOARD_ROUTE} data-testid="superadmin_billing-billing_member_finance_overview-not-found-dashboard-link">
        {t('COPY.BACK_TO_DASHBOARD')}
      </Link>
    </section>
  );
}
