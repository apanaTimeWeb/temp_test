// RESPONSIBILITY: Define local sample fixtures for libraries student bulk import; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_libraries/libraries_student_bulk_import/mocks/fixtures/superadmin_libraries_student_bulk_import.scale-stress-fixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Deterministic synthetic CSV rows for isolated import-preview stress tests only. */
import type { SuperadminSystemBulkImportRow } from '../../types/SuperadminLibrariesOnboardingSetupStudentBulkImportTypes';
function makeRows(count: number): readonly SuperadminSystemBulkImportRow[] {
  return Array.from({ length: count }, (_, index) => ({
    row: index + 1,
    name: `Synthetic Student ${String(index + 1).padStart(4, '0')}`,
    phone: `900000${String(index + 1).padStart(4, '0')}`,
    email: `student-${index + 1}@example.invalid`,
    shift: ['Morning', 'Evening', 'Full Day'][index % 3],
    seat: `SEAT-${String((index % 120) + 1).padStart(3, '0')}`,
    plan: ['Basic', 'Standard', 'Premium'][index % 3],
    feePaid: index % 2 ? 'No' : 'Yes',
    joinDate: `2026-${String((index % 12) + 1).padStart(2, '0')}-01`,
    status: 'ok',
  }));
}
export const MOCK_SCALE_TIER_1_SMALL = makeRows(10);
export const MOCK_SCALE_TIER_2_STANDARD = makeRows(100);
export const MOCK_SCALE_TIER_3_STRESS = makeRows(500);
