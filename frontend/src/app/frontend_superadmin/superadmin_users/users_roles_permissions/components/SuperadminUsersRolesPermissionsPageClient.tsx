'use client';

/** Responsibility: renders the canonical roles-and-permissions route only. */
/** Data-Flow: canonical roles route -> role-permission sample fixture -> read-only localized matrix; server enforcement remains authoritative. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/config/superadmin_users_roles_permissions.url_config.ts';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_USERS_TABS } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/constants/SuperadminUsersRolesPermissionsConstants';
import { SUPERADMIN_USERS_ROLE_PERMISSIONS } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/mocks/fixtures/SuperadminUsersRolesPermissionsMockFixtures';
import SuperadminUsersRolesPermissionsContent from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminUsersRolesPermissionsContent';
export default function SuperadminUsersRolesPermissionsPageClient() {
  const t = useTranslations('SUPERADMIN_USERS');
  const activeTab = 'Roles & Permissions';

  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
      'All Users': SUPERADMIN_NAVIGATION_ROUTES.users_directory,
      'Roles & Permissions': SUPERADMIN_NAVIGATION_ROUTES.users_roles_permissions,
      'User Sessions': SUPERADMIN_NAVIGATION_ROUTES.security_user_sessions,
    };
    const route = routes[key];
    if (!route) return;
    const target = new URL(route, window.location.origin);
    const query = new URLSearchParams(window.location.search);
    query.delete('view');
    query.forEach((value, queryKey) => {
      if (!target.searchParams.has(queryKey)) target.searchParams.append(queryKey, value);
    });
    window.location.assign(target.pathname + target.search + target.hash);
  };

  return (
    <div className="sa-page-animate">
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb"><span>{t('COPY.LIBRARY_OS')}</span><span>/</span><span>{t('COPY.SUPER_ADMIN')}</span><span>/</span><span>{t('COPY.USERS_ACCESS')}</span></div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">{t('COPY.USERS_ACCESS_CONTROL')}</h1>
        </div>
      </div>

      <p className="mb-5 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">
        {t('COPY.RBAC_PERMISSION_MATRIX_IS_ILLUSTRATIVE_AND_READ_ONLY_UNTIL_A_VERIFIED_WRITE_API_CONTRACT_IS_SUPPLIED')}
      </p>

      <nav className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto" aria-label={t('COPY.USER_ACCESS_VIEWS')}>
        {SUPERADMIN_USERS_TABS.map((tab) => (
          <button
            key={tab.name}
            type="button"
            aria-current={activeTab === tab.name ? 'page' : undefined}
            onClick={() => navigateToWorkflow(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold motion-safe:transition-all motion-reduce:transition-none ${activeTab === tab.name ? 'bg-info-bg text-primary border border-border shadow-card' : 'text-secondary hover:bg-surface-hover hover:text-primary'}`}
            data-testid={`superadmin-users-roles-permissions-navigate-${tab.name.toLowerCase().replace(/[^a-z]+/g, '-')}`}
          >
            <tab.icon size={16} aria-hidden="true" /> {t(tab.labelKey)}
          </button>
        ))}
      </nav>

      <SuperadminUsersRolesPermissionsContent rolePermissions={SUPERADMIN_USERS_ROLE_PERMISSIONS} />
    </div>
  );
}
