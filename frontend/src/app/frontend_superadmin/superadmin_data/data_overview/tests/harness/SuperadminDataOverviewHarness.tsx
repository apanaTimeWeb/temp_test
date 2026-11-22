// tests/harness/SuperadminDataOverviewHarness.tsx
'use client';

import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from './bootstrap';
import { SuperadminDataOverviewMain } from '@/app/frontend_superadmin/superadmin_data/data_overview/components/SuperadminDataOverviewMain';

export function SuperadminDataOverviewHarness() {
  const [queryClient] = useState(() => createTestQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-4 bg-background min-h-screen text-foreground">
        <div className="mb-4 p-2.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-xs text-pink-300 flex items-center justify-between">
          <span className="font-bold">Standalone Test Harness: Superadmin Data Overview</span>
          <span className="font-mono">Scenario: ACTIVE_MOCK</span>
        </div>
        <SuperadminDataOverviewMain />
      </div>
    </QueryClientProvider>
  );
}
