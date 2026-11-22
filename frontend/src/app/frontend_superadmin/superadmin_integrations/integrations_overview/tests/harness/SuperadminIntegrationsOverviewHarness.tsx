// tests/harness/SuperadminIntegrationsOverviewHarness.tsx
// RESPONSIBILITY: Standalone mounting harness with isolated QueryClient and NextIntl providers.
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import React, { useState, type ReactNode } from 'react';
import enMessages from '../../locales/superadmin_integrations_overview_en.json';

interface SuperadminIntegrationsOverviewHarnessProps {
  children: ReactNode;
}

export default function SuperadminIntegrationsOverviewHarness({
  children,
}: SuperadminIntegrationsOverviewHarnessProps) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale="en" messages={enMessages} onError={() => undefined}>
        <div data-testid="integrations-harness-wrapper" className="min-h-screen bg-card p-6 text-foreground">
          {children}
        </div>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}
