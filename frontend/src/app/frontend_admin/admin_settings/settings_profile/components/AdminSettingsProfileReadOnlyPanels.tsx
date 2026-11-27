'use client';

// RESPONSIBILITY: Owns the profile overview, login-history, and sessions read-only presentation states.

import { AdminSettingsProfileHistoryPanel } from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminSettingsProfileHistoryPanel';
import { AdminSettingsProfileSubscriptionPanel } from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminSettingsProfileSubscriptionPanel';
import {
  ADMIN_PROFILE_DEMO_ACCOUNT,
  ADMIN_PROFILE_DEMO_SESSIONS,
} from '@/app/frontend_admin/admin_settings/settings_profile/config/admin_settings_profile.demo_data';
import type { AdminSettingsProfileReadOnlyPanelsProps } from '@/app/frontend_admin/admin_settings/settings_profile/types/AdminSettingsProfileTypes';
import {
  Building2,
  Camera,
  LogOut,
  Mail,
  MonitorSmartphone,
  Phone,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function AdminSettingsProfileReadOnlyPanels({ view }: AdminSettingsProfileReadOnlyPanelsProps) {
  const t = useTranslations('ADMIN_PROFILE');
  const [profileSessions] = useState(() => [...ADMIN_PROFILE_DEMO_SESSIONS]);

  if (view === 'profile') {
    return (
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8" aria-labelledby="admin-profile-overview-title">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary-subtle blur-3xl" aria-hidden="true" />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary-subtle text-3xl font-extrabold text-primary border border-border-focus shadow-card" aria-hidden="true">
              {ADMIN_PROFILE_DEMO_ACCOUNT.initials}
              <button
                type="button"
                data-testid="admin_profile-AdminSettingsProfileMain-control-002"
                className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-card motion-safe:transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-80 disabled:cursor-not-allowed"
                title={t('PHOTO_UPLOAD_BLOCKED')}
                aria-label={t('UPDATE_PHOTO')}
                disabled
              >
                <Camera size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 id="admin-profile-overview-title" className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                  {t(ADMIN_PROFILE_DEMO_ACCOUNT.nameKey)}
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success bg-success-bg px-2.5 py-0.5 text-xs font-semibold text-success-text">
                  <span className="h-1.5 w-1.5 rounded-full bg-success motion-safe:animate-pulse" />
                  Verified Administrator
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border-focus bg-primary-subtle px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <Shield size={12} aria-hidden="true" />
                  Network Superadmin
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary">
                {t('DEMO_ONLY_LABEL')}
              </p>
              {ADMIN_PROFILE_DEMO_ACCOUNT.bio && (
                <p className="text-xs sm:text-sm text-text-secondary italic border-l-2 border-border-focus pl-3 mt-1">
                  &ldquo;{t(ADMIN_PROFILE_DEMO_ACCOUNT.bio)}&rdquo;
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card motion-safe:transition-colors hover:border-border-focus">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-info bg-info-bg text-info-text shadow-card">
                <Mail size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('EMAIL_LABEL')}</p>
                <p className="mt-1 font-semibold text-text-primary truncate text-sm sm:text-base">{ADMIN_PROFILE_DEMO_ACCOUNT.email}</p>
                <p className="mt-0.5 text-xs text-text-secondary">Primary operational mailbox</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card motion-safe:transition-colors hover:border-border-focus">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-success bg-success-bg text-success-text shadow-card">
                <Phone size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('PHONE_LABEL')}</p>
                <p className="mt-1 font-semibold text-text-primary font-mono text-sm sm:text-base">{ADMIN_PROFILE_DEMO_ACCOUNT.phone}</p>
                <p className="mt-0.5 text-xs text-text-secondary">Authenticated 2FA phone</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card motion-safe:transition-colors hover:border-border-focus">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-purple-bg text-purple shadow-card">
                <ShieldCheck size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">System Role</p>
                <p className="mt-1 font-semibold text-text-primary text-sm sm:text-base">Library Head & Superadmin</p>
                <p className="mt-0.5 text-xs text-text-secondary">Full administrative governance</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card motion-safe:transition-colors hover:border-border-focus">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-warning bg-warning-bg text-warning-text shadow-card">
                <Building2 size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Branch Scope</p>
                <p className="mt-1 font-semibold text-text-primary text-sm sm:text-base">All 3 Connected Branches</p>
                <p className="mt-0.5 text-xs text-text-secondary">Downtown, West Campus, North</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'subscription') {
    return <AdminSettingsProfileSubscriptionPanel />;
  }

  if (view === 'history') {
    return <AdminSettingsProfileHistoryPanel />;
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8" aria-labelledby="admin-profile-sessions-title">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-focus bg-primary-subtle text-primary shadow-card">
            <MonitorSmartphone size={20} aria-hidden="true" />
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
            className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5 motion-safe:transition-colors ${
              session.current
                ? 'border-success bg-card shadow-card'
                : 'border-border bg-surface-highlight hover:border-border-focus'
            }`}
          >
            <div className="flex min-w-0 items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-card ${
                  session.current
                    ? 'border-success bg-success-bg text-success-text'
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
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-success bg-success-bg px-2.5 py-0.5 text-xs font-semibold text-success-text">
                      <span className="h-1.5 w-1.5 rounded-full bg-success motion-safe:animate-pulse" />
                      {t('CURRENT_SESSION')}
                    </span>
                  )}
                </div>
                <p className="break-words text-xs sm:text-sm text-text-secondary">
                  {t(session.browserKey)} · <span className="font-mono text-xs">{t('HISTORY_IP')}: {session.ip}</span> · <span className="text-text-secondary">{t('LAST_ACTIVE')}: {t(session.lastActiveKey)}</span>
                </p>
              </div>
            </div>
            {!session.current && (
              <button
                type="button"
                data-testid={`admin_profile-AdminSettingsProfileMain-control-revoke-${session.id}`}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-danger bg-danger-bg px-4 py-2 text-xs font-semibold text-danger-text hover:opacity-90 motion-safe:transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-card"
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
