'use client';

/** Responsibility: renders the canonical roles-and-permissions route only. */
/** Data-Flow: canonical roles route -> role-permission sample fixture -> read-only localized matrix; server enforcement remains authoritative. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/config/superadmin_users_roles_permissions.url_config.ts';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_USERS_TABS } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/constants/SuperadminUsersRolesPermissionsConstants';
import { SUPERADMIN_USERS_ROLE_PERMISSIONS } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/mocks/fixtures/SuperadminUsersRolesPermissionsMockFixtures';
import SuperadminUsersRolesPermissionsContent from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminUsersRolesPermissionsContent';
import { ShieldCheck, AlertTriangle, Crown, Building2, UserCheck } from 'lucide-react';

export default function SuperadminUsersRolesPermissionsPageClient() {
  const t = useTranslations('SUPERADMIN_USERS');
  const activeTab = 'Roles & Permissions';

  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
      'All Users': SUPERADMIN_NAVIGATION_ROUTES.users_directory,
      'Roles & Permissions': SUPERADMIN_NAVIGATION_ROUTES.users_roles_permissions,
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
    <div className="w-full max-w-full min-w-0 space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card/90 border border-border/80 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-sm">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">{t('COPY.USERS_ACCESS_CONTROL')}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>RBAC Active</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{t('COPY.ROLE_BASED_ACCESS_CONTROL_RBAC_MATRIX')}</p>
          </div>
        </div>
      </div>

      {/* 3 Role Scope Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Role Scope Overview">
        {/* Role 1: SuperAdmin (Purple) */}
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-card/90 to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-300/80 uppercase tracking-wider">{t('COPY.SUPERADMIN')}</span>
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <Crown size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-base font-bold text-slate-100">Global System Authority</p>
            <p className="text-xs text-purple-300/70 mt-1">Full control across all 6 SaaS core modules and configurations.</p>
          </div>
        </div>

        {/* Role 2: Tenant Admin (Indigo) */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-card/90 to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300/80 uppercase tracking-wider">{t('COPY.ADMIN_TENANT')}</span>
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Building2 size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-base font-bold text-slate-100">Tenant / Branch Scoped</p>
            <p className="text-xs text-indigo-300/70 mt-1">Library, Billing, Shift, and Student management for their tenant.</p>
          </div>
        </div>

        {/* Role 3: Manager (Sky) */}
        <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/40 via-card/90 to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-300/80 uppercase tracking-wider">{t('COPY.MANAGER')}</span>
            <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <UserCheck size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-base font-bold text-slate-100">Operational Desk Scoped</p>
            <p className="text-xs text-sky-300/70 mt-1">Day-to-day seat check-ins, shift management, and student CRM.</p>
          </div>
        </div>
      </section>

      {/* Warning banner */}
      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs sm:text-sm text-amber-300 flex items-start gap-2.5" role="status">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <span>{t('COPY.RBAC_PERMISSION_MATRIX_IS_ILLUSTRATIVE_AND_READ_ONLY_UNTIL_A_VERIFIED_WRITE_API_CONTRACT_IS_SUPPLIED')}</span>
      </p>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-2 border-b border-border/80 pb-2 overflow-x-auto" aria-label={t('COPY.USER_ACCESS_VIEWS')}>
        {SUPERADMIN_USERS_TABS.map((tab) => {
          const active = activeTab === tab.name;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.name}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => navigateToWorkflow(tab.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                active 
                  ? 'border border-indigo-400 bg-indigo-500/10 text-indigo-300 shadow-xs' 
                  : 'text-slate-400 hover:bg-surface-hover hover:text-slate-200'
              }`}
              data-testid={`superadmin-users-roles-permissions-navigate-${tab.name.toLowerCase().replace(/[^a-z]+/g, '-')}`}
            >
              <TabIcon size={15} aria-hidden="true" className={active ? 'text-indigo-400' : 'text-slate-400'} />
              <span>{t(tab.labelKey)}</span>
            </button>
          );
        })}
      </nav>

      <SuperadminUsersRolesPermissionsContent rolePermissions={SUPERADMIN_USERS_ROLE_PERMISSIONS} />
    </div>
  );
}
