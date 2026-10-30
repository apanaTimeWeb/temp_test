/** Isolated test-scenario vocabulary owned by admin_system_audit_logs. No sibling imports or live API assumptions. */
export const AdminSystemAuditLogsScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSystemAuditLogsScenario = (typeof AdminSystemAuditLogsScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSystemAuditLogsScenarioLabel(scenario: AdminSystemAuditLogsScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
