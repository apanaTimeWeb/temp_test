// RESPONSIBILITY: Define source-level test coverage for settings overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_overview/tests/SuperadminSettingsOverviewSchema.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SETTINGS_SCHEMA } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/schemas/SuperadminSettingsOverviewSchema';
import { SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/mocks/fixtures/SuperadminSettingsOverviewPreviewDefaults';

describe('superadmin settings schema', () => {
  it('accepts the feature-owned preview defaults', () => {
    expect(SUPERADMIN_SETTINGS_SCHEMA.safeParse(SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS).success).toBe(true);
  });

  it('rejects an invalid support email', () => {
    const invalid = {
      ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
      generalConfig: { ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS.generalConfig, supportEmail: 'not-an-email' },
    };
    expect(SUPERADMIN_SETTINGS_SCHEMA.safeParse(invalid).success).toBe(false);
  });

  it('requires a non-empty maintenance message only when maintenance mode is enabled', () => {
    const enabledWithoutMessage = {
      ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
      maintenance: { enabled: true, message: ' ' },
    };
    const disabledWithoutMessage = {
      ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
      maintenance: { enabled: false, message: ' ' },
    };
    expect(SUPERADMIN_SETTINGS_SCHEMA.safeParse(enabledWithoutMessage).success).toBe(false);
    expect(SUPERADMIN_SETTINGS_SCHEMA.safeParse(disabledWithoutMessage).success).toBe(true);
  });
});
