// RESPONSIBILITY: Define source-level test coverage for libraries library capacity gap filling using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_library_capacity_gap_filling/tests/SuperadminLibrariesOverviewLibraryCapacityGapFillingPreviewDisclosure.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const pageClient = readFileSync(new URL('../components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx', import.meta.url), 'utf8');
const englishCatalog = JSON.parse(readFileSync(new URL('../locales/superadmin_libraries_overview_library_capacity_gap_filling_en.json', import.meta.url), 'utf8')) as Record<string, unknown>;

describe('libraries_library_capacity_gap_filling preview disclosure contract', () => {
  it('visibly discloses preview-only data and does not invent a backend call', () => {
    expect(pageClient).toContain('PREVIEW_ONLY_DISCLOSURE');
    expect(pageClient).toContain('STATIC_SAMPLE_NO_FILTER_CONTRACT');
    expect(pageClient).not.toContain('RUN_GAP_ANALYSIS');
    expect(pageClient).not.toContain('setAnalyzed');
    expect(pageClient).not.toMatch(/\bfetch\s*\(/);
    expect(pageClient).not.toContain('axios.');
    const serialized = JSON.stringify(englishCatalog);
    expect(serialized).toContain('PREVIEW_ONLY_DISCLOSURE');
  });
});
