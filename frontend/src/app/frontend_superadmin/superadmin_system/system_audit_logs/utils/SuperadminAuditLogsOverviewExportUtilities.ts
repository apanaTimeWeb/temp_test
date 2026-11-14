// FLOW: Feature caller -> superadmin_system/system_audit_logs/utils/SuperadminAuditLogsOverviewExportUtilities.ts -> typed local sample input -> generated preview/export output.
/** Responsibility: Superadmin Audit Logs Export Utilities; provides focused module-owned formatting or pure utility behavior. */
import type { SuperadminAuditLogsExportRow } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewTypes';

function escapeCell(value: string): string {
  // Prevent spreadsheet formula execution for any user-controlled-looking text.
  const safe = /^[\s]*[=+@\-]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

/**
 * Builds or validates a module-owned preview/export payload, escaping user-visible cell values and keeping export behavior separate from server persistence.
 
 * @param rows - Input supplied by the caller under the declared TypeScript contract.
 * @param labels - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example buildSuperadminAuditLogsSampleCsv(rows, labels) uses the declared inputs to produce the module's canonical output.
 */
export function buildSuperadminAuditLogsSampleCsv(rows: readonly SuperadminAuditLogsExportRow[], labels: { noticeHeader?: string; noticeText?: string } = {}): string {
  const headers: Array<keyof SuperadminAuditLogsExportRow> = ['id', 'time', 'user', 'entity', 'target', 'action', 'ip', 'detail'];
  const lines = [
    [labels.noticeHeader ?? 'Notice', labels.noticeText ?? 'Synthetic audit-log sample only; not a live audit export.'],
    headers,
    ...rows.map((row) => headers.map((header) => row[header])),
  ];
  return lines.map((line) => line.map((value) => escapeCell(String(value))).join(',')).join('\r\n');
}
