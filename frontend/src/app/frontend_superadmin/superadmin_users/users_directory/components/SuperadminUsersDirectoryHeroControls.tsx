'use client';

import React from 'react';
import {
  CheckCircle,
  Download,
  FileSpreadsheet,
  MessageSquare,
  Printer,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react';
import type { SuperadminUserData } from '../types/SuperadminUsersDirectoryTypes';
import SuperadminUsersDirectoryFilterBar from './SuperadminUsersDirectoryFilterBar';

interface SuperadminUsersDirectoryHeroControlsProps {
  t: (key: string, values?: Record<string, string | number>) => string;
  users: SuperadminUserData[];
  filteredUsers: SuperadminUserData[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  roleFilter: 'all' | 'SuperAdmin' | 'Admin' | 'Manager';
  setRoleFilter: (val: 'all' | 'SuperAdmin' | 'Admin' | 'Manager') => void;
  statusFilter: 'all' | 'Active' | 'Suspended';
  setStatusFilter: (val: 'all' | 'Active' | 'Suspended') => void;
  twoFactorFilter: 'all' | 'enabled' | 'disabled';
  setTwoFactorFilter: (val: 'all' | 'enabled' | 'disabled') => void;
  branchFilter: string;
  setBranchFilter: (val: string) => void;
  availableBranches: string[];
  hasActiveFilters: boolean;
  resetAllFilters: () => void;
  onOpenInvite: () => void;
  onOpenBulkWhatsApp: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onPrintRoster: () => void;
}

export default function SuperadminUsersDirectoryHeroControls({
  t,
  users,
  filteredUsers,
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  twoFactorFilter,
  setTwoFactorFilter,
  branchFilter,
  setBranchFilter,
  availableBranches,
  hasActiveFilters,
  resetAllFilters,
  onOpenInvite,
  onOpenBulkWhatsApp,
  onExportCsv,
  onExportExcel,
  onPrintRoster,
}: SuperadminUsersDirectoryHeroControlsProps) {
  const activeCount = users.filter((u) => u.status === 'Active').length;
  const twoFactorCount = users.filter((u) => u.twoFactor).length;

  return (
    <div className="space-y-6">
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
                <span>RBAC Active</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{t('COPY.USERS_OVERVIEW_SUMMARY')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onOpenInvite}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm shadow-indigo-950/40"
            title="Invite or provision new admin/staff user"
            data-testid="superadmin-users-invite-user-btn"
          >
            <UserPlus size={14} className="text-white" />
            <span>Invite Staff</span>
          </button>
          <button
            type="button"
            onClick={onOpenBulkWhatsApp}
            disabled={filteredUsers.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm shadow-emerald-950/40 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Broadcast WhatsApp message to users"
          >
            <MessageSquare size={14} className="text-emerald-400" />
            <span>Bulk WhatsApp ({filteredUsers.length})</span>
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
            onClick={onExportCsv}
            type="button"
            title="Export filtered users as CSV"
            data-testid="superadmin-users-users-overview-export-sample-users-csv-5"
          >
            <Download size={14} className="text-teal-400" />
            <span>CSV</span>
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
            onClick={onExportExcel}
            type="button"
            title="Export filtered users as Excel (.xls)"
          >
            <FileSpreadsheet size={14} className="text-indigo-400" />
            <span>Excel</span>
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
            onClick={onPrintRoster}
            type="button"
            title="Print user directory roster"
          >
            <Printer size={14} className="text-sky-400" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 3 KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label={t('COPY.USERS_OVERVIEW_SUMMARY')}>
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-card/90 to-card p-5 shadow-sm transition-all hover:border-indigo-500/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300/80 uppercase tracking-wider">{t('COPY.TABLE_COLUMN_USER')}</span>
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

        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-card/90 to-card p-5 shadow-sm transition-all hover:border-emerald-500/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300/80 uppercase tracking-wider">{t('COPY.ACTIVE_USER_COUNT')}</span>
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
              {Math.round((twoFactorCount / Math.max(1, users.length)) * 100)}% Enforced
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-sky-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full" style={{ width: `${(twoFactorCount / Math.max(1, users.length)) * 100}%` }} />
          </div>
        </div>
      </section>

      <SuperadminUsersDirectoryFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        twoFactorFilter={twoFactorFilter}
        setTwoFactorFilter={setTwoFactorFilter}
        branchFilter={branchFilter}
        setBranchFilter={setBranchFilter}
        availableBranches={availableBranches}
        hasActiveFilters={hasActiveFilters}
        resetAllFilters={resetAllFilters}
        filteredCount={filteredUsers.length}
        totalCount={users.length}
      />
    </div>
  );
}
