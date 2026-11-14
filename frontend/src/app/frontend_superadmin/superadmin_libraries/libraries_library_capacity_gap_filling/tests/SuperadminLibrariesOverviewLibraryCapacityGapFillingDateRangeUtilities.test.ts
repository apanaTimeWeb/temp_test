// RESPONSIBILITY: Define source-level test coverage for libraries library capacity gap filling using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_library_capacity_gap_filling/tests/SuperadminLibrariesOverviewLibraryCapacityGapFillingDateRangeUtilities.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import {
  SuperadminLibrariesOverviewGetDefaultUtcDateRange,
  SuperadminLibrariesOverviewIsValidUtcCalendarDate,
} from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/utils/SuperadminLibrariesOverviewLibraryCapacityGapFillingDateRangeUtilities';

describe('SuperadminLibrariesOverviewLibraryCapacityGapFillingDateRangeUtilities', () => {
  it('creates a rolling UTC date range independent of local timezone', () => {
    expect(SuperadminLibrariesOverviewGetDefaultUtcDateRange(new Date('2026-10-26T23:30:00.000Z')))
      .toEqual({ fromDate: '2026-10-26', toDate: '2026-11-02' });
  });

  it('rejects impossible calendar dates and accepts valid UTC date-only values', () => {
    expect(SuperadminLibrariesOverviewIsValidUtcCalendarDate('2026-02-29')).toBe(false);
    expect(SuperadminLibrariesOverviewIsValidUtcCalendarDate('2024-02-29')).toBe(true);
    expect(SuperadminLibrariesOverviewIsValidUtcCalendarDate('2026-13-01')).toBe(false);
  });
});
