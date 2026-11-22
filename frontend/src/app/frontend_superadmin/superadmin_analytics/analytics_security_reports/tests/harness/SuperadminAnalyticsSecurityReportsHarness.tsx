'use client';
// tests/harness/SuperadminAnalyticsSecurityReportsHarness.tsx
// Standalone mounting harness for isolated Security Reports module testing

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperadminAnalyticsSecurityReportsMain } from '../../components/SuperadminAnalyticsSecurityReportsMain';

export function SuperadminAnalyticsSecurityReportsHarness() {
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
        <SuperadminAnalyticsSecurityReportsMain />
      </div>
    </QueryClientProvider>
  );
}
