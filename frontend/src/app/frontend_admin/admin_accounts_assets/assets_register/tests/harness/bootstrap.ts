/** Canonical isolated scenario bootstrap for asset-register tests. */
export const AdminAssetsRegisterScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminAssetsRegisterScenario = (typeof AdminAssetsRegisterScenarios)[number];
