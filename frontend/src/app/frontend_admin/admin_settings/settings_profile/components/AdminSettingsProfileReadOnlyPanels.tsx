'use client';
// RESPONSIBILITY: Owns the profile overview, login-history, and sessions read-only presentation states.

import { ArrowDown, ArrowUp, ArrowUpDown, Camera, LogOut, Mail, MonitorSmartphone, Phone, ShieldCheck, CheckCircle2, Building2, Sparkles, Clock, Globe, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { ADMIN_PROFILE_DEMO_ACCOUNT, ADMIN_PROFILE_DEMO_LOGIN_HISTORY, ADMIN_PROFILE_DEMO_SESSIONS } from '@/app/frontend_admin/admin_settings/settings_profile/mocks/AdminSettingsProfileFixtures';
import type { AdminSettingsProfileReadOnlyPanelsProps } from '@/app/frontend_admin/admin_settings/settings_profile/types/AdminSettingsProfileTypes';

/**
 * These three source-backed tab views are read-only illustrative panels. Consolidating their
 * markup preserves the existing `view` URL state and display/test IDs while avoiding duplicate
 * panel wrappers. No profile, login-history, or session mutation API is implied.
 */
export default function AdminSettingsProfileReadOnlyPanels({ view }: AdminSettingsProfileReadOnlyPanelsProps) {
  const t = useTranslations('ADMIN_PROFILE');

  type HistorySortField = 'dateKey' | 'ip' | 'deviceKey' | 'status';
  const [sortField, setSortField] = useState<HistorySortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: HistorySortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedHistory = useMemo(() => {
    if (!sortField) return ADMIN_PROFILE_DEMO_LOGIN_HISTORY;
    return [...ADMIN_PROFILE_DEMO_LOGIN_HISTORY].sort((a, b) => {
      const aVal = String(a[sortField] || '');
      const bVal = String(b[sortField] || '');
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [sortField, sortDirection]);

  const renderSortableHeader = (field: HistorySortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className="p-3 whitespace-nowrap text-left"
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  if (view === 'profile') {
    return (
      <div className="space-y-6">
        {/* Executive Profile Hero Banner Card */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-surface p-6 shadow-sm sm:p-8" aria-labelledby="admin-profile-overview-title">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar with Camera Overlay & Active Glow */}
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 text-3xl font-extrabold text-primary border border-primary/20 shadow-md" aria-hidden="true">
              {ADMIN_PROFILE_DEMO_ACCOUNT.initials}
              <button
                type="button"
                data-testid="admin_profile-AdminSettingsProfileMain-control-002"
                className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm hover:scale-105 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-80 disabled:cursor-not-allowed"
                title={t('PHOTO_UPLOAD_BLOCKED')}
                aria-label={t('UPDATE_PHOTO')}
                disabled
              >
                <Camera size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            {/* Admin Info & Badges */}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 id="admin-profile-overview-title" className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                  {t(ADMIN_PROFILE_DEMO_ACCOUNT.nameKey)}
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Verified Administrator
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <Shield size={12} />
                  Network Superadmin
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary">
                {t('DEMO_ONLY_LABEL')}
              </p>
              {ADMIN_PROFILE_DEMO_ACCOUNT.bio && (
                <p className="text-xs sm:text-sm text-text-secondary/90 italic border-l-2 border-primary/40 pl-3 mt-1">
                  &ldquo;{t(ADMIN_PROFILE_DEMO_ACCOUNT.bio)}&rdquo;
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Identity & Scope 4-Tile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email Tile */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/30">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400 shadow-xs">
                <Mail size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('EMAIL_LABEL')}</p>
                <p className="mt-1 font-semibold text-text-primary truncate text-sm sm:text-base">{ADMIN_PROFILE_DEMO_ACCOUNT.email}</p>
                <p className="mt-0.5 text-xs text-slate-400">Primary operational mailbox</p>
              </div>
            </div>
          </div>

          {/* Phone Tile */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/30">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-xs">
                <Phone size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('PHONE_LABEL')}</p>
                <p className="mt-1 font-semibold text-text-primary font-mono text-sm sm:text-base">{ADMIN_PROFILE_DEMO_ACCOUNT.phone}</p>
                <p className="mt-0.5 text-xs text-slate-400">Authenticated 2FA phone</p>
              </div>
            </div>
          </div>

          {/* Role & Governance Tile */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/30">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-xs">
                <ShieldCheck size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">System Role</p>
                <p className="mt-1 font-semibold text-text-primary text-sm sm:text-base">Library Head & Superadmin</p>
                <p className="mt-0.5 text-xs text-slate-400">Full administrative governance</p>
              </div>
            </div>
          </div>

          {/* Branch Assignment Tile */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/30">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-xs">
                <Building2 size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Branch Scope</p>
                <p className="mt-1 font-semibold text-text-primary text-sm sm:text-base">All 3 Connected Branches</p>
                <p className="mt-0.5 text-xs text-slate-400">Downtown, West Campus, North</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'history') {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8" aria-labelledby="admin-profile-history-title">
        <div className="border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-xs">
              <Clock size={20} />
            </div>
            <div>
              <h2 id="admin-profile-history-title" className="text-lg font-bold tracking-tight text-text-primary sm:text-xl">
                {t('HISTORY_TITLE')}
              </h2>
              <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
                {t('DEMO_ONLY_DESCRIPTION')}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="mt-5 grid gap-3 md:hidden" aria-label={t('HISTORY_TITLE')}>
          {ADMIN_PROFILE_DEMO_LOGIN_HISTORY.map((entry) => (
            <article key={`mobile-${entry.id}`} className="rounded-xl border border-border bg-surface p-4 text-sm shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                <span className="font-semibold text-text-primary">{t(entry.dateKey)}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${entry.status === 'success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
                  {t(entry.status === 'success' ? 'STATUS_SUCCESS' : 'STATUS_FAILED')}
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-text-secondary">{t('HISTORY_IP')}</dt>
                  <dd className="font-mono text-text-primary mt-0.5">{entry.ip}</dd>
                </div>
                <div>
                  <dt className="text-text-secondary">{t('HISTORY_DEVICE')}</dt>
                  <dd className="text-text-primary mt-0.5">{t(entry.deviceKey)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        {/* Desktop Semantic Table */}
        <div className="mt-5 hidden overflow-hidden rounded-xl border border-border md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="h-12 bg-surface uppercase text-xs text-text-secondary font-semibold border-b border-border">
                {renderSortableHeader('dateKey', t('HISTORY_DATE'))}
                {renderSortableHeader('ip', t('HISTORY_IP'))}
                {renderSortableHeader('deviceKey', t('HISTORY_DEVICE'))}
                {renderSortableHeader('status', t('HISTORY_STATUS'))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {sortedHistory.map((entry) => (
                <tr key={entry.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra">
                  <td className="p-3 font-medium">{t(entry.dateKey)}</td>
                  <td className="p-3 font-mono text-xs text-text-secondary">{entry.ip}</td>
                  <td className="p-3">{t(entry.deviceKey)}</td>
                  <td className="p-3">
                    <span data-testid={`admin_profile-AdminSettingsProfileMain-state-login-status-${entry.id}`} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${entry.status === 'success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${entry.status === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      {t(entry.status === 'success' ? 'STATUS_SUCCESS' : 'STATUS_FAILED')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8" aria-labelledby="admin-profile-sessions-title">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-xs">
            <MonitorSmartphone size={20} />
          </div>
          <div>
            <h2 id="admin-profile-sessions-title" className="text-lg font-bold tracking-tight text-text-primary sm:text-xl">
              {t('SESSIONS_TITLE')}
            </h2>
            <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
              {t('DEMO_ONLY_DESCRIPTION')}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {ADMIN_PROFILE_DEMO_SESSIONS.map((session) => (
          <article
            key={session.id}
            className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5 transition-all ${
              session.current
                ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 via-card to-card shadow-sm'
                : 'border-border bg-surface hover:border-border-strong'
            }`}
          >
            <div className="flex min-w-0 items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-xs ${
                  session.current
                    ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                    : 'border-border bg-card text-text-secondary'
                }`}
                aria-hidden="true"
              >
                <MonitorSmartphone size={22} strokeWidth={2} />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-text-primary text-base">
                    {t(session.deviceKey)}
                  </h3>
                  {session.current && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {t('CURRENT_SESSION')}
                    </span>
                  )}
                </div>
                <p className="break-words text-xs sm:text-sm text-text-secondary">
                  {t(session.browserKey)} · <span className="font-mono text-xs">{t('HISTORY_IP')}: {session.ip}</span> · <span className="text-text-tertiary">{t('LAST_ACTIVE')}: {t(session.lastActiveKey)}</span>
                </p>
              </div>
            </div>
            {!session.current && (
              <button
                type="button"
                data-testid={`admin_profile-AdminSettingsProfileMain-control-revoke-${session.id}`}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                disabled
                title={t('SESSION_REVOKE_BLOCKED')}
              >
                <LogOut size={16} strokeWidth={2} aria-hidden="true" />
                <span>{t('LOGOUT')}</span>
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
