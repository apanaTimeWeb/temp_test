// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/tests/harness/SuperadminDataImportMigrationHarness.tsx
/**
 * @file SuperadminDataImportMigrationHarness.tsx
 * @description Test wrapper providing QueryClient for Data Import & Migration tests.
 */

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from './bootstrap';

interface HarnessProps {
  children: React.ReactNode;
}

export function SuperadminDataImportMigrationHarness({ children }: HarnessProps) {
  const [queryClient] = React.useState(() => createTestQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="superadmin-import-harness p-4">{children}</div>
    </QueryClientProvider>
  );
}
