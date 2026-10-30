/** Isolated test-scenario vocabulary owned by admin_finance_trust_score. No sibling imports or live API assumptions. */
export const AdminFinanceTrustScoreScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminFinanceTrustScoreScenario = (typeof AdminFinanceTrustScoreScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminFinanceTrustScoreScenarioLabel(scenario: AdminFinanceTrustScoreScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
