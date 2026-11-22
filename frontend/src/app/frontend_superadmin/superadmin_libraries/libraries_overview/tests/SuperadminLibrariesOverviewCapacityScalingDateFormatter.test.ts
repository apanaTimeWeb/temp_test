// RESPONSIBILITY: Define source-level test coverage for libraries overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_overview/tests/SuperadminLibrariesOverviewCapacityScalingDateFormatter.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { formatSuperadminLibrariesOverviewCapacityScalingDateLabel } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/utils/SuperadminLibrariesOverviewCapacityScalingDateFormatter';

describe('formatSuperadminLibrariesOverviewCapacityScalingDateLabel', () => {
  it('formats a valid date-only preview fixture', () => {
    expect(formatSuperadminLibrariesOverviewCapacityScalingDateLabel('2025-04-08', 'en')).not.toBe('—');
  });

  it('rejects malformed dates', () => {
    expect(formatSuperadminLibrariesOverviewCapacityScalingDateLabel('2025-02-31', 'en')).toBe('—');
  });
});
