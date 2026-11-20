// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/tests/superadmin_data_export_management.integration.test.tsx
/**
 * @file superadmin_data_export_management.integration.test.tsx
 * @description Integration tests for Tenant Export (Feature 4), Branch Export (Feature 5),
 * and Export Queue table.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SuperadminDataExportManagementHarness } from './harness/SuperadminDataExportManagementHarness';
import { SuperadminDataExportManagementMain } from '../components/SuperadminDataExportManagementMain';

describe('SuperadminDataExportManagement Integration Tests', () => {
  it('renders Tenant Data Export card (Feature 4)', async () => {
    render(
      <SuperadminDataExportManagementHarness>
        <SuperadminDataExportManagementMain />
      </SuperadminDataExportManagementHarness>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Tenant Library Data Export/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/Export Library Tenant Data/i)).toBeInTheDocument();
    });
  });

  it('renders Branch Data Extraction card (Feature 5)', async () => {
    render(
      <SuperadminDataExportManagementHarness>
        <SuperadminDataExportManagementMain />
      </SuperadminDataExportManagementHarness>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Branch-Specific Data Extraction/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/Export Branch Data/i)).toBeInTheDocument();
    });
  });

  it('renders Export Jobs & Download Center table with job entries', async () => {
    render(
      <SuperadminDataExportManagementHarness>
        <SuperadminDataExportManagementMain />
      </SuperadminDataExportManagementHarness>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Export Jobs & Download Center/i })
      ).toBeInTheDocument();
      expect(screen.getByText('EXP-2026-11-20-001')).toBeInTheDocument();
      expect(screen.getAllByText('Ready').length).toBeGreaterThan(0);
    });
  });
});
