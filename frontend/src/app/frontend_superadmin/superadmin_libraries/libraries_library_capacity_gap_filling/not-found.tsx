// FLOW: Route/resource miss -> superadmin_libraries/libraries_library_capacity_gap_filling/not-found.tsx -> localized not-found UI.
/** Responsibility: localized not-found boundary for the owning Superadmin leaf. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_GAP_FILLING_ROUTES } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/config/libraries_library_capacity_gap_filling.url_config';

export default function ModuleNotFound() {
  const t = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-6 text-primary" role="status">
      <h1 className="text-xl font-semibold">{t('COPY.MODULE_NOT_FOUND_TITLE')}</h1>
      <p className="mt-2 text-sm text-secondary">{t('COPY.MODULE_NOT_FOUND_MESSAGE')}</p>
      <Link className="sa-btn-primary mt-4 inline-flex min-h-11 min-w-28 items-center justify-center" href={SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_GAP_FILLING_ROUTES.SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_GAP_FILLING_URLS.DASHBOARD_RECOVERY} data-testid="superadmin_libraries-libraries_library_capacity_gap_filling-not-found-dashboard-link">
        {t('COPY.BACK_TO_DASHBOARD')}
      </Link>
    </section>
  );
}
