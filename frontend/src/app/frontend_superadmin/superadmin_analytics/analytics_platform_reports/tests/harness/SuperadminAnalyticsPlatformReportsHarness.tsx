'use client';
// tests/harness/SuperadminAnalyticsPlatformReportsHarness.tsx
// Standalone mounting harness for isolated module testing

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperadminAnalyticsPlatformReportsMain } from '../../components/SuperadminAnalyticsPlatformReportsMain';
import { SUPERADMIN_PLATFORM_REPORTS_SCENARIOS } from '../../mocks/scenarios/superadmin_analytics_platform_reports.scenarios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

export function SuperadminAnalyticsPlatformReportsHarness() {
  const [scenario, setScenario] = useState<keyof typeof SUPERADMIN_PLATFORM_REPORTS_SCENARIOS>('ACTIVE_RECORDS');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-4 border-b border-border bg-card flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">Harness Active Scenario:</span>
        <select
          value={scenario}
          onChange={(e) => setScenario(e.target.value as keyof typeof SUPERADMIN_PLATFORM_REPORTS_SCENARIOS)}
          className="py-1 px-2 rounded-md border border-border bg-background text-xs"
        >
          {Object.keys(SUPERADMIN_PLATFORM_REPORTS_SCENARIOS).map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>
      <div className="p-4">
        <SuperadminAnalyticsPlatformReportsMain />
      </div>
    </QueryClientProvider>
  );
}
