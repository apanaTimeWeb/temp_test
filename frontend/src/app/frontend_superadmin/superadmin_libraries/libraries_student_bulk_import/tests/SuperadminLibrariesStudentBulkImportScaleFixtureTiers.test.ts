// RESPONSIBILITY: Define source-level test coverage for libraries student bulk import using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_student_bulk_import/tests/SuperadminLibrariesStudentBulkImportScaleFixtureTiers.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS } from '../mocks/fixtures/superadmin_libraries_student_bulk_import.scale-stress-fixtures';
import { SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_SIZE } from '../constants/SuperadminLibrariesOnboardingSetupStudentBulkImportStaticConstants';
import { maskSensitiveData } from '../utils/SuperadminLibrariesOnboardingSetupStudentBulkImportCsvImportUtilities';

describe('libraries_student_bulk_import deterministic scale fixture tiers', () => {
  it('provides 10, 100, and 500 deterministic local preview records', () => {
    expect(MOCK_SCALE_TIER_1_SMALL).toHaveLength(10);
    expect(MOCK_SCALE_TIER_2_STANDARD).toHaveLength(100);
    expect(MOCK_SCALE_TIER_3_STRESS).toHaveLength(500);
  });
  it('redacts short raw phone values and preserves only canonical last-four masks', () => {
    expect(maskSensitiveData('1234')).toBe('•••');
    expect(maskSensitiveData('12')).toBe('•••');
    expect(maskSensitiveData('****1234')).toBe('****1234');
    expect(maskSensitiveData('abc*1234')).toBe('•••');
    expect(maskSensitiveData('+91 98765 43210')).toBe('********3210');
  });
  it('bounds each rendered preview page across all supported scale tiers', () => {
    const firstPage = (rows: unknown[]) => rows.slice(0, SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_SIZE);
    const secondPage = (rows: unknown[]) => rows.slice(SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_SIZE, SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_SIZE * 2);
    expect(firstPage(MOCK_SCALE_TIER_1_SMALL)).toHaveLength(10);
    expect(firstPage(MOCK_SCALE_TIER_2_STANDARD)).toHaveLength(50);
    expect(firstPage(MOCK_SCALE_TIER_3_STRESS)).toHaveLength(50);
    expect(secondPage(MOCK_SCALE_TIER_3_STRESS)).toHaveLength(50);
    expect(Math.ceil(MOCK_SCALE_TIER_3_STRESS.length / SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_SIZE)).toBe(10);
  });
  it('uses deterministic unique row identities within each tier', () => {
    const ids = MOCK_SCALE_TIER_3_STRESS.map((row) => {
      if (typeof row === 'number' || typeof row === 'string') return row;
      const record = row as unknown as Record<string, unknown>;
      return record.id ?? record.row ?? record.rank ?? record.__scaleFixtureIndex;
    });
    expect(new Set(ids).size).toBe(500);
  });
});
