/** Isolated test-scenario vocabulary owned by admin_accounts_shift_gap_analyzer. No sibling imports or live API assumptions. */
export const AdminAccountsShiftGapAnalyzerScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminAccountsShiftGapAnalyzerScenario = (typeof AdminAccountsShiftGapAnalyzerScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminAccountsShiftGapAnalyzerScenarioLabel(scenario: AdminAccountsShiftGapAnalyzerScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
