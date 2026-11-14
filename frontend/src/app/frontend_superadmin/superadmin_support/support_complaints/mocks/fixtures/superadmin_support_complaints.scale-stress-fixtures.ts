// RESPONSIBILITY: Define local sample fixtures for support complaints; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_support/support_complaints/mocks/fixtures/superadmin_support_complaints.scale-stress-fixtures.ts -> typed local fixtures -> screen rendering or assertions.
/**
 * Deterministic local stress tiers derived from this module's existing synthetic fixture source.
 * These are for isolated UI scale testing only; they do not represent backend data or API contracts.
 */
import { SUPERADMIN_SUPPORT_COMPLAINT_PREVIEW_FIXTURES as MODULE_SCALE_FIXTURE_SOURCE } from './SuperadminSupportComplaintsComplaintMockFixtures';

type FixtureRecord = Record<string, unknown>;
const sourceRecords = MODULE_SCALE_FIXTURE_SOURCE as unknown as readonly FixtureRecord[];

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

function createScaleTier(count: number): readonly FixtureRecord[] {
  if (sourceRecords.length === 0) return [];
  return Array.from({ length: count }, (_, index) => withDeterministicIdentity(sourceRecords[index % sourceRecords.length], index + 1));
}

export const MOCK_SCALE_TIER_1_SMALL = createScaleTier(10);
export const MOCK_SCALE_TIER_2_STANDARD = createScaleTier(100);
export const MOCK_SCALE_TIER_3_STRESS = createScaleTier(500);
