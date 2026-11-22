// tests/harness/SuperadminDataBackupOperationsHarness.tsx
'use client';

import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from './bootstrap';
import { SuperadminDataBackupOperationsMain } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/components/SuperadminDataBackupOperationsMain';

export function SuperadminDataBackupOperationsHarness() {
  const [queryClient] = useState(() => createTestQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-4 bg-background min-h-screen text-foreground">
        <div className="mb-4 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
          <span className="font-bold">Standalone Test Harness: Superadmin Backup Operations</span>
          <span className="font-mono">Scenario: ACTIVE_MOCK</span>
        </div>
        <SuperadminDataBackupOperationsMain />
      </div>
    </QueryClientProvider>
  );
}
