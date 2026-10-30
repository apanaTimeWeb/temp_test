/** Isolated test-scenario vocabulary owned by admin_finance_referrals. No sibling imports or live API assumptions. */
export const AdminFinanceReferralsScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminFinanceReferralsScenario = (typeof AdminFinanceReferralsScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminFinanceReferralsScenarioLabel(scenario: AdminFinanceReferralsScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
