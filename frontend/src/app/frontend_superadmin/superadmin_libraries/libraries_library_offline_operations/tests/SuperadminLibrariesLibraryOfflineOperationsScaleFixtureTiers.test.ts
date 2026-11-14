// RESPONSIBILITY: Define source-level test coverage for libraries library offline operations using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_library_offline_operations/tests/SuperadminLibrariesLibraryOfflineOperationsScaleFixtureTiers.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS } from '../mocks/fixtures/superadmin_libraries_library_offline_operations.scale-stress-fixtures';
import { SUPERADMIN_SYSTEM_OFFLINE_FEATURES } from '../constants/SuperadminLibrariesOverviewLibraryOfflineOperationsFeatures';

describe('libraries_library_offline_operations local preview scale fixture tiers', () => {
  const sourceSnapshot = JSON.stringify(SUPERADMIN_SYSTEM_OFFLINE_FEATURES);
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
  it('keeps the canonical source fixture immutable while deriving preview tiers', () => {
    const derived = MOCK_SCALE_TIER_1_SMALL[0].previewData;
    derived['__immutability_probe'] = 'local-only';
    expect(JSON.stringify(SUPERADMIN_SYSTEM_OFFLINE_FEATURES)).toBe(sourceSnapshot);
  });

});
