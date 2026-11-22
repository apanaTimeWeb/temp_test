// tests/superadmin_analytics_platform_reports.test.tsx
// Unit & component tests for Superadmin Platform Reports

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperadminAnalyticsPlatformReportsMain } from '../components/SuperadminAnalyticsPlatformReportsMain';
import { SuperadminAnalyticsPlatformReportsKpiGrid } from '../components/SuperadminAnalyticsPlatformReportsKpiGrid';
import { formatPlatformReportNumber, formatPlatformReportPercent } from '../utils/SuperadminAnalyticsPlatformReportsFormatters';

describe('SuperadminAnalyticsPlatformReports', () => {
  it('formats numeric values and percentages accurately', () => {
    expect(formatPlatformReportNumber(1248)).toBe('1,248');
    expect(formatPlatformReportPercent(14.2)).toBe('+14.2%');
    expect(formatPlatformReportPercent(-2.5)).toBe('-2.5%');
  });

  it('renders all 6 KPI cards with correct metric headings', () => {
    const kpis = {
      totalLibraries: 1248,
      totalBranches: 3890,
      activeAccounts: 1180,
      activeAccountsRate: 94.5,
      growthRate: 14.2,
      accountCreations: 84,
      accountCancellations: 12,
      churnRate: 0.96,
    };

    render(<SuperadminAnalyticsPlatformReportsKpiGrid kpis={kpis} />);
    expect(screen.getByText('Total Libraries')).toBeDefined();
    expect(screen.getByText('Total Branches')).toBeDefined();
    expect(screen.getByText('Active Accounts')).toBeDefined();
    expect(screen.getByText('Platform Growth')).toBeDefined();
    expect(screen.getByText('New Account Creation')).toBeDefined();
    expect(screen.getByText('Account Cancellation')).toBeDefined();
  });

  it('renders main orchestrator with filter selectors and table', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <SuperadminAnalyticsPlatformReportsMain />
      </QueryClientProvider>
    );

    expect(screen.getByText('Platform Reports & Growth Metrics')).toBeDefined();
    expect(screen.getByPlaceholderText(/Search by library name/i)).toBeDefined();
  });
});
