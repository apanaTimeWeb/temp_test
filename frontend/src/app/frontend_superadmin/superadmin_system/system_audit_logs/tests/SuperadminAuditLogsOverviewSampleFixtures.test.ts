// RESPONSIBILITY: Define source-level test coverage for system audit logs using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_audit_logs/tests/SuperadminAuditLogsOverviewSampleFixtures.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_AUDIT_LOG_SAMPLE_FIXTURES } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/mocks/fixtures/SuperadminAuditLogsOverviewAuditLogSampleMockFixtures';

describe('SuperadminAuditLogSampleFixtures', () => {
  it('keeps sample audit rows explicitly synthetic and uniquely identified', () => {
    const ids = SUPERADMIN_AUDIT_LOG_SAMPLE_FIXTURES.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith('SAMPLE-LOG-'))).toBe(true);
    expect(SUPERADMIN_AUDIT_LOG_SAMPLE_FIXTURES.every((entry) => entry.detail.includes('Synthetic example only'))).toBe(true);
  });
});
