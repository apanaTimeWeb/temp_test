'use client';
// tests/harness/SuperadminAnalyticsUsageReportsHarness.tsx
// Standalone mounting harness for isolated Usage Reports module testing

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperadminAnalyticsUsageReportsMain } from '../../components/SuperadminAnalyticsUsageReportsMain';

export function SuperadminAnalyticsUsageReportsHarness() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            gcTime: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground p-6">
        <SuperadminAnalyticsUsageReportsMain />
      </div>
    </QueryClientProvider>
  );
}
