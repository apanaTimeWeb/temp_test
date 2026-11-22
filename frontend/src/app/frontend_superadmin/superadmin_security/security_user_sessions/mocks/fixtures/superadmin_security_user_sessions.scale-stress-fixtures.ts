// RESPONSIBILITY: Define local sample fixtures for security user sessions; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_security/security_user_sessions/mocks/fixtures/superadmin_security_user_sessions.scale-stress-fixtures.ts -> typed local fixtures -> screen rendering or assertions.
/**
 * Deterministic local stress tiers derived from this module's existing synthetic fixture source.
 * These are for isolated UI scale testing only; they do not represent backend data or API contracts.
 */
import { SUPERADMIN_USERS_INITIAL_SESSIONS as MODULE_SCALE_FIXTURE_SOURCE } from './SuperadminSecurityUserSessionsMockFixtures';
import type { SuperadminSessionData } from '../../types/SuperadminSecurityUserSessionsTypes';

function withDeterministicIdentity(record: SuperadminSessionData, index: number): SuperadminSessionData {
  return {
    ...record,
    id: `${record.id}-${String(index).padStart(4, '0')}`,
  };
}

function createScaleTier(count: number): readonly SuperadminSessionData[] {
  if (MODULE_SCALE_FIXTURE_SOURCE.length === 0) return [];
  return Array.from({ length: count }, (_, index) => withDeterministicIdentity(MODULE_SCALE_FIXTURE_SOURCE[index % MODULE_SCALE_FIXTURE_SOURCE.length], index + 1));
}

export const MOCK_SCALE_TIER_1_SMALL = createScaleTier(10);
export const MOCK_SCALE_TIER_2_STANDARD = createScaleTier(100);
export const MOCK_SCALE_TIER_3_STRESS = createScaleTier(500);
