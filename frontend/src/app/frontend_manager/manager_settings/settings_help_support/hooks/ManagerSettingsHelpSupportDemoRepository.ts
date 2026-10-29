/**
 * Module-owned, sample-only repository implementation. Each exported collection/object is a defensive
 * snapshot of the authored fixture data; these values are not a persistence or API contract.
 */
import type { ManagerSettingsHelpSupportSampleTicket as ManagerSettingsHelpSupportSampleTicketFixture } from '@/app/frontend_manager/manager_settings/settings_help_support/mocks/manager_settings_help_support_fixtures/ManagerSettingsHelpSupportSampleFixtures';
import { MANAGER_HELP_SUPPORT_SAMPLE_TICKETS as MANAGER_HELP_SUPPORT_SAMPLE_TICKETSFixture } from '@/app/frontend_manager/manager_settings/settings_help_support/mocks/manager_settings_help_support_fixtures/ManagerSettingsHelpSupportSampleFixtures';
import { MANAGER_HELP_SUPPORT_SAMPLE_DOCUMENTATION_ARTICLES as MANAGER_HELP_SUPPORT_SAMPLE_DOCUMENTATION_ARTICLESFixture } from '@/app/frontend_manager/manager_settings/settings_help_support/mocks/manager_settings_help_support_fixtures/ManagerSettingsHelpSupportContentFixtures';
import { MANAGER_HELP_SUPPORT_SAMPLE_ANNOUNCEMENTS as MANAGER_HELP_SUPPORT_SAMPLE_ANNOUNCEMENTSFixture } from '@/app/frontend_manager/manager_settings/settings_help_support/mocks/manager_settings_help_support_fixtures/ManagerSettingsHelpSupportContentFixtures';

/** DATA FLOW: Module-owned sample fixtures -> defensive demo repository exports -> feature preview; sample data is not persistence. */

export type ManagerSettingsHelpSupportSampleTicket = ManagerSettingsHelpSupportSampleTicketFixture;
export const MANAGER_HELP_SUPPORT_SAMPLE_TICKETS = MANAGER_HELP_SUPPORT_SAMPLE_TICKETSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_HELP_SUPPORT_SAMPLE_DOCUMENTATION_ARTICLES = MANAGER_HELP_SUPPORT_SAMPLE_DOCUMENTATION_ARTICLESFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_HELP_SUPPORT_SAMPLE_ANNOUNCEMENTS = MANAGER_HELP_SUPPORT_SAMPLE_ANNOUNCEMENTSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
