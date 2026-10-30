/** Isolated test-scenario vocabulary owned by admin_accounts_seat_gap_report. No sibling imports or live API assumptions. */
export const AdminAccountsSeatGapReportScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminAccountsSeatGapReportScenario = (typeof AdminAccountsSeatGapReportScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminAccountsSeatGapReportScenarioLabel(scenario: AdminAccountsSeatGapReportScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
