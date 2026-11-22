'use client';

import { maskSensitiveData } from '@/app/frontend_superadmin/superadmin_users/users_directory/utils/SuperadminUsersDirectoryMaskSensitiveData';
import { toast } from 'sonner';
/** Responsibility: renders the superadmin_users overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminUsersDirectoryPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import type { SemanticCellParams as ICellRendererParams } from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectorySemanticTable';

import { useCallback, useState, useMemo } from 'react';
import type { SuperadminUserData, SuperadminUsersStatus } from '@/app/frontend_superadmin/superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes';
import type { SuperadminUsersFormValues } from '@/app/frontend_superadmin/superadmin_users/users_directory/schemas/SuperadminUsersDirectorySchema';
import { SUPERADMIN_USERS_INITIAL_USERS, SUPERADMIN_USERS_ROLE_PERMISSIONS } from '@/app/frontend_superadmin/superadmin_users/users_directory/mocks/fixtures/SuperadminUsersDirectoryMockFixtures';
import SuperadminUsersDirectoryContent from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectoryContent';
import SuperadminUsersDirectoryModal from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectoryModal';
import SuperadminUsersBulkWhatsAppModal from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersBulkWhatsAppModal';
import {
  downloadSuperadminUsersCsv,
  downloadSuperadminUsersExcel,
  printSuperadminUsersRoster,
} from '@/app/frontend_superadmin/superadmin_users/users_directory/utils/SuperadminUsersDirectoryExportUtils';
import { ShieldCheck, ShieldAlert, Download, CheckCircle, AlertTriangle, Pencil, Ban, KeyRound, Users, TrendingUp, Check, Search, X, Filter, RotateCcw, FileSpreadsheet, Printer, MessageSquare, Mail, UserPlus } from 'lucide-react';
import type { SemanticColumnDef as ColDef } from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectorySemanticTable';
import { useTranslations } from 'next-intl';
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
 * Owns local UI state for `users`, search, filters, export, modals, and row action controls.
 */
export default function SuperadminUsersDirectoryPageClient() {
  const t = useTranslations('SUPERADMIN_USERS');

  const [activeTab] = useState<'All Users' | 'Roles & Permissions'>('All Users');
  const [users, setUsers] = useState<SuperadminUserData[]>(SUPERADMIN_USERS_INITIAL_USERS);
  const [showModal, setShowModal] = useState(false);
  const [showBulkWhatsApp, setShowBulkWhatsApp] = useState(false);
  const [editUser, setEditUser] = useState<SuperadminUserData | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'SuperAdmin' | 'Admin' | 'Manager'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Suspended'>('all');
  const [twoFactorFilter, setTwoFactorFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');

  const showToast = useCallback((msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_users:SuperadminUsersDirectoryPageClient:feedback' });
  }, []);

  const handleOpenEdit = useCallback((user: SuperadminUserData) => {
    setEditUser(user);
    setShowModal(true);
  }, []);

  const handleSave = useCallback((formData: SuperadminUsersFormValues) => {
    if (editUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? { ...u, ...formData } : u))
      );
      showToast(`User ${formData.name} updated successfully!`);
    } else {
      const newUser: SuperadminUserData = {
        id: `usr-${Date.now()}`,
        name: formData.name,
        username: formData.username || formData.email.split('@')[0],
        email: formData.email,
        role: formData.role,
        branch: formData.branch || 'Headquarters Central',
        twoFactor: formData.twoFactor ?? false,
        status: 'Active',
        lastLogin: 'Never',
        phone: '+91 98765 43210',
      };
      setUsers((prev) => [newUser, ...prev]);
      showToast(`User invitation created and sent to ${formData.email}!`);
    }
    setShowModal(false);
    setEditUser(null);
  }, [editUser, showToast]);

  const toggleStatus = useCallback((id: string, current: SuperadminUsersStatus) => {
    const nextStatus: SuperadminUsersStatus = current === 'Active' ? 'Suspended' : 'Active';
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    );
    showToast(`Account status updated to ${nextStatus}.`);
  }, [showToast]);

  const handleResetPassword = useCallback((name: string) => {
    showToast(`Password reset link dispatched for ${name} successfully!`);
  }, [showToast]);

  // Quick WhatsApp for single user
  const handleQuickWhatsApp = useCallback((user: SuperadminUserData) => {
    const rawPhone = user.phone || '9876543210';
    let digits = rawPhone.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
    const phone = digits.length === 10 ? `91${digits}` : digits;
    const msg = `Hello ${user.name}, greetings from Smart Library SuperAdmin!`;
    const popup = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    showToast(`Opened WhatsApp chat for ${user.name}`);
  }, [showToast]);

  // Available unique branches for dropdown
  const availableBranches = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      if (u.branch) set.add(u.branch);
    });
    return Array.from(set);
  }, [users]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Role Filter
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;
      // Status Filter
      if (statusFilter !== 'all' && user.status !== statusFilter) return false;
      // 2FA Filter
      if (twoFactorFilter === 'enabled' && !user.twoFactor) return false;
      if (twoFactorFilter === 'disabled' && user.twoFactor) return false;
      // Branch Filter
      if (branchFilter !== 'all' && user.branch.toLowerCase() !== branchFilter.toLowerCase()) return false;
      // Search Query
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchesName = user.name.toLowerCase().includes(q);
        const matchesUsername = user.username.toLowerCase().includes(q);
        const matchesEmail = user.email.toLowerCase().includes(q);
        const matchesBranch = user.branch.toLowerCase().includes(q);
        const matchesRole = user.role.toLowerCase().includes(q);
        const matchesPhone = user.phone ? user.phone.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesUsername && !matchesEmail && !matchesBranch && !matchesRole && !matchesPhone) {
          return false;
        }
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, twoFactorFilter, branchFilter, searchQuery]);

  const hasActiveFilters = Boolean(
    searchQuery || roleFilter !== 'all' || statusFilter !== 'all' || twoFactorFilter !== 'all' || branchFilter !== 'all'
  );

  const resetAllFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    setTwoFactorFilter('all');
    setBranchFilter('all');
  };

  // Export handlers
  const handleExportUsers = useCallback(() => {
    const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [
      ['DATA CLASSIFICATION: SAMPLE PREVIEW — NOT LIVE USER DATA', ...Array(SUPERADMIN_USERS_OVERVIEW_PAGE_CLIENT_COLUMNS.length - 1).fill('')].map(csvCell).join(','),
      SUPERADMIN_USERS_OVERVIEW_PAGE_CLIENT_COLUMNS.map(csvCell).join(','),
      ...filteredUsers.map((user) => SUPERADMIN_USERS_OVERVIEW_PAGE_CLIENT_COLUMNS.map((column) => csvCell(column === 'email' ? maskSensitiveData(String((user as unknown as Record<string, unknown>)[column] ?? '')) : (user as unknown as Record<string, unknown>)[column])).join(',')),
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
  }, [filteredUsers, showToast, t]);

  const handleExportExcel = useCallback(() => {
    downloadSuperadminUsersExcel(filteredUsers, 'superadmin_users_export.xls');
    showToast(`Exported ${filteredUsers.length} user account(s) to Excel (.xls)`);
  }, [filteredUsers, showToast]);

  const handlePrintRoster = useCallback(() => {
    printSuperadminUsersRoster(filteredUsers, 'SuperAdmin User Access Directory');
    showToast(`Prepared ${filteredUsers.length} user account(s) for printing`);
  }, [filteredUsers, showToast]);

  const userCols = useMemo<ColDef<SuperadminUserData>[]>(() => [
    { 
      field: 'name', headerName: t("COPY.TABLE_COLUMN_NAME"), flex: 1.2, minWidth: 180, cellClass: 'sa-cell-primary-bold',
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
    {
      field: 'email', headerName: t("COPY.TABLE_COLUMN_EMAIL"), flex: 1.5, minWidth: 200, cellClass: 'sa-cell-muted',
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => {
        const user = p.data;
        const phone = user?.phone;
        return (
          <div className="flex flex-col justify-center gap-1 leading-tight">
            <span className="text-slate-300 text-xs sm:text-sm font-mono truncate">{maskSensitiveData(String(p.value ?? ''))}</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {phone && (
                <span className="text-[11px] font-mono text-slate-400">{phone}</span>
              )}
              <div className="flex items-center gap-1 ml-auto">
                {user?.email && (
                  <a
                    href={`mailto:${user.email}?subject=${encodeURIComponent('Smart Library SaaS Access Notice')}&body=${encodeURIComponent(`Dear ${user.name},\n\n`)}`}
                    className="p-1 rounded-md border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors"
                    title={`Email ${user.name}`}
                    aria-label={`Email ${user.name}`}
                  >
                    <Mail size={12} className="text-purple-400" />
                  </a>
                )}
                
                {user && (
                  <button
                    type="button"
                    onClick={() => handleQuickWhatsApp(user)}
                    className="p-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                    title={`WhatsApp chat with ${user.name}`}
                    aria-label={`WhatsApp chat with ${user.name}`}
                  >
                    <MessageSquare size={12} className="text-emerald-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }
    },
    { 
      field: 'role', headerName: t("COPY.TABLE_COLUMN_ROLE"), flex: 0.9, minWidth: 120,
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
    { field: 'branch', headerName: t("COPY.TABLE_COLUMN_BRANCH_TENANT"), flex: 1, minWidth: 130, cellClass: 'sa-cell-muted', cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => <span className="text-slate-300 text-xs sm:text-sm font-medium">{p.value ?? ''}</span> },
    { 
      field: 'twoFactor', headerName: t("COPY.TABLE_COLUMN_2FA"), flex: 0.7, minWidth: 90,
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
      field: 'status', headerName: t("COPY.TABLE_COLUMN_STATUS"), flex: 0.8, minWidth: 110,
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
      field: 'lastLogin', headerName: t("COPY.TABLE_COLUMN_LAST_LOGIN"), flex: 1, minWidth: 120, cellClass: 'sa-cell-muted-sm',
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => (
        <span className="text-slate-400 text-xs">{p.value === 'Never' ? t('COPY.NEVER') : p.value ?? ''}</span>
      ),
    },
    {
      headerName: t("COPY.TABLE_COLUMN_ACTIONS"), flex: 1.4, minWidth: 200,
      cellRenderer: (p: ICellRendererParams<SuperadminUserData, unknown>) => (
        p.data ? (
          <div className="flex items-center gap-1.5 h-full flex-wrap">
            <button
              type="button"
              onClick={() => handleOpenEdit(p.data!)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold cursor-pointer transition-colors"
              title="Edit User Permissions"
              data-testid={`superadmin-users-users-overview-edit-1-${getSuperadminInteractiveTestIdSuffix(p.data)}`}
            >
              <Pencil size={12} className="text-emerald-400" />
              <span>{t("COPY.EDIT")}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleStatus(p.data.id, p.data.status)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold cursor-pointer transition-colors"
              title={p.data.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
              data-testid={`superadmin-users-users-overview-action-suspend-2-${getSuperadminInteractiveTestIdSuffix(p.data)}`}
            >
              {p.data.status === 'Active' ? <Ban size={12} className="text-amber-400" /> : <Check size={12} className="text-emerald-400" />}
              <span>{p.data.status === 'Active' ? t('COPY.ACTION_SUSPEND') : t('COPY.ACTION_ACTIVATE')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleResetPassword(p.data.name)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold cursor-pointer transition-colors"
              title="Send Password Reset"
              data-testid={`superadmin-users-users-overview-reset-pwd-3-${getSuperadminInteractiveTestIdSuffix(p.data)}`}
            >
              <KeyRound size={12} className="text-indigo-400" />
              <span>{t("COPY.RESET_PWD")}</span>
            </button>
          </div>
        ) : null
      )
    }
  ], [t, handleOpenEdit, toggleStatus, handleResetPassword, handleQuickWhatsApp]);

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

        {/* Hero Export & Bulk Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Invite User Button */}
          <button
            type="button"
            onClick={() => {
              setEditUser(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm shadow-indigo-950/40"
            title="Invite or provision new admin/staff user"
            data-testid="superadmin-users-invite-user-btn"
          >
            <UserPlus size={14} className="text-white" />
            <span>Invite Staff</span>
          </button>

          {/* Bulk WhatsApp Button */}
          <button
            type="button"
            onClick={() => setShowBulkWhatsApp(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm shadow-emerald-950/40"
            title="Broadcast WhatsApp message to users"
          >
            <MessageSquare size={14} className="text-emerald-400" />
            <span>Broadcast WhatsApp</span>
          </button>

          {/* CSV Export */}
          <button
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
            onClick={handleExportUsers}
            type="button"
            title="Export filtered users as CSV"
            data-testid="superadmin-users-users-overview-export-sample-users-csv-5"
          >
            <Download size={14} className="text-teal-400" />
            <span>CSV</span>
          </button>

          {/* Excel Export */}
          <button
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
            onClick={handleExportExcel}
            type="button"
            title="Export filtered users as Excel (.xls)"
          >
            <FileSpreadsheet size={14} className="text-indigo-400" />
            <span>Excel</span>
          </button>

          {/* Print Roster */}
          <button
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
            onClick={handlePrintRoster}
            type="button"
            title="Print user directory roster"
          >
            <Printer size={14} className="text-sky-400" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 3 KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label={t("COPY.USERS_OVERVIEW_SUMMARY")}>
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
      </section>

      {/* Search & Filters Toolbar */}
      <div className="flex flex-col gap-3 p-4 rounded-2xl bg-card/90 border border-border/80 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Free Text Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user by name, username, email, phone, branch, role..."
              className="w-full rounded-xl border border-slate-700/60 bg-slate-950/70 pl-10 pr-9 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} className="text-rose-400" />
              </button>
            )}
          </div>

          {/* Quick Filter Selects */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Role Filter */}
            <div className="relative flex items-center">
              <Filter size={13} className="absolute left-2.5 text-purple-400 pointer-events-none" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                aria-label="Filter by role"
                className="rounded-xl border border-slate-700/60 bg-slate-950/70 pl-7 pr-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Admin">Tenant Admin</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative flex items-center">
              <CheckCircle size={13} className="absolute left-2.5 text-emerald-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                aria-label="Filter by status"
                className="rounded-xl border border-slate-700/60 bg-slate-950/70 pl-7 pr-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* 2FA Filter */}
            <div className="relative flex items-center">
              <ShieldCheck size={13} className="absolute left-2.5 text-sky-400 pointer-events-none" />
              <select
                value={twoFactorFilter}
                onChange={(e) => setTwoFactorFilter(e.target.value as any)}
                aria-label="Filter by 2FA"
                className="rounded-xl border border-slate-700/60 bg-slate-950/70 pl-7 pr-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="all">All 2FA</option>
                <option value="enabled">2FA Enabled</option>
                <option value="disabled">2FA Disabled</option>
              </select>
            </div>

            {/* Branch Filter */}
            {availableBranches.length > 0 && (
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                aria-label="Filter by branch"
                className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="all">All Branches</option>
                {availableBranches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            )}

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                title="Reset all active search and filters"
              >
                <RotateCcw size={12} className="text-rose-400" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/40">
          <span>
            Showing <strong className="text-white">{filteredUsers.length}</strong> of {users.length} accounts
          </span>
          {hasActiveFilters && (
            <span className="text-indigo-400 font-medium">Filters Applied</span>
          )}
        </div>
      </div>

      {/* Warning banner */}
      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs sm:text-sm text-amber-300 flex items-start gap-2.5" role="status">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <span>{t("COPY.USER_AND_SESSION_RECORDS_ARE_ILLUSTRATIVE_IN_MEMORY_SAMPLE_DATA_PROVISIONING_STATUS_CHANGES_RBAC_WRITES_PASSWORD_RESETS_AND_SESSION_REVOCATION_REQUIRE_VERIFIED_HOST_API_CONTRACTS_AND_DO_NOT_CHANGE_SERVER_STATE_HERE")}</span>
      </p>

      <div id="superadmin-users-tabpanel" tabIndex={0}>
        <SuperadminUsersDirectoryContent
          activeTab={activeTab}
          users={filteredUsers}
          userCols={userCols}
          rolePermissions={SUPERADMIN_USERS_ROLE_PERMISSIONS}
        />
      </div>

      <SuperadminUsersDirectoryModal
        showModal={showModal}
        editUser={editUser}
        onClose={() => setShowModal(false)}
        handleSave={handleSave}
      />

      <SuperadminUsersBulkWhatsAppModal
        isOpen={showBulkWhatsApp}
        onClose={() => setShowBulkWhatsApp(false)}
        users={filteredUsers}
      />
    </div>
  );
}
