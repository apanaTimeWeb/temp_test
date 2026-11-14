// RESPONSIBILITY: Verify local scale fixture tiers and original fixture immutability.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_ACCOUNTING_SAMPLE_SEAT_GAPS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/mocks/fixtures/SuperadminLibrariesOverviewLibraryCapacityAnalysisSeatGapMockFixtures';
import { createSuperadminLibraryCapacityAnalysisScaleTier, MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/mocks/fixtures/superadmin_libraries_library_capacity_analysis.scale-stress-fixtures';

describe('libraries_library_capacity_analysis deterministic scale fixture tiers', () => {
  it('provides the required 10, 100, and 500 record tiers', () => {
    expect(MOCK_SCALE_TIER_1_SMALL).toHaveLength(10);
    expect(MOCK_SCALE_TIER_2_STANDARD).toHaveLength(100);
    expect(MOCK_SCALE_TIER_3_STRESS).toHaveLength(500);
  });

  it('does not mutate the original fixture records', () => {
    const source = JSON.parse(JSON.stringify(SUPERADMIN_ACCOUNTING_SAMPLE_SEAT_GAPS));
    const before = JSON.stringify(source);
    const tier = createSuperadminLibraryCapacityAnalysisScaleTier(source, 10);
    expect(JSON.stringify(source)).toBe(before);
    expect(tier[0]).not.toBe(source[0]);
    expect(tier[0]).not.toBe(tier[1]);
  });
});
