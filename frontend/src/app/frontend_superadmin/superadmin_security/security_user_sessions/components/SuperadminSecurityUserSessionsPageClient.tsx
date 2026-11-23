'use client';
/** Responsibility: renders only the canonical security user-sessions route; user-directory and role-management UI live in their own route leaves. */
/** Data-Flow: canonical route -> local demonstration session fixtures -> read-only semantic table; revocation is disabled until a verified host API contract exists. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/config/superadmin_security_user_sessions.url_config.ts';
import { useMemo, useState, useCallback } from 'react';
import {
  ShieldAlert,
  AlertCircle,
  Users,
  Activity,
  UserX,
  Search,
  X,
  RotateCcw,
  RotateCw,
  Download,
  Printer,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_USERS_INITIAL_SESSIONS } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/mocks/fixtures/SuperadminSecurityUserSessionsMockFixtures';
import SuperadminSecurityUserSessionsSemanticTable from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/components/SuperadminSecurityUserSessionsSemanticTable';
import type { SuperadminSessionData } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/types/SuperadminSecurityUserSessionsTypes';
import { getSuperadminSecurityUserSessionsColumns } from './SuperadminSecurityUserSessionsColumns';

export default function SuperadminSecurityUserSessionsPageClient() {
  const t = useTranslations('SUPERADMIN_USERS');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Revoked'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalSessions = SUPERADMIN_USERS_INITIAL_SESSIONS.length;
  const activeSessions = SUPERADMIN_USERS_INITIAL_SESSIONS.filter((s) => s.status === 'Active').length;
  const revokedSessions = totalSessions - activeSessions;

  const filteredSessions = useMemo(() => {
    return SUPERADMIN_USERS_INITIAL_SESSIONS.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesUser = s.user.toLowerCase().includes(q);
        const matchesDevice = s.device.toLowerCase().includes(q);
        const matchesIp = s.ip.toLowerCase().includes(q);
        const matchesLocation = s.location.toLowerCase().includes(q);
        if (!matchesUser && !matchesDevice && !matchesIp && !matchesLocation) return false;
      }
      return true;
    });
  }, [searchQuery, statusFilter]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Active user sessions synchronized with security gateway', {
        id: 'superadmin:security:sessions:refresh',
      });
    }, 450);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
  }, []);

  const handleExportCsv = useCallback(() => {
    if (filteredSessions.length === 0) return;
    const header = ['User', 'Device / Browser', 'IP Address', 'Location', 'Last Active', 'Status'];
    const rows = filteredSessions.map((s) => [
      `"${s.user.replace(/"/g, '""')}"`,
      `"${s.device.replace(/"/g, '""')}"`,
      `"${s.ip.replace(/"/g, '""')}"`,
      `"${s.location.replace(/"/g, '""')}"`,
      `"${s.lastActive.replace(/"/g, '""')}"`,
      `"${s.status.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `superadmin_user_sessions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('Session records exported to CSV successfully');
  }, [filteredSessions]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'all';

  const sessionColumns = useMemo(() => getSuperadminSecurityUserSessionsColumns(t), [t]);

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

        {/* Action Toolbar: Search, Filters, Refresh, Export, Print */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 border-b border-border/60 bg-[#080b22]/90 flex-wrap">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search user, device, IP, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-indigo-500/30 bg-[#060818] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                title="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            aria-label="Filter by session status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Active' | 'Revoked')}
            className="rounded-xl border border-indigo-500/30 bg-[#060818] px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Session Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Revoked">Revoked Only</option>
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold cursor-pointer transition-all"
              title="Clear all filters"
            >
              <RotateCcw size={12} className="text-rose-400" />
              <span>Reset</span>
            </button>
          )}

          {/* Refresh, Export & Print Actions */}
          <div className="flex items-center gap-1.5 flex-wrap ml-auto">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 text-xs font-semibold cursor-pointer transition-all disabled:opacity-50"
              title="Refresh sessions from security gateway"
            >
              <RotateCw size={12} className={`text-sky-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold cursor-pointer transition-all"
              title="Export filtered sessions to CSV"
            >
              <Download size={12} className="text-indigo-400" />
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border/60 bg-slate-800/60 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer transition-all"
              title="Print Active Sessions Audit Report"
            >
              <Printer size={12} className="text-slate-400" />
              <span>Print</span>
            </button>

            <span className="text-xs text-slate-300 font-medium px-2 py-1 rounded-lg bg-slate-900 border border-border/50">
              {filteredSessions.length} of {totalSessions}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <SuperadminSecurityUserSessionsSemanticTable<SuperadminSessionData>
            rowData={filteredSessions}
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
