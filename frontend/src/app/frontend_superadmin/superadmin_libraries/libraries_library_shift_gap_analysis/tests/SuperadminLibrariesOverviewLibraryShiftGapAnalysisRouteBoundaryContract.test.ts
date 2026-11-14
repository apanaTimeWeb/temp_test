// RESPONSIBILITY: Define source-level test coverage for libraries library shift gap analysis using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_library_shift_gap_analysis/tests/SuperadminLibrariesOverviewLibraryShiftGapAnalysisRouteBoundaryContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MODULE_ROOT = resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_libraries/libraries_library_shift_gap_analysis');
const COMPONENTS = resolve(MODULE_ROOT, 'components');

describe('superadmin_libraries/libraries_library_shift_gap_analysis route boundary contract', () => {
  it('wires accessible loading and retryable error boundaries', () => {
    const loading = readFileSync(resolve(MODULE_ROOT, 'loading.tsx'), 'utf8');
    const error = readFileSync(resolve(MODULE_ROOT, 'error.tsx'), 'utf8');
    const skeleton = readFileSync(resolve(COMPONENTS, 'SuperadminLibrariesOverviewLibraryShiftGapAnalysisRouteSkeleton.tsx'), 'utf8');
    const fallback = readFileSync(resolve(COMPONENTS, 'SuperadminLibrariesOverviewLibraryShiftGapAnalysisErrorFallback.tsx'), 'utf8');
    expect(loading).toContain('SuperadminLibrariesOverviewLibraryShiftGapAnalysisRouteSkeleton');
    expect(error).toContain('SuperadminLibrariesOverviewLibraryShiftGapAnalysisErrorFallback');
    expect(skeleton).toContain('role="status"');
    expect(skeleton).toContain('aria-busy="true"');
    expect(skeleton).toContain('motion-reduce:animate-none');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('onClick={onRetry}');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
  });

  it('has localized not-found recovery in both supported locales', () => {
    const notFound = readFileSync(resolve(MODULE_ROOT, 'not-found.tsx'), 'utf8');
    const en = JSON.parse(readFileSync(resolve(MODULE_ROOT, 'locales/superadmin_libraries_overview_library_shift_gap_analysis_en.json'), 'utf8'));
    const hi = JSON.parse(readFileSync(resolve(MODULE_ROOT, 'locales/superadmin_libraries_overview_library_shift_gap_analysis_hi.json'), 'utf8'));
    expect(notFound).toContain('COPY.MODULE_NOT_FOUND_TITLE');
    expect(notFound).toContain('href={SUPERADMIN_DASHBOARD_ROUTE}');
    for (const locale of [en, hi]) {
      expect(locale['SUPERADMIN_ACCOUNTING'].COPY.MODULE_NOT_FOUND_TITLE).toBeTruthy();
      expect(locale['SUPERADMIN_ACCOUNTING'].COPY.MODULE_NOT_FOUND_MESSAGE).toBeTruthy();
      expect(locale['SUPERADMIN_ACCOUNTING'].COPY.BACK_TO_DASHBOARD).toBeTruthy();
    }
  });
});
