// FLOW: Route/resource miss -> superadmin_libraries/libraries_facility_asset_registry/not-found.tsx -> localized not-found UI.
/** Responsibility: localized not-found boundary for the owning Superadmin leaf. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_LIBRARIES_FACILITY_ASSET_REGISTRY_ROUTES } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/config/libraries_facility_asset_registry.url_config';

export default function ModuleNotFound() {
  const t = useTranslations('SUPERADMIN_ACCOUNTING');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-6 text-primary" role="status">
      <h1 className="text-xl font-semibold">{t('COPY.MODULE_NOT_FOUND_TITLE')}</h1>
      <p className="mt-2 text-sm text-secondary">{t('COPY.MODULE_NOT_FOUND_MESSAGE')}</p>
      <Link className="sa-btn-primary mt-4 inline-flex min-h-11 min-w-28 items-center justify-center" href={SUPERADMIN_LIBRARIES_FACILITY_ASSET_REGISTRY_ROUTES.DASHBOARD_RECOVERY} data-testid="superadmin_libraries-libraries_facility_asset_registry-not-found-dashboard-link">
        {t('COPY.BACK_TO_DASHBOARD')}
      </Link>
    </section>
  );
}
