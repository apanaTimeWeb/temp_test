/** Isolated test-scenario vocabulary owned by admin_finance_late_fees. No sibling imports or live API assumptions. */
export const AdminFinanceLateFeesScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminFinanceLateFeesScenario = (typeof AdminFinanceLateFeesScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminFinanceLateFeesScenarioLabel(scenario: AdminFinanceLateFeesScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
