'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_users/users_directory/config/superadmin_users_directory.url_config.ts';
import { maskSensitiveData } from '@/app/frontend_superadmin/superadmin_users/users_directory/utils/SuperadminUsersDirectoryMaskSensitiveData';
import { toast } from 'sonner';
/** Responsibility: renders the superadmin_users overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminUsersDirectoryPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import type { SemanticCellParams as ICellRendererParams } from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectorySemanticTable';

import { useCallback, useState, useMemo } from 'react';
import type { SuperadminUserData, SuperadminSessionData, SuperadminUsersStatus } from '@/app/frontend_superadmin/superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes';
import type { SuperadminUsersFormValues } from '@/app/frontend_superadmin/superadmin_users/users_directory/schemas/SuperadminUsersDirectorySchema';
import { SUPERADMIN_USERS_INITIAL_USERS, SUPERADMIN_USERS_INITIAL_SESSIONS, SUPERADMIN_USERS_ROLE_PERMISSIONS } from '@/app/frontend_superadmin/superadmin_users/users_directory/mocks/fixtures/SuperadminUsersDirectoryMockFixtures';
import SuperadminUsersDirectoryContent from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectoryContent';
import SuperadminUsersDirectoryModal from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectoryModal';
import { Plus, ShieldCheck, ShieldAlert, Download, Smartphone, Monitor, Globe, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';
import type { SemanticColumnDef as ColDef } from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectorySemanticTable';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_USERS_TABS } from '@/app/frontend_superadmin/superadmin_users/users_directory/constants/SuperadminUsersDirectoryConstants';
import { SUPERADMIN_USERS_OVERVIEW_PAGE_CLIENT_COLUMNS } from '@/app/frontend_superadmin/superadmin_users/users_directory/constants/SuperadminUsersDirectoryStaticConstants';
/** Derives a stable, non-index row identity for repeated interactive table controls. */
function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

/**
 * Renders the `superadmin_users` view owned by `SuperadminUsersDirectoryPageClient`.
 * Owns local UI state for `activeTab`, `users`, `sessions`, `showModal`, `editUser`, and related form/selection state; preview feedback uses deduplicated Sonner messages.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminUsersDirectoryPageClient() {
  const t = useTranslations('SUPERADMIN_USERS');
  
  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
    "All Users": SUPERADMIN_NAVIGATION_ROUTES.users_directory,
    "Roles & Permissions": SUPERADMIN_NAVIGATION_ROUTES.users_roles_permissions,
    "User Sessions": SUPERADMIN_NAVIGATION_ROUTES.security_user_sessions
    };
    const route = routes[key];
    if (route) { const target = new URL(route, window.location.origin); const query = new URLSearchParams(window.location.search); query.delete('view'); query.forEach((value, key) => { if (!target.searchParams.has(key)) target.searchParams.append(key, value); }); window.location.assign(target.pathname + target.search + target.hash); }
  };
const [activeTab] = useState<'All Users' | 'Roles & Permissions' | 'User Sessions'>('All Users');
  const [users] = useState<SuperadminUserData[]>(SUPERADMIN_USERS_INITIAL_USERS);
  const [sessions, setSessions] = useState<SuperadminSessionData[]>(SUPERADMIN_USERS_INITIAL_SESSIONS);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<SuperadminUserData | null>(null);
  const showToast = useCallback((msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_users:SuperadminUsersDirectoryPageClient:feedback' }); }, []);

  const handleOpenAdd = useCallback(() => {
    setEditUser(null);
    setShowModal(true);
  }, []);

  const handleOpenEdit = useCallback((user: SuperadminUserData) => {
    setEditUser(user);
    setShowModal(true);
  }, []);

  const handleSave = useCallback((_formData: SuperadminUsersFormValues) => {
    // Keep the validated editor available for review, but never imply that a user write succeeded.
    showToast(t("COPY.UNAVAILABLE_NO_RBAC_WRITE_API_CONTRACT_IS_SUPPLIED"));
  }, [showToast, t]);

  const toggleStatus = useCallback((_id: string, _current: SuperadminUsersStatus) => {
    // Status changes require a verified RBAC write contract; preserve the fixture unchanged.
    showToast(t("COPY.UNAVAILABLE_NO_RBAC_WRITE_API_CONTRACT_IS_SUPPLIED"));
  }, [showToast, t]);

  const handleExportUsers = useCallback(() => {
    
    const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [
      ['DATA CLASSIFICATION: SAMPLE PREVIEW — NOT LIVE USER DATA', ...Array(SUPERADMIN_USERS_OVERVIEW_PAGE_CLIENT_COLUMNS.length - 1).fill('')].map(csvCell).join(','),
      SUPERADMIN_USERS_OVERVIEW_PAGE_CLIENT_COLUMNS.map(csvCell).join(','),
      ...users.map((user) => SUPERADMIN_USERS_OVERVIEW_PAGE_CLIENT_COLUMNS.map((column) => csvCell(column === 'email' ? maskSensitiveData(String(user[column] ?? '')) : user[column])).join(',')),
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'superadmin_sample_users_preview.csv';
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(t("COPY.DOWNLOADED_A_SAMPLE_PREVIEW_CSV_ONLY_THIS_IS_NOT_A_LIVE_USER_EXPORT"));
  }, [users, showToast, t]);

  const handleResetPassword = useCallback((name: string) => {
    showToast(t("COPY.PASSWORD_RESET_UNAVAILABLE_FOR_USER", { name }));
  }, [showToast, t]);

  const handleRevokeSession = useCallback((id: string) => {
    showToast(t("COPY.SESSION_REVOCATION_UNAVAILABLE", { id }));
  }, [showToast, t]);

  

  const userCols = useMemo<ColDef<SuperadminUserData>[]>(() => [
    { 
      field: 'name', headerName: t("COPY.TABLE_COLUMN_NAME"), flex: 1.2, cellClass: 'sa-cell-primary-bold',
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => {
        const name = p.value ?? '';
        return (
        <div className="flex items-center gap-2 h-full">
          <div className="sa-avatar-cell">{name.charAt(0)}</div>
          <div className="flex flex-col leading-tight">
            <span>{name}</span>
            <span className="text-xs text-secondary font-normal">{p.data?.username ?? ''}</span>
          </div>
        </div>
        );
      }
    },
    { field: 'email', headerName: t("COPY.TABLE_COLUMN_EMAIL"), flex: 1.2, cellClass: 'sa-cell-muted', cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => <span>{maskSensitiveData(String(p.value ?? ''))}</span> },
    { 
      field: 'role', headerName: t("COPY.TABLE_COLUMN_ROLE"), flex: 0.8,
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          p.value === 'SuperAdmin' ? 'bg-info-bg text-info border border-border' : 
          p.value === 'Admin' ? 'bg-success-bg text-success border border-border' : 
          'bg-warning-bg text-warning border border-border'
        }`}>
          {p.value === 'SuperAdmin' ? t("COPY.ROLE_SUPERADMIN_SYSTEM") : p.value === 'Admin' ? t("COPY.ROLE_ADMIN_TENANT_OWNER") : t("COPY.ROLE_MANAGER_STAFF")}
        </span>
      )
    },
    { field: 'branch', headerName: t("COPY.TABLE_COLUMN_BRANCH_TENANT"), flex: 1, cellClass: 'sa-cell-muted' },
    { 
      field: 'twoFactor', headerName: t("COPY.TABLE_COLUMN_2FA"), flex: 0.6,
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, boolean>) => (
        <span className="inline-flex items-center gap-1">
          <span className="sr-only">{t("COPY.TWO_FACTOR_AUTHENTICATION")} {p.value ? t("COPY.TWO_FACTOR_ENABLED") : t("COPY.TWO_FACTOR_DISABLED")}</span>
          {p.value ? <ShieldCheck aria-hidden="true" size={16} className="text-success mt-2" /> : <ShieldAlert aria-hidden="true" size={16} className="text-danger mt-2" />}
        </span>
      )
    },
    { 
      field: 'status', headerName: t("COPY.TABLE_COLUMN_STATUS"), flex: 0.8,
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${
          p.value === 'Active' ? 'text-success' : 'text-danger'
        }`}>
          {p.value === 'Active' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
          {p.value === 'Active' ? t("COPY.STATUS_ACTIVE") : t("COPY.STATUS_SUSPENDED")}
        </span>
      )
    },
    {
      field: 'lastLogin', headerName: t("COPY.TABLE_COLUMN_LAST_LOGIN"), flex: 1, cellClass: 'sa-cell-muted-sm',
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => (
        <span>{p.value === 'Never' ? t('COPY.NEVER') : p.value ?? ''}</span>
      ),
    },
    {
      headerName: t("COPY.TABLE_COLUMN_ACTIONS"), flex: 1.2,
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, unknown>) => (
        p.data ? <div className="flex items-center gap-3 h-full">
          <button type="button" onClick={() => handleOpenEdit(p.data!)} className="text-info hover:text-info font-medium text-xs" data-testid={`superadmin-users-users-overview-edit-1-${getSuperadminInteractiveTestIdSuffix(p.data)}`}>{t("COPY.EDIT")}</button>
          <button type="button" onClick={() => toggleStatus(p.data.id, p.data.status)} className="text-warning hover:text-warning font-medium text-xs" data-testid={`superadmin-users-users-overview-action-suspend-2-${getSuperadminInteractiveTestIdSuffix(p.data)}`}>
            {p.data.status === 'Active' ? t('COPY.ACTION_SUSPEND') : t('COPY.ACTION_ACTIVATE')}
          </button>
          <button type="button" onClick={() => handleResetPassword(p.data.name)} className="text-info hover:text-info font-medium text-xs" data-testid={`superadmin-users-users-overview-reset-pwd-3-${getSuperadminInteractiveTestIdSuffix(p.data)}`}>{t("COPY.RESET_PWD")}</button>
        </div> : null
      )
    }
  ], [t, handleOpenEdit, toggleStatus, handleResetPassword]);

  const sessionCols = useMemo<ColDef<SuperadminSessionData>[]>(() => [
    { field: 'user', headerName: t("COPY.TABLE_COLUMN_USER"), flex: 1, cellClass: 'sa-cell-primary-bold' },
    { 
      field: 'device', headerName: t("COPY.TABLE_COLUMN_DEVICE_BROWSER"), flex: 1.5, cellClass: 'sa-cell-muted',
      cellRenderer: (p: ICellRendererParams<SuperadminSessionData, string>) => (
        <div className="flex items-center gap-2 h-full">
          {(p.value ?? '').includes('Mac') || (p.value ?? '').includes('Windows') ? <Monitor size={14} className="text-secondary" /> : <Smartphone size={14} className="text-secondary" />}
          <span>{p.value ?? ''}</span>
        </div>
      )
    },
    { field: 'ip', headerName: t("COPY.TABLE_COLUMN_IP_ADDRESS"), flex: 1, cellClass: 'sa-cell-muted-sm font-mono' },
    { 
      field: 'location', headerName: t("COPY.TABLE_COLUMN_LOCATION"), flex: 1, cellClass: 'sa-cell-muted',
      cellRenderer: (p: ICellRendererParams<SuperadminSessionData, string>) => (
        <div className="flex items-center gap-2 h-full">
          <Globe size={14} className="text-secondary" /> <span>{p.value ?? ''}</span>
        </div>
      )
    },
    { field: 'lastActive', headerName: t("COPY.TABLE_COLUMN_LAST_ACTIVE"), flex: 1, cellClass: 'sa-cell-muted' },
    {
      field: 'status', headerName: t("COPY.TABLE_COLUMN_STATUS"), flex: 0.8,
      cellRenderer: (p: ICellRendererParams<SuperadminSessionData, string>) => (
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
          p.value === 'Active' ? 'text-success bg-success-bg' : 'text-danger bg-danger-bg'
        }`}>
          {p.value === 'Active' ? t("COPY.STATUS_ACTIVE") : t("COPY.STATUS_REVOKED")}
        </span>
      )
    },
    {
      headerName: t("COPY.TABLE_COLUMN_ACTION"), flex: 1,
      cellRenderer: (p: ICellRendererParams<SuperadminSessionData, unknown>) => (
        p.data?.status === 'Active' && p.data ? (
          <button type="button" onClick={() => handleRevokeSession(p.data.id)} className="sa-btn-ghost sa-btn-ghost--sm text-danger border-border px-2 py-1 h-auto text-xs flex items-center gap-1 mt-1.5" data-testid={`superadmin-users-users-overview-kill-session-4-${getSuperadminInteractiveTestIdSuffix(p.data)}`}>
            <LogOut size={12} /> {t("COPY.KILL_SESSION")}
          </button>
        ) : <span className="text-secondary text-xs mt-2 block">{t("COPY.REVOKED")}</span>
      )
    }
  ], [t, handleRevokeSession]);

  return (
    <div className="sa-page-animate">
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>{t("COPY.LIBRARY_OS")}</span><span>/</span><span>{t("COPY.SUPER_ADMIN")}</span><span>/</span><span>{t("COPY.USERS_ACCESS")}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">{t("COPY.USERS_ACCESS_CONTROL")}</h1>
          <div className="flex items-center gap-3">
            <button className="sa-btn-secondary" onClick={handleExportUsers} type="button" data-testid="superadmin-users-users-overview-export-sample-users-csv-5">
              <Download size={16} className="text-secondary" /> {t("COPY.EXPORT_SAMPLE_USERS_CSV")}
            </button>
            <button type="button" onClick={handleOpenAdd} className="sa-btn-primary" data-testid="superadmin-users-users-overview-add-user-6">
              <Plus size={16} /> {t("COPY.ADD_USER")}
            </button>
          </div>
        </div>
      </div>

      <p className="mb-5 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{t("COPY.USER_AND_SESSION_RECORDS_ARE_ILLUSTRATIVE_IN_MEMORY_SAMPLE_DATA_PROVISIONING_STATUS_CHANGES_RBAC_WRITES_PASSWORD_RESETS_AND_SESSION_REVOCATION_REQUIRE_VERIFIED_HOST_API_CONTRACTS_AND_DO_NOT_CHANGE_SERVER_STATE_HERE")}</p>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-2" role="navigation" aria-label={t("COPY.USER_ACCESS_VIEWS")}  data-testid="superadmin-superadmin-users-overview-page-client-div-line-228">
        {SUPERADMIN_USERS_TABS.map((tab) => (
          <button
            key={tab.name}
            id={`superadmin-users-tab-${tab.name.toLowerCase().replace(/[^a-z]+/g, '-')}`}
            type="button"
            aria-current={activeTab === tab.name ? 'page' : undefined}
            aria-controls="superadmin-users-tabpanel"
            onClick={() => navigateToWorkflow(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold motion-safe:transition-all motion-reduce:transition-none ${
              activeTab === tab.name 
                ? 'bg-info-bg text-primary border border-border shadow-card' 
                : 'text-secondary hover:bg-surface-hover hover:text-primary'
            }`}
           data-testid={`superadmin-users-users-overview-set-active-tab-7-${String(tab.name)}`}>
            <tab.icon size={16} aria-hidden="true" /> {t(tab.labelKey)}
          </button>
        ))}
      </div>

      <div id="superadmin-users-tabpanel"  aria-labelledby={`superadmin-users-tab-${activeTab.toLowerCase().replace(/[^a-z]+/g, '-')}`} tabIndex={0}>
      <SuperadminUsersDirectoryContent
        activeTab={activeTab}
        users={users}
        userCols={userCols}
        sessions={sessions}
        sessionCols={sessionCols}
        rolePermissions={SUPERADMIN_USERS_ROLE_PERMISSIONS}
      />
      </div>

      <SuperadminUsersDirectoryModal
        showModal={showModal}
        editUser={editUser}
        onClose={() => setShowModal(false)}
        handleSave={handleSave}
      />

      {/* Toast */}
    </div>
  );
}
