import { apiFetch } from '@/app/frontend_admin/lib/api';
import { parseApiResponseData } from '@/app/frontend_admin/lib/apiSchema';
import { ADMIN_SYSTEM_AUDIT_LOGS_API } from '@/app/frontend_admin/admin_system/system_audit_logs/config/admin_system_audit_logs.url_config';
import { AdminAuditLogsApiResponseSchema } from '@/app/frontend_admin/admin_system/system_audit_logs/schemas/AdminSystemAuditLogsSchema';
import type { AdminAuditLogsRecord } from '@/app/frontend_admin/admin_system/system_audit_logs/types/AdminSystemAuditLogsTypes';
const display = (value: string | undefined, fallback = '—') => value?.trim() || fallback;
const validTimestamp = (value: string | undefined): string | null => { const trimmed = value?.trim(); return trimmed && !Number.isNaN(Date.parse(trimmed)) ? trimmed : null; };
export async function fetchAdminAuditLogs(): Promise<AdminAuditLogsRecord[]> {
 const payload = parseApiResponseData(await apiFetch<unknown>(ADMIN_SYSTEM_AUDIT_LOGS_API.LIST), AdminAuditLogsApiResponseSchema);
 return payload.map((record) => ({
  id: String(record.id).trim(), action: record.action.trim(), module: display(record.module ?? record.entity),
  performedBy: display(record.performedBy), role: display(record.role), details: display(record.details),
  severity: record.severity ?? 'unknown', timestamp: validTimestamp(record.timestamp) ?? validTimestamp(record.createdAt) ?? '—', ip: display(record.ip),
 }));
}

// Feature-scoped TanStack Query cache keys belong to this entity-family API contract.
/** Feature-scoped TanStack Query keys for admin_audit_logs. Keep server-state cache ownership inside this feature. */

