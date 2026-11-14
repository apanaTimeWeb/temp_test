// RESPONSIBILITY: Define source-level test coverage for libraries library waitlist automation using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_library_waitlist_automation/tests/SuperadminLibrariesLibraryWaitlistAutomationScaleFixtureTiers.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS } from '../mocks/fixtures/superadmin_libraries_library_waitlist_automation.scale-stress-fixtures';
import { SUPERADMIN_SYSTEM_WAITLIST_SAMPLE_QUEUE } from '../mocks/fixtures/SuperadminLibrariesOverviewLibraryWaitlistAutomationWaitlistMockFixtures';

describe('libraries_library_waitlist_automation deterministic scale fixture tiers', () => {
  const sourceSnapshot = JSON.stringify(SUPERADMIN_SYSTEM_WAITLIST_SAMPLE_QUEUE);
  it('provides the required 10, 100, and 500 record tiers from local synthetic fixtures', () => {
    expect(MOCK_SCALE_TIER_1_SMALL).toHaveLength(10);
    expect(MOCK_SCALE_TIER_2_STANDARD).toHaveLength(100);
    expect(MOCK_SCALE_TIER_3_STRESS).toHaveLength(500);
  });
  it('uses independent clones and keeps nested source fixture records immutable', () => {
    expect(MOCK_SCALE_TIER_1_SMALL[0]).not.toBe(MOCK_SCALE_TIER_1_SMALL[1]);
    (MOCK_SCALE_TIER_1_SMALL[0] as Record<string, unknown>)['__immutability_probe'] = 'local-only';
    expect(JSON.stringify(SUPERADMIN_SYSTEM_WAITLIST_SAMPLE_QUEUE)).toBe(sourceSnapshot);
  });
});
