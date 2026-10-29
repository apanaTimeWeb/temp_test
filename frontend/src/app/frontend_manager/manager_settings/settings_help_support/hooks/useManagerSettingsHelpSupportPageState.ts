import { MANAGER_HELP_SUPPORT_SAMPLE_TICKETS } from '@/app/frontend_manager/manager_settings/settings_help_support/hooks/ManagerSettingsHelpSupportDemoRepository';
import { MANAGER_HELP_SUPPORT_SAMPLE_DOCUMENTATION_ARTICLES, MANAGER_HELP_SUPPORT_SAMPLE_ANNOUNCEMENTS } from '@/app/frontend_manager/manager_settings/settings_help_support/hooks/ManagerSettingsHelpSupportDemoRepository';
import { useEffect, useState } from 'react';
import type { ManagerSettingsHelpSupportDocumentationCategory, ManagerSettingsHelpSupportTabName, ManagerSettingsHelpSupportTicketTab } from '@/app/frontend_manager/manager_settings/settings_help_support/types/ManagerSettingsHelpSupportTypes';
import { MANAGER_SETTINGS_HELP_SUPPORT_SEARCH_DEBOUNCE_MS } from '@/app/frontend_manager/manager_settings/settings_help_support/constants/ManagerSettingsHelpSupportConstants';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Keeps help-center tab, ticket tab, and documentation filter state inside the owning module. */
export function useManagerHelpSupportPageState() {
  const [activeTab, setActiveTab] = useState<ManagerSettingsHelpSupportTabName>('Help Center');
  const [ticketTab, setTicketTab] = useState<ManagerSettingsHelpSupportTicketTab>('My Tickets');
  const [documentationQuery, setDocumentationQuery] = useState('');
  const [debouncedDocumentationQuery, setDebouncedDocumentationQuery] = useState(documentationQuery);
  // Dependency rationale: debounce documentation search so category and result filtering updates only after the user pauses typing.
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedDocumentationQuery(documentationQuery), MANAGER_SETTINGS_HELP_SUPPORT_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [documentationQuery]);
  const [documentationCategory, setDocumentationCategory] = useState<ManagerSettingsHelpSupportDocumentationCategory>('All');

  return {
    activeTab,
    setActiveTab,
    ticketTab,
    setTicketTab,
    documentationQuery,
    setDocumentationQuery,
    debouncedDocumentationQuery,
    documentationCategory,
    setDocumentationCategory,
    myTickets: MANAGER_HELP_SUPPORT_SAMPLE_TICKETS.map((ticket) => ({ ...ticket })),
    documentationArticles: MANAGER_HELP_SUPPORT_SAMPLE_DOCUMENTATION_ARTICLES.map((article) => ({ ...article })),
    announcements: MANAGER_HELP_SUPPORT_SAMPLE_ANNOUNCEMENTS.map((announcement) => ({ ...announcement })),
  };
}
