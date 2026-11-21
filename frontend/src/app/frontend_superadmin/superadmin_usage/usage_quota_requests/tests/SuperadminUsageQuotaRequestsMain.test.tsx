import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperadminUsageQuotaRequestsMain } from '../components/SuperadminUsageQuotaRequestsMain';
import {
  MOCK_QUOTA_REQUESTS_LIST,
  MOCK_QUOTA_REQUESTS_KPIS,
} from '../mocks/fixtures/superadmin_usage_quota_requests.fixtures';

vi.mock('../hooks/useSuperadminUsageQuotaRequestsQueries', () => ({
  useSuperadminUsageQuotaRequestsQueries: () => ({
    requests: MOCK_QUOTA_REQUESTS_LIST,
    kpis: MOCK_QUOTA_REQUESTS_KPIS,
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('SuperadminUsageQuotaRequestsMain Component', () => {
  it('renders header banner with SuperAdmin Approval Gate badge', () => {
    renderWithClient(<SuperadminUsageQuotaRequestsMain />);
    expect(screen.getByText(/Branch & Quota Upgrade Requests/i)).toBeInTheDocument();
    expect(screen.getByText(/SuperAdmin Approval Gate/i)).toBeInTheDocument();
    expect(screen.getByText(/Zero Silent Extra Billing Enforced/i)).toBeInTheDocument();
  });

  it('renders KPI summary cards with counts', () => {
    renderWithClient(<SuperadminUsageQuotaRequestsMain />);
    expect(screen.getByText('Pending Review')).toBeInTheDocument();
    expect(screen.getByText('Branch Expansions')).toBeInTheDocument();
    expect(screen.getByText('Approved Quotas')).toBeInTheDocument();
  });

  it('renders table rows showing 4th branch expansion requests and action buttons', () => {
    renderWithClient(<SuperadminUsageQuotaRequestsMain />);
    expect(screen.getByText(/Nalanda Digital Study Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Patna Central Reading Rooms/i)).toBeInTheDocument();
    
    // Check 1-click Approve buttons
    const approveButtons = screen.getAllByRole('button', { name: /Approve/i });
    expect(approveButtons.length).toBeGreaterThan(0);

    // Click Approve button to open approval modal
    fireEvent.click(approveButtons[0]);
    expect(screen.getByText(/Approve Resource Quota Expansion/i)).toBeInTheDocument();
    expect(screen.getByText(/Approved Capacity Limit/i)).toBeInTheDocument();
  });
});
