// RESPONSIBILITY: Define local scale fixtures derived from the owning facility-power sample data.
// FLOW: Feature-local fixture -> deterministic scale-tier helper -> isolated scale tests.
import { SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ZONES as MODULE_SCALE_FIXTURE_SOURCE } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/mocks/fixtures/SuperadminLibrariesOverviewFacilityPowerManagementMockFixtures';

type FixtureRecord = Record<string, unknown>;

function withDeterministicIdentity(record: FixtureRecord, index: number): FixtureRecord {
  const copy: FixtureRecord = { ...record };
  const identityKey = ['id', 'key', 'code', 'reference', 'receiptNumber', 'invoiceNumber'].find((key) => key in copy);
  const key = identityKey ?? '__scaleFixtureIndex';
  const current = copy[key];
  copy[key] = identityKey && typeof current === 'number'
    ? current * 1000 + index
    : `${String(current ?? 'scale')}-${String(index).padStart(4, '0')}`;
  return copy;
}

/** Builds deterministic copies and never mutates the caller-owned fixture records. */
export function createSuperadminLibrariesFacilityPowerManagementScaleTier(
  records: readonly FixtureRecord[],
  count: number,
): readonly FixtureRecord[] {
  if (records.length === 0 || count <= 0) return [];
  return Array.from({ length: count }, (_, index) => withDeterministicIdentity(records[index % records.length], index + 1));
}

const sourceRecords = MODULE_SCALE_FIXTURE_SOURCE as unknown as readonly FixtureRecord[];
export const MOCK_SCALE_TIER_1_SMALL = createSuperadminLibrariesFacilityPowerManagementScaleTier(sourceRecords, 10);
export const MOCK_SCALE_TIER_2_STANDARD = createSuperadminLibrariesFacilityPowerManagementScaleTier(sourceRecords, 100);
export const MOCK_SCALE_TIER_3_STRESS = createSuperadminLibrariesFacilityPowerManagementScaleTier(sourceRecords, 500);
