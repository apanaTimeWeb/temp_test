// RESPONSIBILITY: Define source-level test coverage for settings appearance using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_appearance/tests/SuperadminSettingsAppearanceQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SETTINGS_APPEARANCE_QUERY_KEYS } from '../api/superadmin_settings_appearance.query_keys';

describe('settings_appearance canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_SETTINGS_APPEARANCE_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_settings', 'settings_appearance']);
    expect(SUPERADMIN_SETTINGS_APPEARANCE_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_SETTINGS_APPEARANCE_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_SETTINGS_APPEARANCE_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_SETTINGS_APPEARANCE_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
