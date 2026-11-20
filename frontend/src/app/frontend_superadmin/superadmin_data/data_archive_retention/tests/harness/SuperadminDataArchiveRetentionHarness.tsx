// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/tests/harness/SuperadminDataArchiveRetentionHarness.tsx
/**
 * @file SuperadminDataArchiveRetentionHarness.tsx
 * @description Test wrapper providing QueryClient for Data Archive & Retention tests.
 */

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from './bootstrap';

interface HarnessProps {
  children: React.ReactNode;
}

export function SuperadminDataArchiveRetentionHarness({ children }: HarnessProps) {
  const [queryClient] = React.useState(() => createTestQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="superadmin-archive-harness p-4">{children}</div>
    </QueryClientProvider>
  );
}
