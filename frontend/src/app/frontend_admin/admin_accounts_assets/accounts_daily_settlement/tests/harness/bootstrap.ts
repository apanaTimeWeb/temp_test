/** Isolated test-scenario vocabulary owned by admin_accounts_daily_settlement. No sibling imports or live API assumptions. */
export const AdminAccountsDailySettlementScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminAccountsDailySettlementScenario = (typeof AdminAccountsDailySettlementScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminAccountsDailySettlementScenarioLabel(scenario: AdminAccountsDailySettlementScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
