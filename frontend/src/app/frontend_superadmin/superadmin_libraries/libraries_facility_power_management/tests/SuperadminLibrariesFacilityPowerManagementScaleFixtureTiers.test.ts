// RESPONSIBILITY: Verify the feature-local deterministic scale fixture sizes and source immutability.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ZONES } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/mocks/fixtures/SuperadminLibrariesOverviewFacilityPowerManagementMockFixtures';
import { createSuperadminLibrariesFacilityPowerManagementScaleTier, MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/mocks/fixtures/superadmin_libraries_facility_power_management.scale-stress-fixtures';

describe('libraries_facility_power_management deterministic scale fixture tiers', () => {
  it('provides the required 10, 100, and 500 record tiers from local synthetic fixtures', () => {
    expect(MOCK_SCALE_TIER_1_SMALL).toHaveLength(10);
    expect(MOCK_SCALE_TIER_2_STANDARD).toHaveLength(100);
    expect(MOCK_SCALE_TIER_3_STRESS).toHaveLength(500);
  });

  it('preserves the source fixture byte-for-byte while deriving identities', () => {
    const source = JSON.parse(JSON.stringify(SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ZONES));
    const before = JSON.stringify(source);
    const tier = createSuperadminLibrariesFacilityPowerManagementScaleTier(source, 10);
    expect(JSON.stringify(source)).toBe(before);
    expect(tier[0]).not.toBe(source[0]);
    expect(tier[0]).not.toBe(tier[1]);
  });
});
