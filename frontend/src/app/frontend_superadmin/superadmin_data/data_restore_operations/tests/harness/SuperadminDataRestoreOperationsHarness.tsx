// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/tests/harness/SuperadminDataRestoreOperationsHarness.tsx
/**
 * @file SuperadminDataRestoreOperationsHarness.tsx
 * @description Test wrapper providing QueryClient and Theme context for restore operation tests.
 */

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from './bootstrap';

interface HarnessProps {
  children: React.ReactNode;
}

export function SuperadminDataRestoreOperationsHarness({ children }: HarnessProps) {
  const [queryClient] = React.useState(() => createTestQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="superadmin-restore-harness p-4">{children}</div>
    </QueryClientProvider>
  );
}
