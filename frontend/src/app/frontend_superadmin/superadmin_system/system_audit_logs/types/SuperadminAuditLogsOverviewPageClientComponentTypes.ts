// RESPONSIBILITY: Define compile-time types for system audit logs; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewPageClientComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_audit/superadmin_audit_components/superadmin_audit_overview_page/SuperadminAuditLogsOverviewPageClient.tsx. */
import type { SuperadminAuditLogSampleEntry } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewTypes';

/**
 * Defines the public Log contract for audit logs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type Log = SuperadminAuditLogSampleEntry;
