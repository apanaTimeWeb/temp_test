/** The supplied frontend contract does not define a dashboard overview API endpoint. */
export class ManagerDashboardOverviewContractBlockedError extends Error {
  readonly code = 'EXTERNAL_PRODUCT_DECISION_BLOCKED' as const;

  constructor() {
    super('Dashboard overview cannot be loaded until an authoritative API contract is supplied.');
    this.name = 'ManagerDashboardOverviewContractBlockedError';
  }
}

export async function fetchManagerDashboardData(): Promise<never> {
  throw new ManagerDashboardOverviewContractBlockedError();
}
