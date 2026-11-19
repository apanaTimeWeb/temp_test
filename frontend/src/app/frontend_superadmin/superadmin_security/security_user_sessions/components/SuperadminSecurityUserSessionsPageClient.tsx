'use client';
/** Responsibility: renders only the canonical security user-sessions route; user-directory and role-management UI live in their own route leaves. */
/** Data-Flow: canonical route -> local demonstration session fixtures -> read-only semantic table; revocation is disabled until a verified host API contract exists. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/config/superadmin_security_user_sessions.url_config.ts';
import { useMemo } from 'react';
import {
  Globe,
  LogOut,
  Monitor,
  Smartphone,
  ShieldAlert,
  AlertCircle,
  Users,
  Activity,
  UserX,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_USERS_INITIAL_SESSIONS } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/mocks/fixtures/SuperadminSecurityUserSessionsMockFixtures';
import SuperadminSecurityUserSessionsSemanticTable from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/components/SuperadminSecurityUserSessionsSemanticTable';
import type { SemanticCellParams, SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/types/SuperadminSecurityUserSessionsSemanticTableTypes';
import type { SuperadminSessionData } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/types/SuperadminSecurityUserSessionsTypes';

export default function SuperadminSecurityUserSessionsPageClient() {
  const t = useTranslations('SUPERADMIN_USERS');

  const totalSessions = SUPERADMIN_USERS_INITIAL_SESSIONS.length;
  const activeSessions = SUPERADMIN_USERS_INITIAL_SESSIONS.filter((s) => s.status === 'Active').length;
  const revokedSessions = totalSessions - activeSessions;

  const sessionColumns = useMemo<SemanticColumnDef<SuperadminSessionData>[]>(() => [
    {
      field: 'user',
      headerName: t('COPY.TABLE_COLUMN_USER'),
      flex: 1.2,
      minWidth: 140,
      cellClass: 'sa-cell-primary-bold font-semibold text-slate-100',
    },
    {
      field: 'device',
      headerName: t('COPY.TABLE_COLUMN_DEVICE_BROWSER'),
      flex: 1.4,
      minWidth: 150,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => {
        const isDesktop = (params.value ?? '').includes('Mac') || (params.value ?? '').includes('Windows');
        return (
          <span className="inline-flex items-center gap-2 text-slate-300">
            {isDesktop ? (
              <Monitor size={15} className="text-sky-400 shrink-0" aria-hidden="true" />
            ) : (
              <Smartphone size={15} className="text-purple-400 shrink-0" aria-hidden="true" />
            )}
            <span>{params.value ?? ''}</span>
          </span>
        );
      },
    },
    {
      field: 'ip',
      headerName: t('COPY.TABLE_COLUMN_IP_ADDRESS'),
      flex: 1.1,
      minWidth: 130,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => (
        <span className="font-mono text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
          {params.value ?? ''}
        </span>
      ),
    },
    {
      field: 'location',
      headerName: t('COPY.TABLE_COLUMN_LOCATION'),
      flex: 1.1,
      minWidth: 120,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => (
        <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs">
          <Globe size={13} className="text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{params.value ?? ''}</span>
        </span>
      ),
    },
    {
      field: 'lastActive',
      headerName: t('COPY.TABLE_COLUMN_LAST_ACTIVE'),
      flex: 1.1,
      minWidth: 120,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => {
        let label = '';
        switch (params.data.lastActive) {
          case 'JUST_NOW':
            label = t('COPY.SESSION_LAST_ACTIVE_JUST_NOW');
            break;
          case 'TWO_HOURS_AGO':
            label = t('COPY.SESSION_LAST_ACTIVE_TWO_HOURS_AGO');
            break;
          case 'TEN_MINUTES_AGO':
            label = t('COPY.SESSION_LAST_ACTIVE_TEN_MINUTES_AGO');
            break;
          case 'ONE_MONTH_AGO':
            label = t('COPY.SESSION_LAST_ACTIVE_ONE_MONTH_AGO');
            break;
          default:
            label = params.data.lastActive;
        }
        return <span className="text-xs text-slate-400">{label}</span>;
      },
    },
    {
      field: 'status',
      headerName: t('COPY.TABLE_COLUMN_STATUS'),
      flex: 0.9,
      minWidth: 100,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => {
        const isActive = params.value === 'Active';
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isActive
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            {isActive ? t('COPY.STATUS_ACTIVE') : t('COPY.STATUS_REVOKED')}
          </span>
        );
      },
    },
    {
      headerName: t('COPY.TABLE_COLUMN_ACTION'),
      flex: 1.1,
      minWidth: 130,
      sortable: false,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, unknown>) =>
        params.data.status === 'Active' ? (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-300 opacity-60 cursor-not-allowed transition-all"
            disabled
            title={t('COPY.UNAVAILABLE_THE_SESSION_MANAGEMENT_API_CONTRACT_IS_NOT_SUPPLIED')}
            aria-label={t('COPY.UNAVAILABLE_THE_SESSION_MANAGEMENT_API_CONTRACT_IS_NOT_SUPPLIED')}
            data-testid={`superadmin-security-user-sessions-revoke-unavailable-${params.data.id}`}
          >
            <LogOut size={12} className="text-rose-400" aria-hidden="true" />
            <span>{t('COPY.KILL_SESSION')}</span>
          </button>
        ) : (
          <span className="text-slate-500 text-xs font-semibold">{t('COPY.REVOKED')}</span>
        ),
    },
  ], [t]);

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      {/* Notice Callout */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200 backdrop-blur-md" role="status">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
        <p className="min-w-0 flex-1 leading-relaxed">
          {t('COPY.USER_AND_SESSION_RECORDS_ARE_ILLUSTRATIVE_IN_MEMORY_SAMPLE_DATA_PROVISIONING_STATUS_CHANGES_RBAC_WRITES_PASSWORD_RESETS_AND_SESSION_REVOCATION_REQUIRE_VERIFIED_HOST_API_CONTRACTS_AND_DO_NOT_CHANGE_SERVER_STATE_HERE')}
        </p>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/60 p-5 sm:p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>{t('COPY.LIBRARY_OS')}</span>
              <span>/</span>
              <span>{t('COPY.SUPER_ADMIN')}</span>
              <span>/</span>
              <span className="text-indigo-400">Security</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
                <Users size={24} aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                {t('COPY.ACTIVE_SESSIONS_AUDIT')}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Monitoring
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-bold text-indigo-300">
              <Activity size={15} className="text-indigo-400" aria-hidden="true" />
              <span>{activeSessions} Active</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300">
              <UserX size={15} className="text-rose-400" aria-hidden="true" />
              <span>{revokedSessions} Revoked</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <article className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-transparent bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tracked</span>
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Users size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-100 tabular-nums">{totalSessions}</p>
        </article>

        <article className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-transparent bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Concurrency</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Activity size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-100 tabular-nums">{activeSessions}</p>
        </article>

        <article className="rounded-2xl border border-rose-500/20 bg-gradient-to-b from-rose-500/10 to-transparent bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Revoked Sessions</span>
            <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <UserX size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-100 tabular-nums">{revokedSessions}</p>
        </article>
      </section>

      {/* Semantic Table Container */}
      <section className="rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md shadow-sm overflow-hidden flex flex-col" aria-labelledby="superadmin-security-user-sessions-title">
        <div className="p-4 sm:p-5 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 id="superadmin-security-user-sessions-title" className="text-base font-bold text-slate-100">
              {t('COPY.ACTIVE_SESSIONS_AUDIT')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {t('COPY.MONITOR_ACTIVE_USER_SESSIONS_AND_FORCEFULLY_REVOKE_ACCESS_IF_NECESSARY')}
            </p>
          </div>
          <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full self-start sm:self-auto font-medium">
            {t('COPY.UNAVAILABLE_THE_SESSION_MANAGEMENT_API_CONTRACT_IS_NOT_SUPPLIED')}
          </span>
        </div>

        <div className="flex-1 overflow-x-auto">
          <SuperadminSecurityUserSessionsSemanticTable<SuperadminSessionData>
            rowData={SUPERADMIN_USERS_INITIAL_SESSIONS}
            columnDefs={sessionColumns}
            headerHeight={48}
            rowHeight={56}
            suppressCellFocus={false}
            pagination
            paginationPageSize={10}
            getRowId={(params) => params.data.id}
          />
        </div>
      </section>
    </div>
  );
}
