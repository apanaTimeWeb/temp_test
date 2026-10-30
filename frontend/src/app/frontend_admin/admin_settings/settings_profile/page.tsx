'use client';
// Responsibility: AdminProfilePage presentation component owned by admin_profile; responsibility folder: admin_profile_components_views.

// RESPONSIBILITY: Owns profile tab navigation and delegates each page surface to a feature-local panel.
// DATA FLOW: role route -> active profile tab -> isolated panel -> demo fixture or explicit contract-blocked state.
import useAdminSettingsProfileUnsavedChangesGuard from '@/app/frontend_admin/admin_settings/settings_profile/hooks/useAdminSettingsProfileUnsavedChangesGuard';
import AdminSettingsProfileUnsavedChangesDialog from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminSettingsProfileUnsavedChangesDialog';
import { useCallback, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Shield } from 'lucide-react';
import type { AdminProfileNavigationItem, AdminProfileTab } from '@/app/frontend_admin/admin_settings/settings_profile/types/AdminSettingsProfileTypes';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_PROFILE_NAVIGATION_ITEMS } from '@/app/frontend_admin/admin_settings/settings_profile/config/admin_settings_profile.url_config';
import AdminSettingsProfileReadOnlyPanels from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminSettingsProfileReadOnlyPanels';
import AdminProfileEditForm from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminSettingsProfileEditForm';
import AdminProfilePasswordForm from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminSettingsProfilePasswordForm';

export default function AdminProfilePage() {
  const t = useTranslations('ADMIN_PROFILE');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [profileDraftDirty, setProfileDraftDirty] = useState(false);
  const [pendingNavigationHref, setPendingNavigationHref] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('view');
  const activeTab: AdminProfileTab = ADMIN_PROFILE_NAVIGATION_ITEMS.some((item) => item.id === requestedTab)
    ? requestedTab as AdminProfileTab
    : 'profile';
  const setActiveTab = useCallback((tab: AdminProfileTab) => {
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
  const activeLabelKey = ADMIN_PROFILE_NAVIGATION_ITEMS.find((item) => item.id === activeTab)?.labelKey ?? 'NAV_PROFILE';

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 p-6">
      {!isDemoMode && <p data-testid="admin_profile-AdminProfilePage-state-api-unavailable" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text" role="status">{t('LIVE_UNAVAILABLE_NOTICE')}</p>}
      <header>
        <h1 className="text-page-title font-bold text-text-primary">{t('PAGE_TITLE')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('PAGE_SUBTITLE')}</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="admin-card flex gap-2 overflow-x-auto lg:flex-col" aria-label={t('NAV_LABEL')}>
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
                className={`admin-tab-button min-h-11 shrink-0 ${selected ? 'admin-tab-button-active' : ''}`}
              >
                <Icon size={18} strokeWidth={2} className={selected ? 'text-primary' : 'text-text-secondary'} aria-hidden="true" />
                {t(item.labelKey)}
              </button>
            );
          })}
        </nav>
        <div className="min-w-0">
          {!isDemoMode ? <section data-testid="admin_profile-AdminSettingsProfileMain-state-tab-unavailable" className="admin-card p-6" role="status" aria-live="polite">
            <h2 className="text-section-title font-semibold text-text-primary">{t(activeLabelKey as AdminProfileNavigationItem['labelKey'])} — {t('UNAVAILABLE_SUFFIX')}</h2>
            <p className="mt-2 text-text-secondary">{t('LIVE_UNAVAILABLE_DESCRIPTION')}</p>
          </section> : (
            <>
              {activeTab === 'profile' && <AdminSettingsProfileReadOnlyPanels view="profile" />}
              {activeTab === 'edit' && <AdminProfileEditForm onDirtyChange={setProfileDraftDirty} />}
              {activeTab === 'password' && <AdminProfilePasswordForm onDirtyChange={setProfileDraftDirty} />}
              {activeTab === 'sessions' && <AdminSettingsProfileReadOnlyPanels view="sessions" />}
              {activeTab === '2fa' && <section className="admin-card p-6" aria-labelledby="admin-profile-two-factor-title">
                <h2 id="admin-profile-two-factor-title" className="text-section-title font-semibold text-text-primary">{t('TWO_FACTOR_TITLE')}</h2>
                <p className="mt-2 text-sm text-text-secondary">{t('TWO_FACTOR_DESCRIPTION')}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-md bg-input text-primary" aria-hidden="true"><Shield size={18} strokeWidth={2} /></div><div><h3 className="font-semibold text-text-primary">{t('AUTHENTICATOR_APP')}</h3><p className="text-sm text-text-secondary">{t('STATUS_LABEL')}: {t('STATUS_DISABLED')}</p></div></div>
                  <button type="button" data-testid="admin_profile-AdminSettingsProfileMain-control-008" className="admin-btn-primary min-h-11" disabled title={t('TWO_FACTOR_BLOCKED')}>{t('ENABLE_TWO_FACTOR')}</button>
                </div>
              </section>}
              {activeTab === 'history' && <AdminSettingsProfileReadOnlyPanels view="history" />}
              {activeTab === 'security' && <section className="admin-card p-6" aria-labelledby="admin-profile-security-settings-title">
                <h2 id="admin-profile-security-settings-title" className="text-section-title font-semibold text-text-primary">{t('SECURITY_SETTINGS_TITLE')}</h2>
                <div className="mt-4 space-y-3">
                  <article className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border p-4"><div><h3 className="font-semibold text-text-primary">{t('NEW_LOGIN_ALERTS')}</h3><p className="mt-1 text-sm text-text-secondary">{t('NEW_LOGIN_ALERTS_DESCRIPTION')}</p></div><span data-testid="admin_profile-AdminSettingsProfileMain-state-010" className="admin-badge admin-badge-success">{t('SECURITY_STATUS_ILLUSTRATIVE')}</span></article>
                  <article className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border p-4"><div><h3 className="font-semibold text-text-primary">{t('PASSWORD_EXPIRY')}</h3><p className="mt-1 text-sm text-text-secondary">{t('PASSWORD_EXPIRY_DESCRIPTION')}</p></div><button type="button" data-testid="admin_profile-AdminSettingsProfileMain-control-011" className="admin-btn-ghost min-h-11" disabled title={t('SECURITY_SETTINGS_BLOCKED')}>{t('ENABLE')}</button></article>
                </div>
              </section>}
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
