// FLOW: Route/resource miss -> superadmin_users/users_roles_permissions/not-found.tsx -> localized not-found UI.
/** Responsibility: localized not-found boundary for the owning Superadmin leaf. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_USERS_ROLES_PERMISSIONS_ROUTES } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/config/superadmin_users_roles_permissions.url_config';
/**
 * Performs the superadmin module not found operation within users roles permissions; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminModuleNotFound() {
  const t = useTranslations('SUPERADMIN_USERS');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-6 text-primary" role="status">
      <h1 className="text-xl font-semibold">{t('COPY.MODULE_NOT_FOUND_TITLE')}</h1>
      <p className="mt-2 text-sm text-secondary">{t('COPY.MODULE_NOT_FOUND_MESSAGE')}</p>
      <Link className="sa-btn-primary mt-4 inline-flex" href={SUPERADMIN_USERS_ROLES_PERMISSIONS_ROUTES.SUPERADMIN_USERS_ROLES_PERMISSIONS_URLS.DASHBOARD_OVERVIEW} data-testid="superadmin-users-roles-permissions-not-found-dashboard-link">{t('COPY.BACK_TO_DASHBOARD')}</Link>
    </section>
  );
}
