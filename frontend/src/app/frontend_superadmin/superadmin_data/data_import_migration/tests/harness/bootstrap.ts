// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/tests/harness/bootstrap.ts
/**
 * @file bootstrap.ts
 * @description Test bootstrap utility for Data Import & Migration integration tests.
 */

import { QueryClient } from '@tanstack/react-query';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
