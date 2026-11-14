// RESPONSIBILITY: Define local sample fixtures for libraries student smart id; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_libraries/libraries_student_smart_id/mocks/fixtures/superadmin_libraries_student_smart_id.scale-stress-fixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Synthetic Smart ID values for isolated preview stress tests; not live student identities. */
function makeIds(count: number): readonly number[] { return Array.from({ length: count }, (_, index) => index + 1); }
export const MOCK_SCALE_TIER_1_SMALL = makeIds(10);
export const MOCK_SCALE_TIER_2_STANDARD = makeIds(100);
export const MOCK_SCALE_TIER_3_STRESS = makeIds(500);
