// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/tests/harness/bootstrap.ts
/**
 * @file bootstrap.ts
 * @description Test bootstrap utility for Data Export Management integration tests.
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
