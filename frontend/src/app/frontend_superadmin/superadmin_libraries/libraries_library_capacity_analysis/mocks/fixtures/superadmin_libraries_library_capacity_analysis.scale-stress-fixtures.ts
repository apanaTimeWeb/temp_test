// RESPONSIBILITY: Define deterministic local scale tiers derived from the capacity-analysis sample fixture.
import { SUPERADMIN_ACCOUNTING_SAMPLE_SEAT_GAPS as MODULE_SCALE_FIXTURE_SOURCE } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/mocks/fixtures/SuperadminLibrariesOverviewLibraryCapacityAnalysisSeatGapMockFixtures';

type FixtureRecord = Record<string, unknown>;
function withDeterministicIdentity(record: FixtureRecord, index: number): FixtureRecord {
  const copy: FixtureRecord = { ...record };
  const identityKey = ['id', 'key', 'code', 'reference', 'receiptNumber', 'invoiceNumber'].find((key) => key in copy);
  const key = identityKey ?? '__scaleFixtureIndex';
  const current = copy[key];
  copy[key] = identityKey && typeof current === 'number' ? current * 1000 + index : `${String(current ?? 'scale')}-${String(index).padStart(4, '0')}`;
  return copy;
}

/** Derives copied stress rows while leaving the provided fixture records untouched. */
export function createSuperadminLibraryCapacityAnalysisScaleTier(records: readonly FixtureRecord[], count: number): readonly FixtureRecord[] {
  if (records.length === 0 || count <= 0) return [];
  return Array.from({ length: count }, (_, index) => withDeterministicIdentity(records[index % records.length], index + 1));
}

const sourceRecords = MODULE_SCALE_FIXTURE_SOURCE as unknown as readonly FixtureRecord[];
export const MOCK_SCALE_TIER_1_SMALL = createSuperadminLibraryCapacityAnalysisScaleTier(sourceRecords, 10);
export const MOCK_SCALE_TIER_2_STANDARD = createSuperadminLibraryCapacityAnalysisScaleTier(sourceRecords, 100);
export const MOCK_SCALE_TIER_3_STRESS = createSuperadminLibraryCapacityAnalysisScaleTier(sourceRecords, 500);
