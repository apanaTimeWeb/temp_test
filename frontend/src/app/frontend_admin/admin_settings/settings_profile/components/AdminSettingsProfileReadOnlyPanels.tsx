'use client';
// RESPONSIBILITY: Owns the profile overview, login-history, and sessions read-only presentation states.

import { ArrowDown, ArrowUp, ArrowUpDown, Camera, LogOut, Mail, MonitorSmartphone, Phone, ShieldCheck, CheckCircle2, Building2, Sparkles, Clock, Globe, Shield, Crown, Zap, Layers, Armchair, MessageSquare, Users, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ADMIN_PROFILE_DEMO_ACCOUNT, ADMIN_PROFILE_DEMO_LOGIN_HISTORY, ADMIN_PROFILE_DEMO_SESSIONS, ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION } from '@/app/frontend_admin/admin_settings/settings_profile/mocks/AdminSettingsProfileFixtures';
import type { AdminSettingsProfileReadOnlyPanelsProps } from '@/app/frontend_admin/admin_settings/settings_profile/types/AdminSettingsProfileTypes';

/**
 * These three source-backed tab views are read-only illustrative panels. Consolidating their
 * markup preserves the existing `view` URL state and display/test IDs while avoiding duplicate
 * panel wrappers. No profile, login-history, or session mutation API is implied.
 */
export default function AdminSettingsProfileReadOnlyPanels({ view }: AdminSettingsProfileReadOnlyPanelsProps) {
  const t = useTranslations('ADMIN_PROFILE');
  const [profileSessions, setProfileSessions] = useState(() => [...ADMIN_PROFILE_DEMO_SESSIONS]);

  const handleRevokeProfileSession = (sessionId: string, deviceName: string, ip: string) => {
    setProfileSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success(`Session for ${deviceName} (${ip}) terminated successfully`);
  };

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

        {/* SuperAdmin SaaS Platform Subscription & Branch Plan Section */}
        <section
          className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0b0c22] via-[#0e1030] to-[#080918] p-6 shadow-xl sm:p-8"
          aria-labelledby="superadmin-saas-plan-title"
          data-testid="admin-superadmin-plan-section"
        >
          {/* Background Ambient Glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" aria-hidden="true" />

          {/* Section Header */}
          <div className="relative flex flex-col gap-4 border-b border-indigo-500/20 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
                <Crown size={24} strokeWidth={2.2} />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                    SuperAdmin SaaS License
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Plan • Auto-Renew Enabled
                  </span>
                </div>
                <h2 id="superadmin-saas-plan-title" className="text-xl sm:text-2xl font-extrabold text-white">
                  {ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.planName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Purchased from <strong className="text-indigo-300">{ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.provider}</strong> to operate and govern library branches.
                </p>
              </div>
            </div>

            {/* Price & Renewal Badge */}
            <div className="flex flex-col sm:items-end gap-1 shrink-0 rounded-xl bg-white/[0.03] border border-white/5 p-3.5">
              <span className="text-xs text-slate-400 font-medium">Subscription Fee</span>
              <span className="text-lg sm:text-xl font-extrabold text-white font-mono">
                {ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.priceFormatted}
              </span>
              <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
                <Clock size={12} /> Valid till {ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.expiryDate} ({ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.daysRemaining} days left)
              </span>
            </div>
          </div>

          {/* Plan Contract Meta Row */}
          <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">License Key</p>
                <p className="text-xs font-mono font-bold text-white truncate">{ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.licenseKey}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">SLA Guarantee</p>
                <p className="text-xs font-semibold text-white truncate">{ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.slaUptime}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Zap size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Billing Mode</p>
                <p className="text-xs font-semibold text-white truncate">{ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.billingCycle} • Purchased {ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.purchasedDate}</p>
              </div>
            </div>
          </div>

          {/* Quotas & Entitlement Progress Bars */}
          <div className="relative mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Layers size={14} className="text-indigo-400" />
              SaaS Quota & Resource Entitlements
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Branch Quota */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Building2 size={13} className="text-indigo-400" /> Branch Licenses
                    </span>
                    <span className="font-bold text-white font-mono">
                      {ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.branches.used}/{ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.branches.total}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: `${(ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.branches.used / ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.branches.total) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">2 branch slots available</p>
              </div>

              {/* Seats Quota */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Armchair size={13} className="text-sky-400" /> Total Seats Allotted
                    </span>
                    <span className="font-bold text-white font-mono">
                      {ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.seats.used}/{ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.seats.total}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                      style={{ width: `${(ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.seats.used / ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.seats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">120 seats headroom</p>
              </div>

              {/* WhatsApp Messages Quota */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-emerald-400" /> WhatsApp / SMS API
                    </span>
                    <span className="font-bold text-white font-mono">
                      {ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.messages.used.toLocaleString()}/{ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.messages.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${(ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.messages.used / ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.messages.total) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">1,550 messages remaining</p>
              </div>

              {/* Staff Accounts Quota */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Users size={13} className="text-purple-400" /> Staff & Managers
                    </span>
                    <span className="font-bold text-white font-mono">
                      {ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.staff.used}/{ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.staff.total}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${(ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.staff.used / ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.quotas.staff.total) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">8 account slots open</p>
              </div>
            </div>
          </div>

          {/* Included Features List */}
          <div className="relative mt-6 pt-5 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              Features Granted by SuperAdmin
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.features.map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs text-slate-300 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="relative mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Need more branches or extra seat capacity? Contact SuperAdmin for custom enterprise scaling.
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => toast.success('Downloading SuperAdmin SaaS Invoice #INV-2026-092...')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
              >
                <FileText size={14} />
                <span>Download Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => toast.success('Upgrade request sent to SuperAdmin! Our team will contact you shortly.')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <Crown size={14} />
                <span>Contact SuperAdmin to Upgrade</span>
              </button>
            </div>
          </div>
        </section>
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
        {profileSessions.map((session) => (
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
