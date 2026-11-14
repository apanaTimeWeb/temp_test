// RESPONSIBILITY: Define compile-time types for system audit logs; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewTypes.ts -> shared local type contract -> component/API/hook consumers.
/**
 * Defines the public SuperadminAuditLogAction contract for audit logs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminAuditLogAction = 'Created' | 'Updated' | 'Deleted' | 'Fee_Collected';

/** Synthetic preview row only; this is not an authoritative audit event contract. */
export interface SuperadminAuditLogSampleEntry {
  id: string;
  time: string;
  user: string;
  entity: string;
  target: string;
  action: SuperadminAuditLogAction;
  ip: string;
  detail: string;
}

/** CSV row shape for the explicitly synthetic audit-log preview. */
export interface SuperadminAuditLogsExportRow {
  id: string;
  time: string;
  user: string;
  entity: string;
  target: string;
  action: string;
  ip: string;
  detail: string;
}
