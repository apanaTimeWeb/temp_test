// FLOW: Route/resource miss -> superadmin_libraries/libraries_facility_power_management/not-found.tsx -> localized not-found UI.
/** Responsibility: localized not-found boundary for the owning Superadmin leaf. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_LIBRARIES_FACILITY_POWER_MANAGEMENT_ROUTES } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/config/libraries_facility_power_management.url_config';

export default function ModuleNotFound() {
  const t = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-6 text-primary" role="status">
      <h1 className="text-xl font-semibold">{t('COPY.MODULE_NOT_FOUND_TITLE')}</h1>
      <p className="mt-2 text-sm text-secondary">{t('COPY.MODULE_NOT_FOUND_MESSAGE')}</p>
      <Link className="sa-btn-primary mt-4 inline-flex min-h-11 min-w-28 items-center justify-center" href={SUPERADMIN_LIBRARIES_FACILITY_POWER_MANAGEMENT_ROUTES.DASHBOARD_RECOVERY} data-testid="superadmin_libraries-libraries_facility_power_management-not-found-dashboard-link">
        {t('COPY.BACK_TO_DASHBOARD')}
      </Link>
    </section>
  );
}
