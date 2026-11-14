// FLOW: Route/resource miss -> superadmin_security/security_user_sessions/not-found.tsx -> localized not-found UI.
/** Responsibility: localized not-found boundary for the owning Superadmin leaf. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SECURITY_USER_SESSIONS_ROUTES } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/config/superadmin_security_user_sessions.url_config';



/**
 * Performs the superadmin module not found operation within security user sessions; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminModuleNotFound() {
  const t = useTranslations('SUPERADMIN_USERS');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-6 text-primary" role="status">
      <h1 className="text-xl font-semibold">{t('COPY.MODULE_NOT_FOUND_TITLE')}</h1>
      <p className="mt-2 text-sm text-secondary">{t('COPY.MODULE_NOT_FOUND_MESSAGE')}</p>
      <Link className="sa-btn-primary mt-4 inline-flex" href={SUPERADMIN_SECURITY_USER_SESSIONS_ROUTES.SUPERADMIN_USERS_SESSIONS_URLS.DASHBOARD_OVERVIEW} data-testid="superadmin-security-user-sessions-not-found-dashboard-link">{t('COPY.BACK_TO_DASHBOARD')}</Link>
    </section>
  );
}
