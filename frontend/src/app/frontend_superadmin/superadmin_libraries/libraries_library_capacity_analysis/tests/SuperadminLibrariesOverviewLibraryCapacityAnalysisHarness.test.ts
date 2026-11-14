// RESPONSIBILITY: Define source-level test coverage for libraries library capacity analysis using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_library_capacity_analysis/tests/SuperadminLibrariesOverviewLibraryCapacityAnalysisHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_ANALYSIS_ROUTES as __SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_ANALYSIS_ROUTES } from "@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/config/libraries_library_capacity_analysis.url_config";
import { SUPERADMIN_ACCOUNTING_SEAT_GAP_REPORT_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/api/superadmin_libraries_overview_library_capacity_analysis.query_keys';

describe('library_capacity_analysis standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_ANALYSIS_ROUTES.SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_ANALYSIS_URLS.PAGE).toBe('/superadmin/superadmin_libraries/libraries_library_capacity_analysis');
    expect(__SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_ANALYSIS_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_ANALYSIS_ACCOUNTING_SEAT_GAP_REPORT_URLS.SCREEN).toBe("/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_analysis");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_ACCOUNTING_SEAT_GAP_REPORT_QUERY_KEYS.all[0]).toBe('superadmin_library_capacity_analysis');
  });
});
