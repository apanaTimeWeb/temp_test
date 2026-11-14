// RESPONSIBILITY: Define compile-time types for system audit logs; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewDetailDrawerComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_audit/superadmin_audit_components/superadmin_audit_detail_components/SuperadminAuditLogsOverviewDetailDrawer.tsx. */
import type { SuperadminAuditLogSampleEntry } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewTypes';

/**
 * Defines the public SuperadminAuditLogsDetailDrawerProps contract for audit logs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property log Value defined by the existing feature-local contract. Declared type: SuperadminAuditLogSampleEntry.
 * @property onClose Callback for the corresponding user interaction. Declared type: () => void.
 */
export interface SuperadminAuditLogsDetailDrawerProps {
  log: SuperadminAuditLogSampleEntry;
  onClose: () => void;
}
