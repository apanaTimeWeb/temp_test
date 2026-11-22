'use client';
// Responsibility: AdminSupportPage presentation component owned by admin_support; responsibility folder: admin_support_components_views.

// RESPONSIBILITY: Owns Support tab selection and chooses a module-owned panel per tab.
// DATA FLOW: role route -> local tab state -> isolated panel -> localized content or explicit contract-blocked state.
import AdminSupportTicketsPanel from '@/app/frontend_admin/admin_settings/settings_support/components/AdminSettingsSupportTicketsPanel';
import { ADMIN_SUPPORT_NAVIGATION_ITEMS } from '@/app/frontend_admin/admin_settings/settings_support/config/admin_settings_support.url_config';
import useAdminSupportTabState from '@/app/frontend_admin/admin_settings/settings_support/hooks/useAdminSettingsSupportTabState';
import { ADMIN_SUPPORT_ANNOUNCEMENT_FIXTURES } from '@/app/frontend_admin/admin_settings/settings_support/mocks/scenarios/admin_settings_support.scenarios';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { BellRing,Headphones,Info,LifeBuoy,ShieldCheck } from 'lucide-react';
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
        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl border shrink-0 bg-amber-500/15 border-amber-500/30 text-amber-400">
            <Info size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-white">{t(titleKey)}</h2>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{t(descriptionKey)}</p>
          </div>
        </div>
      </section>
    );
  };

  const announcementsPanel = (
    <section
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-5"
      aria-labelledby="admin-support-announcements-title"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2
            id="admin-support-announcements-title"
            className="text-lg font-bold text-white flex items-center gap-2"
          >
            <BellRing size={18} className="text-amber-400" />
            <span>{t('ANNOUNCEMENTS_TITLE')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Platform maintenance notices and verified operational bulletins
          </p>
        </div>
        <span className="self-start sm:self-auto text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
          {ADMIN_SUPPORT_ANNOUNCEMENT_FIXTURES.length} Active Bulletins
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ADMIN_SUPPORT_ANNOUNCEMENT_FIXTURES.map((announcement) => (
          <article
            key={announcement.titleKey}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-800/40 space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                  {t(announcement.dateKey)}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <h3 className="font-bold text-sm text-slate-100">{t(announcement.titleKey)}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{t(announcement.contentKey)}</p>
            </div>
            <div className="pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Operational Bulletin</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">Verified</span>
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
            : 'rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300'
        }
      >
        {t(isDemoMode ? 'DEMO_PREVIEW_NOTICE' : 'LIVE_UNAVAILABLE_NOTICE')}
      </p>

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-300">
            <Headphones size={13} className="text-indigo-400" />
            <span>Administrator Priority Helpdesk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <LifeBuoy size={18} />
            </div>
            <span>{t('PAGE_TITLE')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            {t('PAGE_SUBTITLE')}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck size={16} />
          </div>
          <div>
            <span className="font-semibold text-white block">Priority SLA</span>
            <span className="text-[11px] text-emerald-400 font-mono">&lt; 15 min response time</span>
          </div>
        </div>
      </header>

      {/* Navigation Toolbar */}
      <nav
        className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto"
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
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                selected
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-950/40 border border-indigo-500/40'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <Icon
                size={15}
                strokeWidth={2.2}
                className={selected ? 'text-white' : 'text-slate-400'}
                aria-hidden="true"
              />
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>

      {/* Panel Content Area */}
      <div className="min-w-0" aria-live="polite">
        {activeTab === 'tickets' &&
          (isDemoMode ? <AdminSupportTicketsPanel /> : renderUnavailableState('tickets'))}
        {activeTab === 'announcements' &&
          (isDemoMode ? announcementsPanel : renderUnavailableState('announcements'))}
      </div>
    </div>
  );
}
