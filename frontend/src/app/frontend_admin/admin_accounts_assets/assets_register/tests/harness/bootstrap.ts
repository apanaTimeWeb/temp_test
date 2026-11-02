// tests/harness/bootstrap.ts
export const AdminAssetsRegisterScenarios = [
  'ACTIVE',
  'EMPTY',
  'SERVER_500',
  'TIMEOUT',
  'UNAUTHORIZED',
] as const;

export type AdminAssetsRegisterScenario =
  (typeof AdminAssetsRegisterScenarios)[number];

