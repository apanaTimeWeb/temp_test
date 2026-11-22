// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/tests/harness/SuperadminDataExportManagementHarness.tsx
/**
 * @file SuperadminDataExportManagementHarness.tsx
 * @description Test harness providing QueryClient and wrapper for Data Export Management.
 */

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from './bootstrap';

interface HarnessProps {
  children: React.ReactNode;
}

export function SuperadminDataExportManagementHarness({ children }: HarnessProps) {
  const [queryClient] = React.useState(() => createTestQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="superadmin-export-harness p-4">{children}</div>
    </QueryClientProvider>
  );
}
