// tests/harness/bootstrap.ts
import { QueryClient } from '@tanstack/react-query';
import { SUPERADMIN_DATA_BACKUP_OPERATIONS_SCENARIOS } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/mocks/scenarios/superadmin_data_backup_operations.scenarios';

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

export function getMockScenario(scenarioName: keyof typeof SUPERADMIN_DATA_BACKUP_OPERATIONS_SCENARIOS) {
  return SUPERADMIN_DATA_BACKUP_OPERATIONS_SCENARIOS[scenarioName] ?? SUPERADMIN_DATA_BACKUP_OPERATIONS_SCENARIOS.ACTIVE;
}
