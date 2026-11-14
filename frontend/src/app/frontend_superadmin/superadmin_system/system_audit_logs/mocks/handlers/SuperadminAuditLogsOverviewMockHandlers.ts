// RESPONSIBILITY: Define isolated mock handlers for system audit logs; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_system/system_audit_logs/mocks/handlers/SuperadminAuditLogsOverviewMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for audit_logs; do not invent endpoints or write success. */
export const SUPERADMIN_AUDIT_LOGS_OVERVIEW_MSW_HANDLERS: never[] = [];
