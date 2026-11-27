import {
  MANAGER_HELP_SUPPORT_DEMO_ANNOUNCEMENTS,
  MANAGER_HELP_SUPPORT_DEMO_DOCUMENTATION_ARTICLES,
  MANAGER_HELP_SUPPORT_DEMO_TICKETS,
  type ManagerSettingsHelpSupportDemoTicket,
} from '@/app/frontend_manager/manager_settings/settings_help_support/config/manager_settings_help_support.demo_data';

/** Module-owned sample repository detached from test-only mocks. */
export type ManagerSettingsHelpSupportSampleTicket = ManagerSettingsHelpSupportDemoTicket;

export const MANAGER_HELP_SUPPORT_SAMPLE_TICKETS = MANAGER_HELP_SUPPORT_DEMO_TICKETS.map((record) => ({ ...record }));
export const MANAGER_HELP_SUPPORT_SAMPLE_DOCUMENTATION_ARTICLES = MANAGER_HELP_SUPPORT_DEMO_DOCUMENTATION_ARTICLES.map((record) => ({ ...record }));
export const MANAGER_HELP_SUPPORT_SAMPLE_ANNOUNCEMENTS = MANAGER_HELP_SUPPORT_DEMO_ANNOUNCEMENTS.map((record) => ({ ...record }));
