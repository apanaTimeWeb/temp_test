// FLOW: Route/resource miss -> superadmin_settings/settings_profile_security/not-found.tsx -> localized not-found UI.
/** Responsibility: localized not-found boundary for the owning Superadmin leaf. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SETTINGS_PROFILE_SECURITY_ROUTES } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/config/superadmin_profile_security.url_config';
/**
 * Performs the superadmin module not found operation within profile security; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminModuleNotFound() {
  const t = useTranslations('SUPERADMIN_PROFILE');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-6 text-primary" role="status">
      <h1 className="text-xl font-semibold">{t('COPY.MODULE_NOT_FOUND_TITLE')}</h1>
      <p className="mt-2 text-sm text-secondary">{t('COPY.MODULE_NOT_FOUND_MESSAGE')}</p>
      <Link className="sa-btn-primary mt-4 inline-flex" href={SUPERADMIN_SETTINGS_PROFILE_SECURITY_ROUTES.SUPERADMIN_PROFILE_SECURITY_SETTINGS_URLS.DASHBOARD_OVERVIEW} data-testid="superadmin-profile-security-not-found-dashboard-link">{t('COPY.BACK_TO_DASHBOARD')}</Link>
    </section>
  );
}
