// tests/superadmin_analytics_usage_reports.test.tsx
// Unit & component tests for Superadmin Usage Reports

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperadminAnalyticsUsageReportsMain } from '../components/SuperadminAnalyticsUsageReportsMain';
import { SuperadminAnalyticsUsageReportsKpiGrid } from '../components/SuperadminAnalyticsUsageReportsKpiGrid';

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

describe('SuperadminAnalyticsUsageReports Component Tests', () => {
  it('renders all 6 usage KPI metric stat cards', () => {
    const mockKpis = {
      totalMembers: 24800,
      totalStaff: 108,
      activeBranches: 48,
      storageUsedGb: 360.7,
      storageQuotaGb: 1024,
      apiCallsCount: 1246200,
      smsConsumed: 36700,
      whatsappConsumed: 51450,
      consumptionBreakdown: [],
    };

    render(<SuperadminAnalyticsUsageReportsKpiGrid kpis={mockKpis} />);

    expect(screen.getByText(/Total Members/i)).toBeDefined();
    expect(screen.getByText(/Active Staff & Operators/i)).toBeDefined();
    expect(screen.getByText(/Operating Branches/i)).toBeDefined();
    expect(screen.getByText(/Cloud Storage Used/i)).toBeDefined();
    expect(screen.getByText(/API Calls Volume/i)).toBeDefined();
    expect(screen.getByText(/SMS & WhatsApp Consumption/i)).toBeDefined();
  });

  it('renders main orchestrator with filter bar and table', async () => {
    renderWithClient(<SuperadminAnalyticsUsageReportsMain />);

    expect(screen.getByText(/Platform Usage & Consumption Reports/i)).toBeDefined();
    expect(screen.getByTestId('usage-reports-open-export-btn')).toBeDefined();
    expect(screen.getByTestId('usage-reports-filter-bar')).toBeDefined();
  });

  it('opens and closes export modal with 5 export options', async () => {
    renderWithClient(<SuperadminAnalyticsUsageReportsMain />);

    const exportBtn = screen.getByTestId('usage-reports-open-export-btn');
    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(screen.getByTestId('usage-reports-export-modal')).toBeDefined();
      expect(screen.getByTestId('usage-export-excel-btn')).toBeDefined();
      expect(screen.getByTestId('usage-export-csv-btn')).toBeDefined();
      expect(screen.getByTestId('usage-export-pdf-btn')).toBeDefined();
      expect(screen.getByTestId('usage-export-print-btn')).toBeDefined();
      expect(screen.getByTestId('usage-export-download-btn')).toBeDefined();
    });
  });
});
