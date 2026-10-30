import { z } from 'zod';
import { ADMIN_AUDIT_LOGS_SEVERITY_VALUES } from '@/app/frontend_admin/admin_system/system_audit_logs/config/admin_system_audit_logs.url_config';
const nonBlank = z.string().trim().min(1);
const optionalDisplay = z.string().optional();
export const AdminAuditLogsApiRecordSchema = z.object({
 id: z.union([nonBlank, z.number().int().safe().nonnegative()]),
 action: nonBlank,
 entity: optionalDisplay, module: optionalDisplay, performedBy: optionalDisplay, role: optionalDisplay, details: optionalDisplay,
 severity: z.enum(ADMIN_AUDIT_LOGS_SEVERITY_VALUES).optional(), createdAt: z.string().optional(), timestamp: z.string().optional(), ip: optionalDisplay,
}).passthrough();
export const AdminAuditLogsApiResponseSchema = z.array(AdminAuditLogsApiRecordSchema);
