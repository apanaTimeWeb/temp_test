// RESPONSIBILITY: Define local sample fixtures for libraries library waitlist automation; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_libraries/libraries_library_waitlist_automation/mocks/fixtures/superadmin_libraries_library_waitlist_automation.scale-stress-fixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Deterministic scale tiers use recursive clones so nested source fixture values stay immutable. */
import { SUPERADMIN_SYSTEM_WAITLIST_SAMPLE_QUEUE as MODULE_SCALE_FIXTURE_SOURCE } from './SuperadminLibrariesOverviewLibraryWaitlistAutomationWaitlistMockFixtures';

type FixtureRecord = Record<string, unknown>;
function cloneValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, nested]) => [key, cloneValue(nested)]));
  }
  return value;
}
const sourceRecords = MODULE_SCALE_FIXTURE_SOURCE as unknown as readonly FixtureRecord[];

function withDeterministicIdentity(record: FixtureRecord, index: number): FixtureRecord {
  const copy = cloneValue(record) as FixtureRecord;
  const identityKey = ['id', 'key', 'code', 'reference', 'receiptNumber', 'invoiceNumber'].find((key) => key in copy);
  const key = identityKey ?? '__scaleFixtureIndex';
  const current = copy[key];
  copy[key] = identityKey && typeof current === 'number'
    ? current * 1000 + index
    : `${String(current ?? 'scale')}-${String(index).padStart(4, '0')}`;
  return copy;
}

function createScaleTier(count: number): readonly FixtureRecord[] {
  if (sourceRecords.length === 0) return [];
  return Array.from({ length: count }, (_, index) => withDeterministicIdentity(sourceRecords[index % sourceRecords.length], index + 1));
}

export const MOCK_SCALE_TIER_1_SMALL = createScaleTier(10);
export const MOCK_SCALE_TIER_2_STANDARD = createScaleTier(100);
export const MOCK_SCALE_TIER_3_STRESS = createScaleTier(500);
