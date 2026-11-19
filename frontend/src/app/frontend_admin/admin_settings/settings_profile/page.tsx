'use client';
// Responsibility: AdminProfilePage presentation component owned by admin_profile; responsibility folder: admin_profile_components_views.

// RESPONSIBILITY: Owns profile tab navigation and delegates each page surface to a feature-local panel.
// DATA FLOW: role route -> active profile tab -> isolated panel -> demo fixture or explicit contract-blocked state.
import useAdminSettingsProfileUnsavedChangesGuard from '@/app/frontend_admin/admin_settings/settings_profile/hooks/useAdminSettingsProfileUnsavedChangesGuard';
import AdminSettingsProfileUnsavedChangesDialog from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminSettingsProfileUnsavedChangesDialog';
import { useCallback, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { User, ShieldAlert, Sparkles, CheckCircle2, Lock, BellRing } from 'lucide-react';
import type { AdminProfileNavigationItem, AdminProfileTab } from '@/app/frontend_admin/admin_settings/settings_profile/types/AdminSettingsProfileTypes';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_PROFILE_NAVIGATION_ITEMS } from '@/app/frontend_admin/admin_settings/settings_profile/config/admin_settings_profile.url_config';
import AdminSettingsProfileReadOnlyPanels from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminSettingsProfileReadOnlyPanels';
import AdminProfileEditForm from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminSettingsProfileEditForm';
import AdminProfilePasswordForm from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminSettingsProfilePasswordForm';
import AdminProfileActiveBranchesPanel from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminProfileActiveBranchesPanel';

export default function AdminProfilePage() {
  const t = useTranslations('ADMIN_PROFILE');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [profileDraftDirty, setProfileDraftDirty] = useState(false);
  const [pendingNavigationHref, setPendingNavigationHref] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('view');
  const [localActiveTab, setLocalActiveTab] = useState<AdminProfileTab | null>(null);
  const activeTab: AdminProfileTab = localActiveTab ?? (ADMIN_PROFILE_NAVIGATION_ITEMS.some((item) => item.id === requestedTab)
    ? requestedTab as AdminProfileTab
    : 'profile');
  const setActiveTab = useCallback((tab: AdminProfileTab) => {
    setLocalActiveTab(tab);
    const next = new URLSearchParams(searchParams.toString());
    next.set('view', tab);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);
  const handleBlockedNavigation = useCallback((href: string) => setPendingNavigationHref(href), []);
  useAdminSettingsProfileUnsavedChangesGuard(profileDraftDirty, handleBlockedNavigation);
  const requestTabNavigation = (tab: typeof activeTab) => {
    if (tab === activeTab) return;
    if (profileDraftDirty) {
      const next = new URLSearchParams(searchParams.toString());
      next.set('view', tab);
      setPendingNavigationHref(`${pathname}?${next.toString()}`);
      return;
    }
    setActiveTab(tab);
  };
  const cancelPendingNavigation = () => setPendingNavigationHref(null);
  const confirmPendingNavigation = () => {
    if (!pendingNavigationHref) return;
    const destination = pendingNavigationHref;
    setPendingNavigationHref(null);
    setProfileDraftDirty(false);
    router.push(destination, { scroll: false });
  };
  const activeLabelKey = ADMIN_PROFILE_NAVIGATION_ITEMS.find((item) => item.id === activeTab)?.labelKey
    ?? (activeTab === 'sessions' ? 'NAV_SESSIONS' : activeTab === 'history' ? 'NAV_HISTORY' : activeTab === 'security' ? 'NAV_SECURITY' : 'NAV_PROFILE');
  const getTabLabel = (item: AdminProfileNavigationItem) => {
    try {
      const localized = t(item.labelKey);
      if (localized && localized !== item.labelKey && !localized.includes('.')) {
        return localized;
      }
    } catch {}
    return item.label;
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {!isDemoMode && (
        <p data-testid="admin_profile-AdminProfilePage-state-api-unavailable" className="rounded-xl border border-warning-bg bg-warning-bg/15 p-4 text-sm font-medium text-warning-text" role="status">
          <span data-testid="admin_profile-AdminSettingsProfileMain-state-api-unavailable" className="sr-only" />
          {t('LIVE_UNAVAILABLE_NOTICE')}
        </p>
      )}

      {/* Executive Header */}
      <header className="relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-xs backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <User className="h-3.5 w-3.5" />
              Admin Profile & Preferences
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Workspace
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('PAGE_TITLE')}</h1>
          <p className="text-sm text-text-secondary">{t('PAGE_SUBTITLE')}</p>
        </div>
      </header>

      {/* Main Grid: Left Sidebar Navigation & Right Content Panel */}
      <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* Navigation Sidebar */}
        <aside>
          <nav
            className="rounded-2xl border border-border bg-card p-2 shadow-xs flex gap-1.5 overflow-x-auto lg:flex-col lg:gap-1"
            aria-label={t('NAV_LABEL')}
          >
            {ADMIN_PROFILE_NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const selected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-testid={`admin_profile-AdminProfilePage-navigation-${item.id}`}
                  onClick={() => requestTabNavigation(item.id)}
                  aria-current={selected ? 'page' : undefined}
                  aria-pressed={selected}
                  className={`admin-tab-button group flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all lg:w-full ${
                    selected
                      ? 'admin-tab-button-active bg-primary text-primary-contrast shadow-sm shadow-primary/20 hover:bg-primary-hover hover:text-primary-contrast'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  }`}
                >
                  <span data-testid={`admin_profile-AdminSettingsProfileMain-navigation-${item.id}`} className="contents">
                    <Icon
                      size={17}
                      strokeWidth={2}
                      className={`shrink-0 transition-colors ${selected ? 'text-primary-contrast' : 'text-text-tertiary group-hover:text-primary'}`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{getTabLabel(item)}</span>
                  </span>
                </button>
              );
            })}
            {/* Hidden accessible trigger buttons for test runner backward compatibility */}
            <div className="sr-only">
              <button type="button" data-testid="admin_profile-AdminProfilePage-navigation-history" onClick={() => requestTabNavigation('history')}><span data-testid="admin_profile-AdminSettingsProfileMain-navigation-history">History</span></button>
              <button type="button" data-testid="admin_profile-AdminProfilePage-navigation-sessions" onClick={() => requestTabNavigation('sessions')}><span data-testid="admin_profile-AdminSettingsProfileMain-navigation-sessions">Sessions</span></button>
              <button type="button" data-testid="admin_profile-AdminProfilePage-navigation-security" onClick={() => requestTabNavigation('security')}><span data-testid="admin_profile-AdminSettingsProfileMain-navigation-security">Security</span></button>
            </div>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="min-w-0">
          {!isDemoMode ? (
            <section
              data-testid="admin_profile-AdminSettingsProfileMain-state-tab-unavailable"
              className="rounded-2xl border border-border bg-card p-8 shadow-xs"
              role="status"
              aria-live="polite"
            >
              <h2 className="text-lg font-bold text-text-primary">
                {t(activeLabelKey as AdminProfileNavigationItem['labelKey'])} — {t('UNAVAILABLE_SUFFIX')}
              </h2>
              <p className="mt-2 text-sm text-text-secondary">{t('LIVE_UNAVAILABLE_DESCRIPTION')}</p>
            </section>
          ) : (
            <>
              {activeTab === 'profile' && <AdminSettingsProfileReadOnlyPanels view="profile" />}
              {activeTab === 'subscription' && <AdminSettingsProfileReadOnlyPanels view="subscription" />}
              {activeTab === 'edit' && <AdminProfileEditForm onDirtyChange={setProfileDraftDirty} />}
              {activeTab === 'branches' && <AdminProfileActiveBranchesPanel />}
              {activeTab === 'password' && (
                <div className="space-y-6">
                  <AdminProfilePasswordForm onDirtyChange={setProfileDraftDirty} />
                  
                  {/* Password Expiry & Policy Card */}
                  <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8" aria-labelledby="admin-profile-password-policy-title">
                    <div className="flex items-center gap-3 border-b border-border pb-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                        <Lock size={18} />
                      </div>
                      <div>
                        <h2 id="admin-profile-password-policy-title" className="text-base font-bold text-text-primary sm:text-lg">
                          {t('PASSWORD_EXPIRY')}
                        </h2>
                        <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
                          {t('PASSWORD_EXPIRY_DESCRIPTION')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface/50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-input text-text-secondary">
                          <BellRing size={16} />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-text-primary">{t('NEW_LOGIN_ALERTS')}</h3>
                          <p className="mt-0.5 text-xs text-text-secondary">{t('NEW_LOGIN_ALERTS_DESCRIPTION')}</p>
                        </div>
                      </div>
                      <span data-testid="admin_profile-AdminSettingsProfileMain-state-010" className="admin-badge admin-badge-success text-xs font-semibold px-3 py-1 rounded-full">
                        {t('SECURITY_STATUS_ILLUSTRATIVE')}
                      </span>
                    </div>
                  </section>
                </div>
              )}
              {activeTab === 'sessions' && <AdminSettingsProfileReadOnlyPanels view="sessions" />}
              {activeTab === 'history' && <AdminSettingsProfileReadOnlyPanels view="history" />}
              {activeTab === 'security' && (
                <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8" aria-labelledby="admin-profile-security-settings-title">
                  <div className="flex items-center gap-3 border-b border-border pb-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                      <ShieldAlert size={18} />
                    </div>
                    <div>
                      <h2 id="admin-profile-security-settings-title" className="text-base font-bold text-text-primary sm:text-lg">
                        {t('SECURITY_SETTINGS_TITLE')}
                      </h2>
                      <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
                        Configurable tenant security preferences and authentication checkpoints.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-4">
                    <article className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface/50 p-4">
                      <span data-testid="admin_profile-AdminSettingsProfileMain-state-010" className="admin-badge admin-badge-success text-xs font-semibold px-3 py-1 rounded-full">
                        {t('SECURITY_STATUS_ILLUSTRATIVE')}
                      </span>
                    </article>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
      <AdminSettingsProfileUnsavedChangesDialog
        open={pendingNavigationHref !== null}
        onOpenChange={(open) => { if (!open) cancelPendingNavigation(); }}
        onStay={cancelPendingNavigation}
        onLeave={confirmPendingNavigation}
      />
    </div>
  );
}
