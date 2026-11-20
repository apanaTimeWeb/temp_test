// tests/superadmin_data_overview.integration.test.tsx
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperadminDataOverviewMain } from '@/app/frontend_superadmin/superadmin_data/data_overview/components/SuperadminDataOverviewMain';
import { MOCK_SUPERADMIN_DATA_OVERVIEW_METRICS, MOCK_SUPERADMIN_DATA_OVERVIEW_RPO_RTO } from '@/app/frontend_superadmin/superadmin_data/data_overview/mocks/fixtures/superadmin_data_overview.fixtures';

// Mock apiFetch
vi.mock('@/lib/api', () => ({
  apiFetch: vi.fn(async (endpoint: string) => {
    if (endpoint.includes('metrics')) {
      return { success: true, data: MOCK_SUPERADMIN_DATA_OVERVIEW_METRICS, message: 'OK' };
    }
    if (endpoint.includes('rpo-rto-status')) {
      return { success: true, data: MOCK_SUPERADMIN_DATA_OVERVIEW_RPO_RTO, message: 'OK' };
    }
    if (endpoint.includes('recent-activity')) {
      return {
        success: true,
        data: [
          {
            id: 'test-1',
            timestamp: 'Today',
            type: 'BACKUP',
            title: 'Automated Snapshot',
            details: 'Cluster encrypted',
            tenantName: 'Global',
            status: 'SUCCESS',
            durationSeconds: 120,
          },
        ],
        message: 'OK',
      };
    }
    if (endpoint.includes('storage-breakdown')) {
      return {
        success: true,
        data: [{ category: 'PostgreSQL DB', sizeGb: 200, percentage: 50, colorHex: '#ec4899' }],
        message: 'OK',
      };
    }
    return { success: true, data: {}, message: 'OK' };
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('SuperadminDataOverviewMain Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
  });

  it('renders DR readiness score and RPO/RTO compliance status', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SuperadminDataOverviewMain />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/DR Readiness Score/i)).toBeDefined();
      expect(screen.getByText(/Recovery Point Objective/i)).toBeDefined();
      expect(screen.getByText(/Recovery Time Objective/i)).toBeDefined();
    });
  });

  it('opens Quick Backup Snapshot modal when trigger button is clicked', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SuperadminDataOverviewMain />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('data_overview-top-backup-btn')).toBeDefined();
    });

    fireEvent.click(screen.getByTestId('data_overview-top-backup-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('data_overview-quick-backup-modal')).toBeDefined();
    });
  });
});
