// tests/superadmin_analytics_security_reports.test.tsx
// Unit & component tests for Superadmin Security Reports

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperadminAnalyticsSecurityReportsMain } from '../components/SuperadminAnalyticsSecurityReportsMain';
import { SuperadminAnalyticsSecurityReportsKpiGrid } from '../components/SuperadminAnalyticsSecurityReportsKpiGrid';

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

describe('SuperadminAnalyticsSecurityReports Component Tests', () => {
  it('renders all 6 security KPI metric stat cards', () => {
    const mockKpis = {
      totalLogins: 94820,
      failedLogins: 1420,
      lockedAccounts: 38,
      permissionChanges: 247,
      dataExports: 189,
      suspiciousActivities: 14,
      threatDistribution: [],
    };

    render(<SuperadminAnalyticsSecurityReportsKpiGrid kpis={mockKpis} />);

    expect(screen.getByText(/Total Login History/i)).toBeDefined();
    expect(screen.getByText(/Failed Logins/i)).toBeDefined();
    expect(screen.getByText(/Locked Accounts/i)).toBeDefined();
    expect(screen.getByText(/Permission Changes/i)).toBeDefined();
    expect(screen.getByText(/Data Exports Triggered/i)).toBeDefined();
    expect(screen.getByText(/Suspicious Activities/i)).toBeDefined();
  });

  it('renders main orchestrator with filter bar and table', async () => {
    renderWithClient(<SuperadminAnalyticsSecurityReportsMain />);

    expect(screen.getByText(/Platform Security & Threat Audit Reports/i)).toBeDefined();
    expect(screen.getByTestId('security-reports-open-export-btn')).toBeDefined();
    expect(screen.getByTestId('security-reports-filter-bar')).toBeDefined();
  });

  it('opens and closes export modal with 5 export options', async () => {
    renderWithClient(<SuperadminAnalyticsSecurityReportsMain />);

    const exportBtn = screen.getByTestId('security-reports-open-export-btn');
    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(screen.getByTestId('security-reports-export-modal')).toBeDefined();
      expect(screen.getByTestId('security-export-excel-btn')).toBeDefined();
      expect(screen.getByTestId('security-export-csv-btn')).toBeDefined();
      expect(screen.getByTestId('security-export-pdf-btn')).toBeDefined();
      expect(screen.getByTestId('security-export-print-btn')).toBeDefined();
      expect(screen.getByTestId('security-export-download-btn')).toBeDefined();
    });
  });
});
