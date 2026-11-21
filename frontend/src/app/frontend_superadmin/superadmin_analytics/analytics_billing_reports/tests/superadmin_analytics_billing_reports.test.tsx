// tests/superadmin_analytics_billing_reports.test.tsx
// Unit & component tests for Superadmin Billing Reports

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperadminAnalyticsBillingReportsMain } from '../components/SuperadminAnalyticsBillingReportsMain';
import { SuperadminAnalyticsBillingReportsKpiGrid } from '../components/SuperadminAnalyticsBillingReportsKpiGrid';

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('SuperadminAnalyticsBillingReports Component Tests', () => {
  it('renders all 6 financial KPI metric stat cards', () => {
    const mockKpis = {
      totalRevenueMinor: 145000000,
      mrrMinor: 12500000,
      yrrMinor: 150000000,
      pendingInvoicesCount: 14,
      pendingAmountMinor: 4500000,
      failedPaymentsCount: 5,
      failedAmountMinor: 1250000,
      refundsCount: 3,
      refundAmountMinor: 750000,
      planWiseIncome: [
        { planName: 'Enterprise Plan', revenueMinor: 85000000, subscriberCount: 42, percentage: 58.6 },
      ],
    };

    render(<SuperadminAnalyticsBillingReportsKpiGrid kpis={mockKpis} />);

    expect(screen.getByText(/Gross Platform Revenue/i)).toBeDefined();
    expect(screen.getByText(/Monthly Recurring \(MRR\)/i)).toBeDefined();
    expect(screen.getByText(/Yearly Recurring \(ARR\)/i)).toBeDefined();
    expect(screen.getByText(/Pending Invoices/i)).toBeDefined();
    expect(screen.getByText(/Failed Transactions/i)).toBeDefined();
    expect(screen.getByText(/Refunds & Disputes/i)).toBeDefined();
  });

  it('renders main orchestrator with filter bar and table', async () => {
    renderWithClient(<SuperadminAnalyticsBillingReportsMain />);

    expect(screen.getByText(/Billing & Financial Reports/i)).toBeDefined();
    expect(screen.getByTestId('billing-reports-open-export-btn')).toBeDefined();
  });

  it('opens and closes export modal with 5 export options', async () => {
    renderWithClient(<SuperadminAnalyticsBillingReportsMain />);

    const exportBtn = screen.getByTestId('billing-reports-open-export-btn');
    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(screen.getByTestId('billing-reports-export-modal')).toBeDefined();
      expect(screen.getByTestId('billing-export-excel-btn')).toBeDefined();
      expect(screen.getByTestId('billing-export-csv-btn')).toBeDefined();
      expect(screen.getByTestId('billing-export-pdf-btn')).toBeDefined();
      expect(screen.getByTestId('billing-export-print-btn')).toBeDefined();
      expect(screen.getByTestId('billing-export-download-btn')).toBeDefined();
    });
  });
});
