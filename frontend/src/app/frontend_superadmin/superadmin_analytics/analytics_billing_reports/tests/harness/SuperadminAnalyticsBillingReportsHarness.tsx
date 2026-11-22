'use client';
// tests/harness/SuperadminAnalyticsBillingReportsHarness.tsx
// Standalone mounting harness for isolated Billing Reports module testing

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperadminAnalyticsBillingReportsMain } from '../../components/SuperadminAnalyticsBillingReportsMain';

export function SuperadminAnalyticsBillingReportsHarness() {
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
        <SuperadminAnalyticsBillingReportsMain />
      </div>
    </QueryClientProvider>
  );
}
