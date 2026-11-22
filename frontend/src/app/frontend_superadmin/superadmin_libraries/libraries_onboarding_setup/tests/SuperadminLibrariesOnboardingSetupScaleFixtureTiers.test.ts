// RESPONSIBILITY: Define source-level test coverage for libraries onboarding setup using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_onboarding_setup/tests/SuperadminLibrariesOnboardingSetupScaleFixtureTiers.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS } from '../mocks/fixtures/superadmin_libraries_onboarding_setup.scale-stress-fixtures';
import { SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA } from '../mocks/fixtures/SuperadminLibrariesOnboardingSetupPreviewMockFixtures';

describe('libraries_onboarding_setup local preview scale fixture tiers', () => {
  const sourceSnapshot = JSON.stringify(SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA);
  it('provides deterministic 10, 100, and 500 record tiers', () => {
    expect(MOCK_SCALE_TIER_1_SMALL).toHaveLength(10);
    expect(MOCK_SCALE_TIER_2_STANDARD).toHaveLength(100);
    expect(MOCK_SCALE_TIER_3_STRESS).toHaveLength(500);
  });
  it('uses unique fixture identities and independent preview objects', () => {
    const ids = MOCK_SCALE_TIER_3_STRESS.map((record) => record.fixtureId);
    expect(new Set(ids).size).toBe(500);
    expect(ids.every((id) => id.startsWith('libraries_onboarding_setup-preview-scale-'))).toBe(true);
    expect(MOCK_SCALE_TIER_1_SMALL[0].previewData).not.toBe(MOCK_SCALE_TIER_1_SMALL[1].previewData);
    MOCK_SCALE_TIER_1_SMALL[0].previewData['__immutability_probe'] = 'local-only';
    expect(JSON.stringify(SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA)).toBe(sourceSnapshot);
  });
});
