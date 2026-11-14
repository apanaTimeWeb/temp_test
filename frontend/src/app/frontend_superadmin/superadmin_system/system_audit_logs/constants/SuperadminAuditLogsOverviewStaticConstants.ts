// RESPONSIBILITY: Define stable module-owned constants for system audit logs; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_system/system_audit_logs/constants/SuperadminAuditLogsOverviewStaticConstants.ts -> typed constants -> component/hook/config behavior.


/** Static module-owned options/status mapping extracted from SuperadminAuditLogsOverviewDetailDrawer.tsx. */
export const SUPERADMIN_AUDIT_LOGS_DETAIL_DRAWER_SELECTOR = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';


/** Static module-owned options/status mapping extracted from SuperadminAuditLogsOverviewPageClient.tsx. */
export const SUPERADMIN_AUDIT_LOGS_OVERVIEW_PAGE_CLIENT_ACTION_OPTIONS = ['All Actions', 'Created', 'Updated', 'Deleted', 'Fee_Collected'];



export const SUPERADMIN_AUDIT_LOGS_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export const SUPERADMIN_AUDIT_LOGS_DEFAULT_PAGE_SIZE = SUPERADMIN_AUDIT_LOGS_PAGE_SIZE_OPTIONS[0];
