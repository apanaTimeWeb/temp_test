// RESPONSIBILITY: Verify local scale fixture tiers and original fixture immutability.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SYSTEM_SAMPLE_SEAT_GAPS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/mocks/fixtures/SuperadminLibrariesOverviewLibraryCapacityGapFillingMockFixtures';
import { createSuperadminLibraryCapacityGapFillingScaleTier, MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/mocks/fixtures/superadmin_libraries_library_capacity_gap_filling.scale-stress-fixtures';

describe('libraries_library_capacity_gap_filling deterministic scale fixture tiers', () => {
  it('provides the required 10, 100, and 500 record tiers', () => {
    expect(MOCK_SCALE_TIER_1_SMALL).toHaveLength(10);
    expect(MOCK_SCALE_TIER_2_STANDARD).toHaveLength(100);
    expect(MOCK_SCALE_TIER_3_STRESS).toHaveLength(500);
  });

  it('does not mutate the original sample fixture records', () => {
    const source = JSON.parse(JSON.stringify(SUPERADMIN_SYSTEM_SAMPLE_SEAT_GAPS));
    const before = JSON.stringify(source);
    const tier = createSuperadminLibraryCapacityGapFillingScaleTier(source, 10);
    expect(JSON.stringify(source)).toBe(before);
    expect(tier[0]).not.toBe(source[0]);
    expect(tier[0]).not.toBe(tier[1]);
  });
});
