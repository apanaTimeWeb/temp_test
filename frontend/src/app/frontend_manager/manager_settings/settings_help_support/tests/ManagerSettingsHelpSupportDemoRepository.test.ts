import { describe, expect, it } from 'vitest';
import { MANAGER_HELP_SUPPORT_SAMPLE_TICKETS } from '@/app/frontend_manager/manager_settings/settings_help_support/hooks/ManagerSettingsHelpSupportDemoRepository';
import { MANAGER_HELP_SUPPORT_SAMPLE_TICKETS as FIXTURE_SOURCE } from '@/app/frontend_manager/manager_settings/settings_help_support/mocks/manager_settings_help_support_fixtures/ManagerSettingsHelpSupportSampleFixtures';

describe('ManagerSettingsHelpSupportDemoRepository', () => {
  it('returns a defensive sample snapshot rather than aliasing fixture objects', () => {
    expect(MANAGER_HELP_SUPPORT_SAMPLE_TICKETS).not.toBe(FIXTURE_SOURCE);
    expect(MANAGER_HELP_SUPPORT_SAMPLE_TICKETS[0]).not.toBe(FIXTURE_SOURCE[0]);
    expect(MANAGER_HELP_SUPPORT_SAMPLE_TICKETS[0]).toEqual(FIXTURE_SOURCE[0]);
  });
});
