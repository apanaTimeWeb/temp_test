// tests/harness/bootstrap.ts
export const AdminAccountsDailySettlementScenarios = [
  'ACTIVE',
  'EMPTY',
  'SERVER_500',
  'TIMEOUT',
  'UNAUTHORIZED',
] as const;

export type AdminAccountsDailySettlementScenario =
  (typeof AdminAccountsDailySettlementScenarios)[number];

