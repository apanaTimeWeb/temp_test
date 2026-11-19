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
import { ShieldCheck, ShieldAlert, Download, Smartphone, Monitor, Globe, LogOut, CheckCircle, AlertTriangle, Pencil, Ban, KeyRound, Users, Activity, TrendingUp, Check } from 'lucide-react';
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
  const [sessions] = useState<SuperadminSessionData[]>(SUPERADMIN_USERS_INITIAL_SESSIONS);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<SuperadminUserData | null>(null);
  const showToast = useCallback((msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_users:SuperadminUsersDirectoryPageClient:feedback' }); }, []);

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
      ...users.map((user) => SUPERADMIN_USERS_OVERVIEW_PAGE_CLIENT_COLUMNS.map((column) => csvCell(column === 'email' ? maskSensitiveData(String((user as unknown as Record<string, unknown>)[column] ?? '')) : (user as unknown as Record<string, unknown>)[column])).join(',')),
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
        <div className="flex items-center gap-2.5 h-full">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm ring-2 ring-indigo-500/20 shrink-0">
            {name.charAt(0)}
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="font-semibold text-slate-100 truncate">{name}</span>
            <span className="text-xs text-slate-400 font-normal truncate">{p.data?.username ?? ''}</span>
          </div>
        </div>
        );
      }
    },
    { field: 'email', headerName: t("COPY.TABLE_COLUMN_EMAIL"), flex: 1.2, cellClass: 'sa-cell-muted', cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => <span className="text-slate-300 text-xs sm:text-sm font-mono">{maskSensitiveData(String(p.value ?? ''))}</span> },
    { 
      field: 'role', headerName: t("COPY.TABLE_COLUMN_ROLE"), flex: 0.8,
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          p.value === 'SuperAdmin' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' : 
          p.value === 'Admin' ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' : 
          'bg-sky-500/15 text-sky-300 border-sky-500/30'
        }`}>
          {p.value === 'SuperAdmin' ? t("COPY.ROLE_SUPERADMIN_SYSTEM") : p.value === 'Admin' ? t("COPY.ROLE_ADMIN_TENANT_OWNER") : t("COPY.ROLE_MANAGER_STAFF")}
        </span>
      )
    },
    { field: 'branch', headerName: t("COPY.TABLE_COLUMN_BRANCH_TENANT"), flex: 1, cellClass: 'sa-cell-muted', cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => <span className="text-slate-300 text-xs sm:text-sm">{p.value ?? ''}</span> },
    { 
      field: 'twoFactor', headerName: t("COPY.TABLE_COLUMN_2FA"), flex: 0.6,
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, boolean>) => (
        <span className="inline-flex items-center gap-1">
          <span className="sr-only">{t("COPY.TWO_FACTOR_AUTHENTICATION")} {p.value ? t("COPY.TWO_FACTOR_ENABLED") : t("COPY.TWO_FACTOR_DISABLED")}</span>
          {p.value ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
              <ShieldCheck aria-hidden="true" size={16} />
              <span>ON</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-medium">
              <ShieldAlert aria-hidden="true" size={16} />
              <span>OFF</span>
            </span>
          )}
        </span>
      )
    },
    { 
      field: 'status', headerName: t("COPY.TABLE_COLUMN_STATUS"), flex: 0.8,
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          p.value === 'Active' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${p.value === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
          {p.value === 'Active' ? t("COPY.STATUS_ACTIVE") : t("COPY.STATUS_SUSPENDED")}
        </span>
      )
    },
    {
      field: 'lastLogin', headerName: t("COPY.TABLE_COLUMN_LAST_LOGIN"), flex: 1, cellClass: 'sa-cell-muted-sm',
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => (
        <span className="text-slate-400 text-xs">{p.value === 'Never' ? t('COPY.NEVER') : p.value ?? ''}</span>
      ),
    },
    {
      headerName: t("COPY.TABLE_COLUMN_ACTIONS"), flex: 1.2,
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, unknown>) => (
        p.data ? <div className="flex items-center gap-2 h-full flex-wrap">
          <button
            type="button"
            onClick={() => handleOpenEdit(p.data!)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold cursor-pointer transition-colors"
            data-testid={`superadmin-users-users-overview-edit-1-${getSuperadminInteractiveTestIdSuffix(p.data)}`}
          >
            <Pencil size={12} className="text-emerald-400" />
            <span>{t("COPY.EDIT")}</span>
          </button>
          <button
            type="button"
            onClick={() => toggleStatus(p.data.id, p.data.status)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold cursor-pointer transition-colors"
            data-testid={`superadmin-users-users-overview-action-suspend-2-${getSuperadminInteractiveTestIdSuffix(p.data)}`}
          >
            {p.data.status === 'Active' ? <Ban size={12} className="text-amber-400" /> : <Check size={12} className="text-emerald-400" />}
            <span>{p.data.status === 'Active' ? t('COPY.ACTION_SUSPEND') : t('COPY.ACTION_ACTIVATE')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleResetPassword(p.data.name)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold cursor-pointer transition-colors"
            data-testid={`superadmin-users-users-overview-reset-pwd-3-${getSuperadminInteractiveTestIdSuffix(p.data)}`}
          >
            <KeyRound size={12} className="text-indigo-400" />
            <span>{t("COPY.RESET_PWD")}</span>
          </button>
        </div> : null
      )
    }
  ], [t, handleOpenEdit, toggleStatus, handleResetPassword]);

  const sessionCols = useMemo<ColDef<SuperadminSessionData>[]>(() => [
    { field: 'user', headerName: t("COPY.TABLE_COLUMN_USER"), flex: 1, cellClass: 'sa-cell-primary-bold', cellRenderer: (p: ICellRendererParams<SuperadminSessionData, string>) => <span className="font-semibold text-slate-100">{p.value ?? ''}</span> },
    { 
      field: 'device', headerName: t("COPY.TABLE_COLUMN_DEVICE_BROWSER"), flex: 1.5, cellClass: 'sa-cell-muted',
      cellRenderer: (p: ICellRendererParams<SuperadminSessionData, string>) => (
        <div className="flex items-center gap-2 h-full text-slate-300">
          {(p.value ?? '').includes('Mac') || (p.value ?? '').includes('Windows') ? <Monitor size={14} className="text-indigo-400" /> : <Smartphone size={14} className="text-indigo-400" />}
          <span>{p.value ?? ''}</span>
        </div>
      )
    },
    { field: 'ip', headerName: t("COPY.TABLE_COLUMN_IP_ADDRESS"), flex: 1, cellClass: 'sa-cell-muted-sm font-mono', cellRenderer: (p: ICellRendererParams<SuperadminSessionData, string>) => <span className="font-mono text-slate-400 text-xs">{p.value ?? ''}</span> },
    { 
      field: 'location', headerName: t("COPY.TABLE_COLUMN_LOCATION"), flex: 1, cellClass: 'sa-cell-muted',
      cellRenderer: (p: ICellRendererParams<SuperadminSessionData, string>) => (
        <div className="flex items-center gap-2 h-full text-slate-300">
          <Globe size={14} className="text-sky-400" /> <span>{p.value ?? ''}</span>
        </div>
      )
    },
    { field: 'lastActive', headerName: t("COPY.TABLE_COLUMN_LAST_ACTIVE"), flex: 1, cellClass: 'sa-cell-muted', cellRenderer: (p: ICellRendererParams<SuperadminSessionData, string>) => <span className="text-slate-400 text-xs">{p.value ?? ''}</span> },
    {
      field: 'status', headerName: t("COPY.TABLE_COLUMN_STATUS"), flex: 0.8,
      cellRenderer: (p: ICellRendererParams<SuperadminSessionData, string>) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          p.value === 'Active' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${p.value === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
          {p.value === 'Active' ? t("COPY.STATUS_ACTIVE") : t("COPY.STATUS_REVOKED")}
        </span>
      )
    },
    {
      headerName: t("COPY.TABLE_COLUMN_ACTION"), flex: 1,
      cellRenderer: (p: ICellRendererParams<SuperadminSessionData, unknown>) => (
        p.data?.status === 'Active' && p.data ? (
          <button
            type="button"
            onClick={() => handleRevokeSession(p.data.id)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold cursor-pointer transition-colors"
            data-testid={`superadmin-users-users-overview-kill-session-4-${getSuperadminInteractiveTestIdSuffix(p.data)}`}
          >
            <LogOut size={12} className="text-rose-400" />
            <span>{t("COPY.KILL_SESSION")}</span>
          </button>
        ) : <span className="text-slate-500 text-xs">{t("COPY.REVOKED")}</span>
      )
    }
  ], [t, handleRevokeSession]);

  const activeCount = users.filter((u) => u.status === 'Active').length;
  const twoFactorCount = users.filter((u) => u.twoFactor).length;

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
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">{t("COPY.USERS_ACCESS_CONTROL")}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>RBAC Active</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{t("COPY.USERS_OVERVIEW_SUMMARY")}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            onClick={handleExportUsers}
            type="button"
            data-testid="superadmin-users-users-overview-export-sample-users-csv-5"
          >
            <Download size={15} className="text-indigo-400" />
            <span>{t("COPY.EXPORT_SAMPLE_USERS_CSV")}</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" aria-label={t("COPY.USERS_OVERVIEW_SUMMARY")}>
        {/* KPI 1: Total Users (Indigo) */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-card/90 to-card p-5 shadow-sm transition-all hover:border-indigo-500/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300/80 uppercase tracking-wider">{t("COPY.TABLE_COLUMN_USER")}</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tabular-nums">{users.length}</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-400">
              <TrendingUp size={12} />
              +8%
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-indigo-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* KPI 2: Active Accounts (Emerald) */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-card/90 to-card p-5 shadow-sm transition-all hover:border-emerald-500/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300/80 uppercase tracking-wider">{t("COPY.ACTIVE_USER_COUNT")}</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <CheckCircle size={18} />
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

        {/* KPI 3: 2FA Protected (Sky) */}
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/40 via-card/90 to-card p-5 shadow-sm transition-all hover:border-sky-500/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-300/80 uppercase tracking-wider">{t("COPY.TWO_FACTOR_ENABLED_COUNT")}</span>
            <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tabular-nums">{twoFactorCount}</span>
            <span className="text-xs text-sky-400 font-medium">
              {Math.round((twoFactorCount / Math.max(1, users.length)) * 100)}% Enforced
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-sky-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full" style={{ width: `${(twoFactorCount / Math.max(1, users.length)) * 100}%` }} />
          </div>
        </div>

        {/* KPI 4: Active Sessions (Amber) */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-card/90 to-card p-5 shadow-sm transition-all hover:border-amber-500/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider">{t("COPY.SESSION_COUNT")}</span>
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tabular-nums">{sessions.length}</span>
            <span className="text-xs text-amber-400 font-medium">Concurrent</span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-amber-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: '70%' }} />
          </div>
        </div>
      </section>

      {/* Warning banner */}
      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs sm:text-sm text-amber-300 flex items-start gap-2.5" role="status">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <span>{t("COPY.USER_AND_SESSION_RECORDS_ARE_ILLUSTRATIVE_IN_MEMORY_SAMPLE_DATA_PROVISIONING_STATUS_CHANGES_RBAC_WRITES_PASSWORD_RESETS_AND_SESSION_REVOCATION_REQUIRE_VERIFIED_HOST_API_CONTRACTS_AND_DO_NOT_CHANGE_SERVER_STATE_HERE")}</span>
      </p>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2 overflow-x-auto" role="navigation" aria-label={t("COPY.USER_ACCESS_VIEWS")} data-testid="superadmin-superadmin-users-overview-page-client-div-line-228">
        {SUPERADMIN_USERS_TABS.map((tab) => {
          const active = activeTab === tab.name;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.name}
              id={`superadmin-users-tab-${tab.name.toLowerCase().replace(/[^a-z]+/g, '-')}`}
              type="button"
              aria-current={active ? 'page' : undefined}
              aria-controls="superadmin-users-tabpanel"
              onClick={() => navigateToWorkflow(tab.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                active 
                  ? 'border border-indigo-400 bg-indigo-500/10 text-indigo-300 shadow-xs' 
                  : 'text-slate-400 hover:bg-surface-hover hover:text-slate-200'
              }`}
              data-testid={`superadmin-users-users-overview-set-active-tab-7-${String(tab.name)}`}
            >
              <TabIcon size={15} aria-hidden="true" className={active ? 'text-indigo-400' : 'text-slate-400'} />
              <span>{t(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>

      <div id="superadmin-users-tabpanel" aria-labelledby={`superadmin-users-tab-${activeTab.toLowerCase().replace(/[^a-z]+/g, '-')}`} tabIndex={0}>
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
    </div>
  );
}
