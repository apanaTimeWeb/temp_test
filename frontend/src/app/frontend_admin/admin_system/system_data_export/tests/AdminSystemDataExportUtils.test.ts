import { describe, expect, it } from 'vitest';
import { buildAdminSystemDataExportCsv, escapeAdminSystemDataExportCsvCell } from '@/app/frontend_admin/admin_system/system_data_export/utils/AdminSystemDataExportUtils';

describe('AdminSystem demo data export', () => {
  it('filters selected module fixtures by inclusive record date range', () => {
    const csv = buildAdminSystemDataExportCsv(['students'], '2026-01-05', '2026-01-12');
    expect(csv).toContain('STU-001');
    expect(csv).toContain('STU-002');
    expect(csv).not.toContain('STU-003');
    expect(csv).not.toContain('PAY-001');
  });

  it('applies quick-export-specific criteria to demo rows', () => {
    const dueFees = buildAdminSystemDataExportCsv(['payments'], '2026-01-01', '2026-04-12', 'due-fees');
    expect(dueFees).toContain('PAY-002');
    expect(dueFees).toContain('PAY-003');
    expect(dueFees).not.toContain('PAY-001');

    const active = buildAdminSystemDataExportCsv(['students'], '2026-01-01', '2026-04-12', 'active');
    expect(active).toContain('STU-001');
    expect(active).toContain('STU-002');
    expect(active).not.toContain('STU-003');

    const expiring = buildAdminSystemDataExportCsv(['students'], '2026-01-01', '2026-04-12', 'expiring');
    expect(expiring).toContain('STU-001');
    expect(expiring).toContain('STU-002');
    expect(expiring).not.toContain('STU-003');
  });

  it('neutralizes spreadsheet formula starters in exported cells', () => {
    expect(escapeAdminSystemDataExportCsvCell('=1+1')).toBe("\"'=1+1\"");
    expect(escapeAdminSystemDataExportCsvCell('  @SUM(A1:A2)')).toBe("\"'  @SUM(A1:A2)\"");
  });

  it('returns a header-only CSV when no demo records are in the selected range', () => {
    const csv = buildAdminSystemDataExportCsv(['students'], '2025-01-01', '2025-01-02');
    expect(csv).toBe('\uFEFF"module","recordId","label","value","recordDate","feeStatus","subscriptionExpiry"');
  });
});
