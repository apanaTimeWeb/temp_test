// Responsibility: AdminSupportPage presentation component owned by admin_support; responsibility folder: admin_support_components_views.
'use client';

// RESPONSIBILITY: Owns Support tab selection and chooses a module-owned panel per tab.
// DATA FLOW: role route -> local tab state -> isolated panel -> localized content or explicit contract-blocked state.
import { useTranslations } from 'next-intl';
import { BookOpen, Info, LifeBuoy } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_SUPPORT_NAVIGATION_ITEMS } from '@/app/frontend_admin/admin_settings/settings_support/config/admin_settings_support.url_config';
import { ADMIN_SUPPORT_FAQ_FIXTURES, ADMIN_SUPPORT_ANNOUNCEMENT_FIXTURES, ADMIN_SUPPORT_DOCUMENTATION_FIXTURES } from '@/app/frontend_admin/admin_settings/settings_support/mocks/scenarios/admin_settings_support.scenarios';
import useAdminSupportTabState from '@/app/frontend_admin/admin_settings/settings_support/hooks/useAdminSettingsSupportTabState';
import AdminSupportTicketsPanel from '@/app/frontend_admin/admin_settings/settings_support/components/AdminSettingsSupportTicketsPanel';
import AdminSupportSystemStatusPanel from '@/app/frontend_admin/admin_settings/settings_support/components/AdminSettingsSupportSystemStatusPanel';

export default function AdminSupportPage() {
  const t = useTranslations('ADMIN_SUPPORT');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [activeTab, setActiveTab] = useAdminSupportTabState();
  const renderUnavailableState = (section: 'tickets' | 'status' | 'announcements') => {
    const titleKey = section === 'tickets' ? 'UNAVAILABLE_TICKETS_TITLE' : section === 'status' ? 'UNAVAILABLE_STATUS_TITLE' : 'UNAVAILABLE_ANNOUNCEMENTS_TITLE';
    const descriptionKey = section === 'tickets' ? 'UNAVAILABLE_TICKETS_DESCRIPTION' : section === 'status' ? 'UNAVAILABLE_STATUS_DESCRIPTION' : 'UNAVAILABLE_ANNOUNCEMENTS_DESCRIPTION';
    return <section className="rounded-lg border border-border bg-card p-6" role="status" aria-live="polite"><div className="flex items-start gap-3"><Info size={20} strokeWidth={2} className="mt-0.5 shrink-0 text-text-secondary" aria-hidden="true" /><div className="min-w-0"><h2 className="text-base font-semibold text-text-primary">{t(titleKey)}</h2><p className="mt-2 text-sm text-text-secondary">{t(descriptionKey)}</p></div></div></section>;
  };
  const helpCenterPanel = <section className="admin-card" aria-labelledby="admin-support-faq-title"><h2 id="admin-support-faq-title" className="text-base font-semibold text-text-primary">{t('FAQ_TITLE')}</h2><div className="mt-4 space-y-4">{ADMIN_SUPPORT_FAQ_FIXTURES.map((faq) => <article key={faq.questionKey} className="rounded-md border border-border p-4"><h3 className="font-semibold text-text-primary">{t(faq.questionKey)}</h3><p className="mt-1 text-sm text-text-secondary">{t(faq.answerKey)}</p></article>)}</div></section>;
  const announcementsPanel = <section className="admin-card" aria-labelledby="admin-support-announcements-title"><h2 id="admin-support-announcements-title" className="text-base font-semibold text-text-primary">{t('ANNOUNCEMENTS_TITLE')}</h2><div className="mt-4 space-y-3">{ADMIN_SUPPORT_ANNOUNCEMENT_FIXTURES.map((announcement) => <article key={announcement.titleKey} className="rounded-md border border-border p-4"><p className="text-xs text-text-secondary">{t(announcement.dateKey)}</p><h3 className="mt-1 font-semibold text-text-primary">{t(announcement.titleKey)}</h3><p className="mt-2 text-sm text-text-secondary">{t(announcement.contentKey)}</p></article>)}</div></section>;
  const documentationPanel = <section className="admin-card" aria-labelledby="admin-support-docs-title"><h2 id="admin-support-docs-title" className="text-base font-semibold text-text-primary">{t('DOCS_TITLE')}</h2><p className="mt-2 text-sm text-text-secondary">{t('DOCS_DESCRIPTION')}</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label={t('DOCS_LIST_LABEL')}>{ADMIN_SUPPORT_DOCUMENTATION_FIXTURES.map((document, index) => { const Icon = index === 2 ? LifeBuoy : BookOpen; return <div key={document.titleKey} role="listitem" className="flex items-start gap-3 rounded-md border border-border p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-input text-text-secondary" aria-hidden="true"><Icon size={18} strokeWidth={2} /></div><div className="min-w-0"><h3 className="font-semibold text-text-primary">{t(document.titleKey)}</h3><p className="mt-1 text-sm text-text-secondary">{t('DOCS_RESOURCE_UNAVAILABLE')}</p></div></div>; })}</div></section>;

  return (
    <div className="space-y-4 mx-auto max-w-[1200px] p-6" >
      <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">
        {t(isDemoMode ? 'DEMO_PREVIEW_NOTICE' : 'LIVE_UNAVAILABLE_NOTICE')}
      </p>
      <header>
        <h1 className="text-page-title font-bold text-text-primary">{t('PAGE_TITLE')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('PAGE_SUBTITLE')}</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="admin-card flex gap-2 overflow-x-auto lg:flex-col" aria-label={t('SUPPORT_SECTIONS_LABEL')}>
          {ADMIN_SUPPORT_NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const selected = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-testid={`admin_support-AdminSupportPage-navigation-${item.id}`}
                aria-current={selected ? 'page' : undefined}
                aria-pressed={selected}
                onClick={() => setActiveTab(item.id)}
                className={`admin-tab-button min-h-11 shrink-0 ${selected ? 'admin-tab-button-active' : ''}`}
              >
                <Icon size={18} strokeWidth={2} className={selected ? 'text-primary' : 'text-text-secondary'} aria-hidden="true" />
                {t(item.labelKey)}
              </button>
            );
          })}
        </nav>
        <div className="min-w-0" aria-live="polite">
          {activeTab === 'help' && helpCenterPanel}
          {activeTab === 'tickets' && (isDemoMode ? <AdminSupportTicketsPanel /> : renderUnavailableState('tickets'))}
          {activeTab === 'status' && (isDemoMode ? <AdminSupportSystemStatusPanel /> : renderUnavailableState('status'))}
          {activeTab === 'announcements' && (isDemoMode ? announcementsPanel : renderUnavailableState('announcements'))}
          {activeTab === 'docs' && documentationPanel}
        </div>
      </div>
    </div>
  );
}
