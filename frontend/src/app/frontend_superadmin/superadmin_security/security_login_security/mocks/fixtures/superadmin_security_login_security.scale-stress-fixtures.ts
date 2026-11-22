// RESPONSIBILITY: Define local sample fixtures for security login security; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> security_login_security scale fixtures -> local failed-login records -> isolated table rendering/assertions.
/** Deterministic scale tiers for the Login Security failed-login table; local synthetic data only. */
import { SUPERADMIN_SECURITY_FAILED_LOGINS } from './SuperadminSecurityLoginSecurityPreviewMockFixtures';

type LoginSecurityScaleRecord = {
  id: number;
  ip: string;
  user: string;
  time: string;
  reason: string;
};

const sourceRecords = SUPERADMIN_SECURITY_FAILED_LOGINS as readonly LoginSecurityScaleRecord[];

function withDeterministicIdentity(record: LoginSecurityScaleRecord, index: number): LoginSecurityScaleRecord {
  return { ...record, id: record.id * 1000 + index };
}

export function createSecurityLoginScaleTier(count: number): readonly LoginSecurityScaleRecord[] {
  if (!Number.isSafeInteger(count) || count < 0) return [];
  if (sourceRecords.length === 0) return [];
  return Array.from({ length: count }, (_, index) => withDeterministicIdentity(sourceRecords[index % sourceRecords.length], index + 1));
}

export const MOCK_SCALE_TIER_1_SMALL = createSecurityLoginScaleTier(10);
export const MOCK_SCALE_TIER_2_STANDARD = createSecurityLoginScaleTier(100);
export const MOCK_SCALE_TIER_3_STRESS = createSecurityLoginScaleTier(500);
