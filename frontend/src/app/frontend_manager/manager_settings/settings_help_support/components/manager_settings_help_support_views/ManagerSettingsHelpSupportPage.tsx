'use client';
// RESPONSIBILITY: Provide the page/orchestration entry component for the components feature. It does not own backend persistence or cross-feature business logic.
import { ManagerSettingsHelpSupportEmptyState } from '@/app/frontend_manager/manager_settings/settings_help_support/components/ManagerSettingsHelpSupportEmptyState';
import { useLocale, useTranslations } from 'next-intl';

import { useManagerHelpSupportPageState } from '@/app/frontend_manager/manager_settings/settings_help_support/hooks/useManagerSettingsHelpSupportPageState';
import { ManagerSettingsHelpSupportTicketForm } from '@/app/frontend_manager/manager_settings/settings_help_support/components/manager_settings_help_support_forms/ManagerSettingsHelpSupportTicketForm.tsx';
import { MANAGER_HELP_SUPPORT_TABS, MANAGER_HELP_SUPPORT_DOCUMENTATION_CATEGORIES } from '@/app/frontend_manager/manager_settings/settings_help_support/constants/ManagerSettingsHelpSupportConstants';
import { ManagerSettingsHelpSupportSystemStatusSection } from '@/app/frontend_manager/manager_settings/settings_help_support/components/manager_settings_help_support_sections/ManagerSettingsHelpSupportSystemStatusSection.tsx';
import { ManagerSettingsHelpSupportHelpCenterSection } from '@/app/frontend_manager/manager_settings/settings_help_support/components/manager_settings_help_support_sections/ManagerSettingsHelpSupportHelpCenterSection.tsx';
import { ManagerSettingsHelpSupportTabs } from '@/app/frontend_manager/manager_settings/settings_help_support/components/manager_settings_help_support_sections/ManagerSettingsHelpSupportTabs.tsx';
import { formatManagerHelpSupportCalendarDate } from '@/app/frontend_manager/manager_settings/settings_help_support/utils/ManagerSettingsHelpSupportDateFormatting';
import {
  Megaphone, Plus, Search, FileText, CheckCircle, Clock
} from 'lucide-react';


export default function ManagerSettingsHelpSupportPage() {
  const tManagerUi = useTranslations('manager.manager_help_support.ui');
  const locale = useLocale();

  const { activeTab, setActiveTab, ticketTab, setTicketTab, documentationQuery, setDocumentationQuery, debouncedDocumentationQuery, documentationCategory, setDocumentationCategory, myTickets, documentationArticles, announcements } = useManagerHelpSupportPageState();
  
  const visibleDocumentationArticles = documentationArticles.filter((article) => {
    const matchesCategory = documentationCategory === 'All' || article.category === documentationCategory;
    const searchableText = `${tManagerUi(article.titleKey)} ${tManagerUi(article.descriptionKey)} ${tManagerUi(article.categoryLabelKey)}`.toLowerCase();
    return matchesCategory && searchableText.includes(debouncedDocumentationQuery.trim().toLowerCase());
  });

  return (
    <div className="mgr-page-animate relative">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="mgr-page-title">{tManagerUi('help_support')}</h1>
          <p className="text-sm text-secondary mt-1">{tManagerUi('get_assistance_view_docs_and_track_support_tickets')}</p>
        </div>
        {activeTab !== 'Support Tickets' && (
          <button type="button" onClick={() => { setActiveTab('Support Tickets'); setTicketTab('Create Ticket'); }} className="mgr-btn-primary self-start md:self-auto">
            <Plus size={16} /> {tManagerUi('raise_a_ticket')}
          </button>
        )}
      </div>

      <ManagerSettingsHelpSupportTabs tabs={MANAGER_HELP_SUPPORT_TABS} activeTab={activeTab} onSelect={setActiveTab} />

      {activeTab === 'Help Center' && <ManagerSettingsHelpSupportHelpCenterSection />}

      {/* ----------------- DOCUMENTATION ----------------- */}
      {activeTab === 'Documentation' && (
        <div className="motion-safe:transition-all motion-safe:duration-base flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="mgr-card p-5">
              <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <label htmlFor="manager-support-docs-search" className="sr-only">{tManagerUi('search_docs')}</label>
                <input id="manager-support-docs-search" type="search" value={documentationQuery} onChange={(event) => setDocumentationQuery(event.target.value)} placeholder={tManagerUi('search_docs')} className="mgr-input pl-10" />
              </div>
              <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">{tManagerUi('categories')}</h4>
              <ul className="space-y-2">
                {MANAGER_HELP_SUPPORT_DOCUMENTATION_CATEGORIES.map((category) => (
                  <li key={category.value}>
                    <button type="button" aria-pressed={documentationCategory === category.value} onClick={() => setDocumentationCategory(category.value)} className={`w-full text-left text-sm px-3 py-2 rounded-md ${documentationCategory === category.value ? 'bg-primary-subtle text-primary font-bold' : 'text-primary hover:bg-card'}`}>
                      {tManagerUi(category.labelKey)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:w-2/3 space-y-4">
            <p className="text-sm text-warning" role="status">{tManagerUi('documentation_sample_content_notice')}</p>
            {visibleDocumentationArticles.length === 0 ? (
              <ManagerSettingsHelpSupportEmptyState className="mgr-card p-6 text-secondary" testId="manager-help-support-docs-empty">{tManagerUi('no_documentation_matches')}</ManagerSettingsHelpSupportEmptyState>
            ) : visibleDocumentationArticles.map((article) => (
              <div key={article.id} className="mgr-card p-5 flex items-start gap-4">
                <div className="p-3 bg-surface-hover rounded-lg text-purple mt-1">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-primary mb-1">{tManagerUi(article.titleKey)}</h3>
                  <p className="text-sm text-secondary mb-2">{tManagerUi(article.descriptionKey)}</p>
                  <span className="text-xs text-purple font-semibold bg-purple-bg px-2 py-1 rounded">{tManagerUi(article.categoryLabelKey)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- SUPPORT TICKETS ----------------- */}
      {activeTab === 'Support Tickets' && (
        <div className="motion-safe:transition-all motion-safe:duration-base">
          {/* Sub Tabs */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              type="button" 
              onClick={() => setTicketTab('My Tickets')}
              aria-pressed={ticketTab === 'My Tickets'}
              className={`pb-2 text-sm font-bold border-b-2 motion-safe:transition-colors ${ticketTab === 'My Tickets' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'}`}
            >
              {tManagerUi('my_tickets')}
            </button>
            <button 
              type="button" 
              onClick={() => setTicketTab('Create Ticket')}
              aria-pressed={ticketTab === 'Create Ticket'}
              className={`pb-2 text-sm font-bold border-b-2 motion-safe:transition-colors ${ticketTab === 'Create Ticket' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'}`}
            >
              {tManagerUi('create_new_ticket')}
            </button>
          </div>

          {ticketTab === 'My Tickets' && (
            <div className="mgr-card p-0 overflow-hidden">
              <p className="p-4 text-sm text-warning" role="status">{tManagerUi('ticket_history_is_sample_data_not_live_user_tickets')}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-card border-b border-border text-secondary text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">{tManagerUi('ticket_id')}</th>
                      <th className="p-4 font-semibold">{tManagerUi('subject')}</th>
                      <th className="p-4 font-semibold">{tManagerUi('category')}</th>
                      <th className="p-4 font-semibold">{tManagerUi('priority')}</th>
                      <th className="p-4 font-semibold">{tManagerUi('status')}</th>
                      <th className="p-4 font-semibold">{tManagerUi('date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTickets.length === 0 ? (
                      <tr>
                        <td colSpan={6}><ManagerSettingsHelpSupportEmptyState className="p-8 text-center text-secondary" testId="manager-help-support-tickets-empty">{tManagerUi('no_tickets_found')}</ManagerSettingsHelpSupportEmptyState></td>
                      </tr>
                    ) : (
                      myTickets.map(t => (
                        <tr key={t.id} className="border-b border-border hover:bg-surface-hover motion-safe:transition-colors">
                          <td className="p-4 text-sm font-medium text-primary">{t.id}</td>
                          <td className="p-4 text-sm text-primary">{t.subject}</td>
                          <td className="p-4 text-sm text-secondary">{t.category === 'Finance' ? tManagerUi('ticket_category_finance') : t.category === 'General' ? tManagerUi('ticket_category_general') : t.category}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              t.priority === 'High' ? 'bg-danger-bg text-danger' :
                              t.priority === 'Medium' ? 'bg-warning-bg text-warning' : 'bg-success-bg text-success'
                            }`}>{t.priority === 'High' ? tManagerUi('high') : t.priority === 'Medium' ? tManagerUi('medium') : t.priority === 'Low' ? tManagerUi('low') : t.priority}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 text-sm">
                              {t.status === 'Open' ? <Clock size={14} className="text-warning"/> : <CheckCircle size={14} className="text-success"/>}
                              <span className={t.status === 'Open' ? 'text-warning' : 'text-success'}>{t.status === 'Open' ? tManagerUi('ticket_status_open') : t.status === 'Closed' ? tManagerUi('ticket_status_closed') : t.status}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-secondary">{formatManagerHelpSupportCalendarDate(t.date, locale)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {ticketTab === 'Create Ticket' && (
            <div className="mgr-card p-6 md:p-8 max-w-3xl">
              <p className="mb-4 text-sm text-warning" data-testid="manager-support-ticket-contract-warning" role="status">{tManagerUi('ticket_creation_is_unavailable_no_authoritative_support_0ec10c')}</p>
              <h2 className="text-xl font-bold text-primary mb-2">{tManagerUi('raise_a_support_ticket')}</h2>
              <p className="text-sm text-secondary mb-8">{tManagerUi('draft_the_issue_details_below_submission_is_disabled_unt_ab6ecc')}</p>
              
              <ManagerSettingsHelpSupportTicketForm onCancel={() => setTicketTab('My Tickets')} />
            </div>
          )}
        </div>
      )}

      {/* ----------------- ANNOUNCEMENTS ----------------- */}
      {activeTab === 'Announcements' && (
        <div className="max-w-4xl space-y-6 motion-safe:transition-all motion-safe:duration-base">
          <p className="text-sm text-warning" role="status">{tManagerUi('announcements_sample_content_notice')}</p>
          {announcements.map((ann) => (
            <div key={ann.id} className="mgr-card p-6 border-l-4 border-l-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Megaphone size={100} />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded border ${ann.colorClass}`}>{tManagerUi(ann.tagKey)}</span>
                <span className="text-sm text-secondary">{formatManagerHelpSupportCalendarDate(ann.date, locale)}</span>
              </div>
              <h2 className="text-xl font-bold text-primary mb-2">{tManagerUi(ann.titleKey)}</h2>
              <p className="text-secondary leading-relaxed">{tManagerUi(ann.descriptionKey)}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'System Status' && <ManagerSettingsHelpSupportSystemStatusSection />}

    </div>
  );
}