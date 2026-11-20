// tests/harness/bootstrap.ts
// Bootstrap environment setup for isolated testing of Superadmin Data Overview

import { QueryClient } from '@tanstack/react-query';
import { SUPERADMIN_DATA_OVERVIEW_SCENARIOS } from '@/app/frontend_superadmin/superadmin_data/data_overview/mocks/scenarios/superadmin_data_overview.scenarios';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

export function getMockScenario(scenarioName: keyof typeof SUPERADMIN_DATA_OVERVIEW_SCENARIOS) {
  return SUPERADMIN_DATA_OVERVIEW_SCENARIOS[scenarioName] ?? SUPERADMIN_DATA_OVERVIEW_SCENARIOS.ACTIVE;
}
