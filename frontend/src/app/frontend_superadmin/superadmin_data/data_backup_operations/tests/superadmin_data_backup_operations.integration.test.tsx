// tests/superadmin_data_backup_operations.integration.test.tsx
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperadminDataBackupOperationsMain } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/components/SuperadminDataBackupOperationsMain';
import { MOCK_SUPERADMIN_BACKUP_SCHEDULES } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/mocks/fixtures/superadmin_data_backup_operations.fixtures';

vi.mock('@/lib/api', () => ({
  apiFetch: vi.fn(async (endpoint: string) => {
    if (endpoint.includes('schedules')) {
      return { success: true, data: MOCK_SUPERADMIN_BACKUP_SCHEDULES, message: 'OK' };
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

describe('SuperadminDataBackupOperationsMain Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
  });

  it('renders active automated backup policies table', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SuperadminDataBackupOperationsMain />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Production Continuous WAL Streaming/i)).toBeDefined();
      expect(screen.getByText(/Daily Midnight Full Database Backup/i)).toBeDefined();
    });
  });

  it('opens Create Backup Policy modal when top button is clicked', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SuperadminDataBackupOperationsMain />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('data_backup-open-create-btn')).toBeDefined();
    });

    fireEvent.click(screen.getByTestId('data_backup-open-create-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('data_backup-create-schedule-modal')).toBeDefined();
    });
  });
});
