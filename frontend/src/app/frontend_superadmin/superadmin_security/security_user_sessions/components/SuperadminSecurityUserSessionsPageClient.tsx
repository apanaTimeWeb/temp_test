'use client';
/** Responsibility: renders only the canonical security user-sessions route; user-directory and role-management UI live in their own route leaves. */
/** Data-Flow: canonical route -> local demonstration session fixtures -> read-only semantic table; revocation is disabled until a verified host API contract exists. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/config/superadmin_security_user_sessions.url_config.ts';
import { useMemo } from 'react';
import { Globe, LogOut, Monitor, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_USERS_INITIAL_SESSIONS } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/mocks/fixtures/SuperadminSecurityUserSessionsMockFixtures';
import SuperadminSecurityUserSessionsSemanticTable from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/components/SuperadminSecurityUserSessionsSemanticTable';
import type { SemanticCellParams, SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/types/SuperadminSecurityUserSessionsSemanticTableTypes';
import type { SuperadminSessionData } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/types/SuperadminSecurityUserSessionsTypes';
import { SUPERADMIN_USERS_TABS } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/constants/SuperadminSecurityUserSessionsConstants';

export default function SuperadminSecurityUserSessionsPageClient() {
  const t = useTranslations('SUPERADMIN_USERS');
  const routes: Record<string, string> = {
    'All Users': SUPERADMIN_NAVIGATION_ROUTES.users_directory,
    'Roles & Permissions': SUPERADMIN_NAVIGATION_ROUTES.users_roles_permissions,
    'User Sessions': SUPERADMIN_NAVIGATION_ROUTES.security_user_sessions,
  };

  const sessionColumns = useMemo<SemanticColumnDef<SuperadminSessionData>[]>(() => [
    { field: 'user', headerName: t('COPY.TABLE_COLUMN_USER'), flex: 1, cellClass: 'sa-cell-primary-bold' },
    {
      field: 'device', headerName: t('COPY.TABLE_COLUMN_DEVICE_BROWSER'), flex: 1.5, cellClass: 'sa-cell-muted',
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => (
        <span className="inline-flex items-center gap-2">{(params.value ?? '').includes('Mac') || (params.value ?? '').includes('Windows') ? <Monitor size={14} aria-hidden="true" /> : <Smartphone size={14} aria-hidden="true" />}<span>{params.value ?? ''}</span></span>
      ),
    },
    { field: 'ip', headerName: t('COPY.TABLE_COLUMN_IP_ADDRESS'), flex: 1, cellClass: 'sa-cell-muted-sm font-mono' },
    {
      field: 'location', headerName: t('COPY.TABLE_COLUMN_LOCATION'), flex: 1, cellClass: 'sa-cell-muted',
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => <span className="inline-flex items-center gap-2"><Globe size={14} aria-hidden="true" />{params.value ?? ''}</span>,
    },
    {
      field: 'lastActive', headerName: t('COPY.TABLE_COLUMN_LAST_ACTIVE'), flex: 1, cellClass: 'sa-cell-muted',
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => {
        switch (params.data.lastActive) {
          case 'JUST_NOW': return t('COPY.SESSION_LAST_ACTIVE_JUST_NOW');
          case 'TWO_HOURS_AGO': return t('COPY.SESSION_LAST_ACTIVE_TWO_HOURS_AGO');
          case 'TEN_MINUTES_AGO': return t('COPY.SESSION_LAST_ACTIVE_TEN_MINUTES_AGO');
          case 'ONE_MONTH_AGO': return t('COPY.SESSION_LAST_ACTIVE_ONE_MONTH_AGO');
        }
      },
    },
    {
      field: 'status', headerName: t('COPY.TABLE_COLUMN_STATUS'), flex: 0.8,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => (
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${params.value === 'Active' ? 'text-success bg-success-bg' : 'text-danger bg-danger-bg'}`}>
          {params.value === 'Active' ? t('COPY.STATUS_ACTIVE') : t('COPY.STATUS_REVOKED')}
        </span>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_ACTION'), flex: 1, sortable: false,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, unknown>) => params.data.status === 'Active' ? (
        <button type="button" className="sa-btn-ghost sa-btn-ghost--sm text-danger border-border px-2 py-1 h-auto text-xs inline-flex items-center gap-1" disabled title={t('COPY.UNAVAILABLE_THE_SESSION_MANAGEMENT_API_CONTRACT_IS_NOT_SUPPLIED')} aria-label={t('COPY.UNAVAILABLE_THE_SESSION_MANAGEMENT_API_CONTRACT_IS_NOT_SUPPLIED')} data-testid={`superadmin-security-user-sessions-revoke-unavailable-${params.data.id}`}>
          <LogOut size={12} aria-hidden="true" />{t('COPY.KILL_SESSION')}
        </button>
      ) : <span className="text-secondary text-xs">{t('COPY.REVOKED')}</span>,
    },
  ], [t]);

  return (
    <div className="sa-page-animate">
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb"><span>{t('COPY.LIBRARY_OS')}</span><span>/</span><span>{t('COPY.SUPER_ADMIN')}</span><span>/</span><span>{t('COPY.USERS_ACCESS')}</span></div>
        <div className="flex items-center justify-between mt-2"><h1 className="sa-page-title">{t('COPY.ACTIVE_SESSIONS_AUDIT')}</h1></div>
      </div>
      <p className="mb-5 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{t('COPY.USER_AND_SESSION_RECORDS_ARE_ILLUSTRATIVE_IN_MEMORY_SAMPLE_DATA_PROVISIONING_STATUS_CHANGES_RBAC_WRITES_PASSWORD_RESETS_AND_SESSION_REVOCATION_REQUIRE_VERIFIED_HOST_API_CONTRACTS_AND_DO_NOT_CHANGE_SERVER_STATE_HERE')}</p>
      <nav className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto" aria-label={t('COPY.USER_ACCESS_VIEWS')}>
        {SUPERADMIN_USERS_TABS.map((tab) => {
          const href = routes[tab.name];
          const isCurrent = tab.name === 'User Sessions';
          return <a key={tab.name} href={href} aria-current={isCurrent ? 'page' : undefined} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${isCurrent ? 'bg-info-bg text-primary border border-border shadow-card' : 'text-secondary hover:bg-surface-hover hover:text-primary'}`} data-testid={`superadmin-security-user-sessions-route-link-${tab.name.toLowerCase().replace(/[^a-z]+/g, '-')}`}><tab.icon size={16} aria-hidden="true" />{t(tab.labelKey)}</a>;
        })}
      </nav>
      <section className="sa-card p-0 overflow-hidden flex flex-col" aria-labelledby="superadmin-security-user-sessions-title">
        <div className="p-4 border-b border-border"><h2 id="superadmin-security-user-sessions-title" className="text-sm font-bold text-primary">{t('COPY.ACTIVE_SESSIONS_AUDIT')}</h2><p className="text-xs text-secondary mt-1">{t('COPY.MONITOR_ACTIVE_USER_SESSIONS_AND_FORCEFULLY_REVOKE_ACCESS_IF_NECESSARY')}</p><p className="text-xs text-warning mt-2">{t('COPY.UNAVAILABLE_THE_SESSION_MANAGEMENT_API_CONTRACT_IS_NOT_SUPPLIED')}</p></div>
        <div className="flex-1"><SuperadminSecurityUserSessionsSemanticTable<SuperadminSessionData> rowData={SUPERADMIN_USERS_INITIAL_SESSIONS} columnDefs={sessionColumns} headerHeight={48} rowHeight={56} suppressCellFocus={false} pagination paginationPageSize={10} getRowId={(params) => params.data.id} /></div>
      </section>
    </div>
  );
}
