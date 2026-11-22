// RESPONSIBILITY: Define source-level test coverage for system audit logs using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_audit_logs/tests/SuperadminAuditLogsOverviewExportUtilities.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { buildSuperadminAuditLogsSampleCsv } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/utils/SuperadminAuditLogsOverviewExportUtilities';

describe('buildSuperadminAuditLogsSampleCsv', () => {
  it('labels the data as sample and serializes quotes/newlines safely', () => {
    const csv = buildSuperadminAuditLogsSampleCsv([{
      id: 'SAMPLE-001', time: 'Sample timestamp', user: '=HYPERLINK("x")', entity: 'Subscription',
      target: 'Demo, A', action: 'Created', ip: '192.0.2.1', detail: 'line 1\nline "2"',
    }]);
    expect(csv).toContain('Synthetic audit-log sample only');
    expect(csv).toContain("'=HYPERLINK(\"\"x\"\")");
    expect(csv).toContain('"Demo, A"');
    expect(csv).toContain('"line 1\nline ""2"""');
  });

  it('exports a valid header and supports an empty result set', () => {
    const csv = buildSuperadminAuditLogsSampleCsv([]);
    expect(csv).toContain('"id","time","user","entity","target","action","ip","detail"');
    expect(csv.split('\r\n')).toHaveLength(2);
  });
  it('accepts localized notice labels while retaining stable CSV field identifiers', () => {
    const csv = buildSuperadminAuditLogsSampleCsv([], { noticeHeader: 'सूचना', noticeText: 'केवल नमूना' });
    expect(csv).toContain('सूचना');
    expect(csv).toContain('केवल नमूना');
    expect(csv).toContain('\"id\",\"time\",\"user\"');
  });
});
