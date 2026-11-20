// RESPONSIBILITY: Source-level test coverage verifying that SuperadminSettingsGeneralPageClient mounts cleanly without rendering exceptions.
// FLOW: Vitest runner -> SuperadminSettingsGeneralPageClient.test.tsx -> SuperadminSettingsGeneralPageClient -> DOM assertion.
/* @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';
import enMessages from '../locales/superadmin_settings_overview_en.json';
import SuperadminSettingsGeneralPageClient from '../components/SuperadminSettingsGeneralPageClient';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('SuperadminSettingsGeneralPageClient render safety', () => {
  it('renders Global Platform Settings without throwing TypeError on mutation hooks', () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <SuperadminSettingsGeneralPageClient />
        </NextIntlClientProvider>
      </QueryClientProvider>
    );

    expect(screen.getByText('Global Platform Settings')).toBeTruthy();
    expect(screen.getByTestId('settings-top-save-btn')).toBeTruthy();
    expect(screen.getByTestId('settings-top-reset-btn')).toBeTruthy();
    expect(screen.getByTestId('settings-top-export-btn')).toBeTruthy();
  });
});
