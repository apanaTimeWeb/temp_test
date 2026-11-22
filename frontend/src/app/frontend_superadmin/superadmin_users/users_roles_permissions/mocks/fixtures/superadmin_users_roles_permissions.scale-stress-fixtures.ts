// RESPONSIBILITY: Define local sample fixtures for users roles permissions; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_users/users_roles_permissions/mocks/fixtures/superadmin_users_roles_permissions.scale-stress-fixtures.ts -> typed local fixtures -> screen rendering or assertions.
/**
 * Deterministic local stress tiers derived from the current permission-matrix fixture.
 * These records validate rendering density only; they are not backend permissions or API contracts.
 */
import { SUPERADMIN_USERS_ROLE_PERMISSIONS as MODULE_SCALE_FIXTURE_SOURCE } from './SuperadminUsersRolesPermissionsMockFixtures';

type FixtureRecord = Record<string, unknown>;
const sourceRecords = MODULE_SCALE_FIXTURE_SOURCE as unknown as readonly FixtureRecord[];

function withDeterministicIdentity(record: FixtureRecord, index: number): FixtureRecord {
  const copy: FixtureRecord = { ...record };
  const identityKey = ['id', 'key', 'code', 'reference', 'receiptNumber', 'invoiceNumber', 'module'].find((key) => key in copy);
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
