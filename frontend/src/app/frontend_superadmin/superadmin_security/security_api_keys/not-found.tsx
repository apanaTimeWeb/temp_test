// FLOW: Route/resource miss -> superadmin_security/security_api_keys/not-found.tsx -> localized not-found UI.
/** Responsibility: localized not-found boundary for the owning Superadmin leaf. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SECURITY_API_KEYS_ROUTES } from '@/app/frontend_superadmin/superadmin_security/security_api_keys/config/superadmin_security_api_keys.url_config';


/**
 * Performs the superadmin module not found operation within security api keys; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminModuleNotFound() {
  const t = useTranslations('SUPERADMIN_SECURITY');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-6 text-primary" role="status">
      <h1 className="text-xl font-semibold">{t('COPY.MODULE_NOT_FOUND_TITLE')}</h1>
      <p className="mt-2 text-sm text-secondary">{t('COPY.MODULE_NOT_FOUND_MESSAGE')}</p>
      <Link className="sa-btn-primary mt-4 inline-flex" href={SUPERADMIN_SECURITY_API_KEYS_ROUTES.SUPERADMIN_SECURITY_API_KEYS_URLS.DASHBOARD_OVERVIEW} data-testid="superadmin-security-api-keys-not-found-dashboard-link">{t('COPY.BACK_TO_DASHBOARD')}</Link>
    </section>
  );
}
