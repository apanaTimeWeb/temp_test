'use client';

// Responsibility: AdminSupportPage presentation component owned by admin_support; responsibility folder: admin_support_components_views.

import AdminSupportTicketsPanel from '@/app/frontend_admin/admin_settings/settings_support/components/AdminSettingsSupportTicketsPanel';
import { ADMIN_SUPPORT_NAVIGATION_ITEMS } from '@/app/frontend_admin/admin_settings/settings_support/config/admin_settings_support.url_config';
import useAdminSupportTabState from '@/app/frontend_admin/admin_settings/settings_support/hooks/useAdminSettingsSupportTabState';
import { ADMIN_SUPPORT_ANNOUNCEMENT_FIXTURES } from '@/app/frontend_admin/admin_settings/settings_support/config/admin_settings_support.demo_data';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { BellRing, Headphones, Info, LifeBuoy, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AdminSupportPage() {
  const t = useTranslations('ADMIN_SUPPORT');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [activeTab, setActiveTab] = useAdminSupportTabState();

  const renderUnavailableState = (section: 'tickets' | 'announcements') => {
    const titleKey =
      section === 'tickets' ? 'UNAVAILABLE_TICKETS_TITLE' : 'UNAVAILABLE_ANNOUNCEMENTS_TITLE';
    const descriptionKey =
      section === 'tickets' ? 'UNAVAILABLE_TICKETS_DESCRIPTION' : 'UNAVAILABLE_ANNOUNCEMENTS_DESCRIPTION';
    return (
      <section
        className="rounded-2xl border border-border bg-card p-6 shadow-card"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl border shrink-0 bg-warning-bg border-warning text-warning-text">
            <Info size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-text-primary">{t(titleKey)}</h2>
            <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">{t(descriptionKey)}</p>
          </div>
        </div>
      </section>
    );
  };

  const announcementsPanel = (
    <section
      className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card space-y-5"
      aria-labelledby="admin-support-announcements-title"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2
            id="admin-support-announcements-title"
            className="text-lg font-bold text-text-primary flex items-center gap-2"
          >
            <BellRing size={18} className="text-warning-text" aria-hidden="true" />
            <span>{t('ANNOUNCEMENTS_TITLE')}</span>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Platform maintenance notices and verified operational bulletins
          </p>
        </div>
        <span className="self-start sm:self-auto text-micro font-mono font-semibold px-2.5 py-1 rounded-full bg-surface-highlight border border-border text-text-secondary">
          {ADMIN_SUPPORT_ANNOUNCEMENT_FIXTURES.length} Active Bulletins
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ADMIN_SUPPORT_ANNOUNCEMENT_FIXTURES.map((announcement) => (
          <article
            key={announcement.titleKey}
            className="flex flex-col justify-between rounded-xl border border-border bg-surface-highlight p-4 motion-safe:transition-colors hover:border-border-focus hover:bg-surface-hover space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-micro font-mono font-semibold px-2 py-0.5 rounded-full bg-primary-subtle border border-border-focus text-primary">
                  {t(announcement.dateKey)}
                </span>
                <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-sm text-text-primary">{t(announcement.titleKey)}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{t(announcement.contentKey)}</p>
            </div>
            <div className="pt-2.5 border-t border-border flex items-center justify-between text-micro text-text-secondary">
              <span>Operational Bulletin</span>
              <span className="text-success-text font-semibold flex items-center gap-1">Verified</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-w-0 space-y-6">
      <p
        role="status"
        className={
          isDemoMode
            ? 'sr-only'
            : 'rounded-xl border border-warning bg-warning-bg p-3 text-xs text-warning-text'
        }
      >
        {t(isDemoMode ? 'DEMO_PREVIEW_NOTICE' : 'LIVE_UNAVAILABLE_NOTICE')}
      </p>

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-focus bg-primary-subtle px-3 py-1 text-micro font-semibold text-primary">
            <Headphones size={13} className="text-primary" aria-hidden="true" />
            <span>Administrator Priority Helpdesk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-primary-subtle border border-border-focus flex items-center justify-center text-primary shrink-0">
              <LifeBuoy size={18} aria-hidden="true" />
            </div>
            <span>{t('PAGE_TITLE')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
            {t('PAGE_SUBTITLE')}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-xs">
          <div className="h-8 w-8 rounded-xl bg-success-bg border border-success flex items-center justify-center text-success-text">
            <ShieldCheck size={16} aria-hidden="true" />
          </div>
          <div>
            <span className="font-semibold text-text-primary block">Priority SLA</span>
            <span className="text-micro text-success-text font-mono">&lt; 15 min response time</span>
          </div>
        </div>
      </header>

      <nav
        className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto"
        aria-label={t('SUPPORT_SECTIONS_LABEL')}
      >
        {ADMIN_SUPPORT_NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const selected = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-testid={`admin_support-AdminSettingsSupportMain-navigation-${item.id}`}
              aria-current={selected ? 'page' : undefined}
              aria-pressed={selected}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold motion-safe:transition-colors cursor-pointer border ${
                selected
                  ? 'bg-primary text-on-primary shadow-card border-border-focus'
                  : 'bg-card border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <Icon
                size={15}
                strokeWidth={2.2}
                className={selected ? 'text-on-primary' : 'text-text-secondary'}
                aria-hidden="true"
              />
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>

      <div className="min-w-0" aria-live="polite">
        {activeTab === 'tickets' &&
          (isDemoMode ? <AdminSupportTicketsPanel /> : renderUnavailableState('tickets'))}
        {activeTab === 'announcements' &&
          (isDemoMode ? announcementsPanel : renderUnavailableState('announcements'))}
      </div>
    </div>
  );
}
