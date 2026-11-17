'use client';
/** Responsibility: users-and-access landing overview; user directory, role permissions, and sessions live in their own canonical route leaves. */
/** Data-Flow: local demonstration fixtures -> summary metrics -> canonical route links; no provisioning, RBAC, password reset, or session mutation occurs here. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_users/users_overview/config/superadmin_users_overview.url_config.ts';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_USERS_INITIAL_USERS, SUPERADMIN_USERS_INITIAL_SESSIONS } from '@/app/frontend_superadmin/superadmin_users/users_overview/mocks/fixtures/SuperadminUsersOverviewMockFixtures';
import { SUPERADMIN_USERS_TABS } from '@/app/frontend_superadmin/superadmin_users/users_overview/constants/SuperadminUsersOverviewConstants';
import { Users, UserCheck, UserX, ShieldCheck, Activity, ArrowRight, AlertTriangle, TrendingUp } from 'lucide-react';

export default function SuperadminUsersOverviewPageClient() {
  const t = useTranslations('SUPERADMIN_USERS');
  const users = SUPERADMIN_USERS_INITIAL_USERS;
  const routes: Record<string, string> = {
    'All Users': SUPERADMIN_NAVIGATION_ROUTES.users_directory,
    'Roles & Permissions': SUPERADMIN_NAVIGATION_ROUTES.users_roles_permissions,
    'User Sessions': SUPERADMIN_NAVIGATION_ROUTES.security_user_sessions,
  };

  const activeCount = users.filter((user) => user.status === 'Active').length;
  const suspendedCount = users.filter((user) => user.status !== 'Active').length;
  const twoFactorCount = users.filter((user) => user.twoFactor).length;
  const sessionCount = SUPERADMIN_USERS_INITIAL_SESSIONS.length;

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card/90 border border-border/80 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-sm">
            <Users size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">{t('COPY.USERS_ACCESS_CONTROL')}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Management</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{t('COPY.USERS_OVERVIEW_SUMMARY')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={SUPERADMIN_NAVIGATION_ROUTES.users_directory}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <Users size={15} />
            <span>{t('COPY.TAB_ALL_USERS')}</span>
          </Link>
        </div>
      </div>

      {/* Warning banner */}
      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs sm:text-sm text-amber-300 flex items-start gap-2.5" role="status">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <span>{t('COPY.USER_AND_SESSION_RECORDS_ARE_ILLUSTRATIVE_IN_MEMORY_SAMPLE_DATA_PROVISIONING_STATUS_CHANGES_RBAC_WRITES_PASSWORD_RESETS_AND_SESSION_REVOCATION_REQUIRE_VERIFIED_HOST_API_CONTRACTS_AND_DO_NOT_CHANGE_SERVER_STATE_HERE')}</span>
      </p>

      {/* 4 KPI Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" aria-label={t('COPY.USERS_OVERVIEW_SUMMARY')}>
        {/* KPI 1: Active Users (Emerald) */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-card/90 to-card p-5 shadow-sm transition-all hover:border-emerald-500/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300/80 uppercase tracking-wider">{t('COPY.ACTIVE_USER_COUNT')}</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tabular-nums">{activeCount}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-emerald-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${(activeCount / Math.max(1, users.length)) * 100}%` }} />
          </div>
        </div>

        {/* KPI 2: Suspended Accounts (Rose) */}
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-card/90 to-card p-5 shadow-sm transition-all hover:border-rose-500/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300/80 uppercase tracking-wider">{t('COPY.SUSPENDED_USER_COUNT')}</span>
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <UserX size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tabular-nums">{suspendedCount}</span>
            <span className="text-xs text-rose-400 font-medium">Inactive</span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-rose-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full" style={{ width: `${(suspendedCount / Math.max(1, users.length)) * 100}%` }} />
          </div>
        </div>

        {/* KPI 3: 2FA Enforced (Sky) */}
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/40 via-card/90 to-card p-5 shadow-sm transition-all hover:border-sky-500/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-300/80 uppercase tracking-wider">{t('COPY.TWO_FACTOR_ENABLED_COUNT')}</span>
            <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tabular-nums">{twoFactorCount}</span>
            <span className="text-xs text-sky-400 font-medium">
              {Math.round((twoFactorCount / Math.max(1, users.length)) * 100)}% Protected
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-sky-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full" style={{ width: `${(twoFactorCount / Math.max(1, users.length)) * 100}%` }} />
          </div>
        </div>

        {/* KPI 4: Active Sessions (Amber) */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-card/90 to-card p-5 shadow-sm transition-all hover:border-amber-500/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider">{t('COPY.SESSION_COUNT')}</span>
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tabular-nums">{sessionCount}</span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <TrendingUp size={12} />
              Active
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-amber-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: '75%' }} />
          </div>
        </div>
      </section>

      {/* Navigation Routes Cards */}
      <section aria-labelledby="superadmin-users-access-routes-title" className="space-y-4">
        <h2 id="superadmin-users-access-routes-title" className="text-base sm:text-lg font-bold text-slate-100">{t('COPY.USER_ACCESS_VIEWS')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {SUPERADMIN_USERS_TABS.map((tab) => {
            const href = routes[tab.name];
            const TabIcon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={href}
                aria-label={`${t('COPY.OPEN_USER_ACCESS_CONTROL')}: ${t(tab.labelKey)}`}
                className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-card/90 p-5 shadow-sm transition-all hover:border-indigo-500/50 hover:bg-slate-900/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                data-testid={`superadmin-users-overview-open-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 group-hover:scale-105 transition-transform">
                      <TabIcon size={20} aria-hidden="true" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-100 text-sm group-hover:text-indigo-300 transition-colors block">
                        {t(tab.labelKey)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {tab.name === 'All Users' ? 'Directory & Accounts' : tab.name === 'Roles & Permissions' ? 'RBAC Access Matrix' : 'Session Monitoring'}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:translate-x-0.5 transition-all">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
