'use client';
/** Responsibility: users-and-access landing overview; user directory, role permissions, and sessions live in their own canonical route leaves. */
/** Data-Flow: local demonstration fixtures -> summary metrics -> canonical route links; no provisioning, RBAC, password reset, or session mutation occurs here. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_users/users_overview/config/superadmin_users_overview.url_config.ts';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_USERS_INITIAL_USERS, SUPERADMIN_USERS_INITIAL_SESSIONS } from '@/app/frontend_superadmin/superadmin_users/users_overview/mocks/fixtures/SuperadminUsersOverviewMockFixtures';
import { SUPERADMIN_USERS_TABS } from '@/app/frontend_superadmin/superadmin_users/users_overview/constants/SuperadminUsersOverviewConstants';
import { Users, UserCheck, UserX, ShieldCheck } from 'lucide-react';

export default function SuperadminUsersOverviewPageClient() {
  const t = useTranslations('SUPERADMIN_USERS');
  const users = SUPERADMIN_USERS_INITIAL_USERS;
  const routes: Record<string, string> = {
    'All Users': SUPERADMIN_NAVIGATION_ROUTES.users_directory,
    'Roles & Permissions': SUPERADMIN_NAVIGATION_ROUTES.users_roles_permissions,
    'User Sessions': SUPERADMIN_NAVIGATION_ROUTES.security_user_sessions,
  };
  const metrics = [
    { id: 'active-users', label: t('COPY.ACTIVE_USER_COUNT'), count: users.filter((user) => user.status === 'Active').length, icon: UserCheck },
    { id: 'suspended-users', label: t('COPY.SUSPENDED_USER_COUNT'), count: users.filter((user) => user.status !== 'Active').length, icon: UserX },
    { id: 'two-factor', label: t('COPY.TWO_FACTOR_ENABLED_COUNT'), count: users.filter((user) => user.twoFactor).length, icon: ShieldCheck },
    { id: 'sessions', label: t('COPY.SESSION_COUNT'), count: SUPERADMIN_USERS_INITIAL_SESSIONS.length, icon: Users },
  ];

  return (
    <div className="sa-page-animate">
      <p className="mb-5 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{t('COPY.USER_AND_SESSION_RECORDS_ARE_ILLUSTRATIVE_IN_MEMORY_SAMPLE_DATA_PROVISIONING_STATUS_CHANGES_RBAC_WRITES_PASSWORD_RESETS_AND_SESSION_REVOCATION_REQUIRE_VERIFIED_HOST_API_CONTRACTS_AND_DO_NOT_CHANGE_SERVER_STATE_HERE')}</p>
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb"><span>{t('COPY.LIBRARY_OS')}</span><span>/</span><span>{t('COPY.SUPER_ADMIN')}</span><span>/</span><span>{t('COPY.USERS_ACCESS')}</span></div>
        <h1 className="sa-page-title mt-2">{t('COPY.USERS_ACCESS_CONTROL')}</h1>
        <p className="mt-2 text-sm text-secondary">{t('COPY.USERS_OVERVIEW_SUMMARY')}</p>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8" aria-label={t('COPY.USERS_OVERVIEW_SUMMARY')}>
        {metrics.map(({ id, label, count, icon: Icon }) => <article key={id} className="sa-card p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm text-secondary">{label}</p><Icon size={18} aria-hidden="true" className="text-info" /></div><p className="mt-3 text-3xl font-bold text-primary tabular-nums">{count}</p><p className="mt-2 text-xs text-warning">{t('COPY.STATUS_SAMPLE')}</p></article>)}
      </section>
      <section aria-labelledby="superadmin-users-access-routes-title">
        <h2 id="superadmin-users-access-routes-title" className="text-lg font-bold text-primary mb-4">{t('COPY.USER_ACCESS_VIEWS')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {SUPERADMIN_USERS_TABS.map((tab) => {
            const href = routes[tab.name];
            return <Link key={tab.name} href={href} aria-label={`${t('COPY.OPEN_USER_ACCESS_CONTROL')}: ${t(tab.labelKey)}`} className="sa-card p-5 flex items-center justify-between gap-4 hover:border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info" data-testid={`superadmin-users-overview-open-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}><span className="flex items-center gap-3"><tab.icon size={20} aria-hidden="true" /><span className="font-semibold text-primary">{t(tab.labelKey)}</span></span><span className="text-xs text-secondary">{t('COPY.OPEN_USER_ACCESS_CONTROL')} →</span></Link>;
          })}
        </div>
      </section>
    </div>
  );
}
