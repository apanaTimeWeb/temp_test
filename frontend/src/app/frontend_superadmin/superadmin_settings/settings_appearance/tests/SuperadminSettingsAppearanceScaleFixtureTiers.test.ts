// RESPONSIBILITY: Define source-level test coverage for settings appearance using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_appearance/tests/SuperadminSettingsAppearanceScaleFixtureTiers.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS } from '../mocks/fixtures/superadmin_settings_appearance.scale-stress-fixtures';

describe('settings_appearance local preview scale fixture tiers', () => {
  it('provides deterministic 10, 100, and 500 record tiers', () => {
    expect(MOCK_SCALE_TIER_1_SMALL).toHaveLength(10);
    expect(MOCK_SCALE_TIER_2_STANDARD).toHaveLength(100);
    expect(MOCK_SCALE_TIER_3_STRESS).toHaveLength(500);
  });
  it('uses unique fixture identities and independent preview objects', () => {
    const ids = MOCK_SCALE_TIER_3_STRESS.map((record) => record.fixtureId);
    expect(new Set(ids).size).toBe(500);
    expect(MOCK_SCALE_TIER_1_SMALL[0].previewData).not.toBe(MOCK_SCALE_TIER_1_SMALL[1].previewData);
  });
});
