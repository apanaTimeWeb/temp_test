import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SuperadminUsageOverviewMain from '../components/SuperadminUsageOverviewMain';
import { MOCK_LIBRARY_USAGE_LIST, MOCK_SYSTEM_USAGE_SUMMARY } from '../mocks/fixtures/superadmin_usage_overview.fixtures';

vi.mock('../hooks/useSuperadminUsageOverviewList', () => ({
  useSuperadminUsageOverviewList: () => ({
    libraries: MOCK_LIBRARY_USAGE_LIST,
    summary: MOCK_SYSTEM_USAGE_SUMMARY,
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('SuperadminUsageOverviewMain Component', () => {
  it('renders overage banner and search filter bar', () => {
    renderWithClient(<SuperadminUsageOverviewMain />);

    // Banner elements
    expect(screen.getByText(/Zero Silent Extra Billing Guarantee/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search library name or plan/i)).toBeInTheDocument();
  });

  it('renders KPI meters and table showing 12-resource columns', () => {
    renderWithClient(<SuperadminUsageOverviewMain />);

    // KPI meters
    expect(screen.getByText(/1\. Branches/i)).toBeInTheDocument();
    expect(screen.getByText(/5-6\. Cloud Storage/i)).toBeInTheDocument();

    // Table columns & data
    expect(screen.getByText(/Branches \(Cur \/ Max\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Admins & Staff/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/SMS & WhatsApp/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Patna Central Reading Rooms/i).length).toBeGreaterThanOrEqual(1);
  });
});
