// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/tests/superadmin_data_export_management.integration.test.tsx
/**
 * @file superadmin_data_export_management.integration.test.tsx
 * @description Integration tests for Tenant Export (Feature 4), Branch Export (Feature 5),
 * and Export Queue table.
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
      ).toBeDefined();
      expect(screen.getByText(/Export Library Tenant Data/i)).toBeDefined();
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
      ).toBeDefined();
      expect(screen.getByText(/Export Branch Data/i)).toBeDefined();
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
      ).toBeDefined();
      expect(screen.getByText('EXP-2026-11-20-001')).toBeDefined();
      expect(screen.getAllByText('Ready').length).toBeGreaterThan(0);
    });
  });

  it('opens export configuration modal when initiate export button is clicked', async () => {
    render(
      <SuperadminDataExportManagementHarness>
        <SuperadminDataExportManagementMain />
      </SuperadminDataExportManagementHarness>
    );

    await waitFor(() => {
      expect(screen.getByText(/Export Library Tenant Data/i)).toBeDefined();
    });

    fireEvent.click(screen.getByText(/Export Library Tenant Data/i));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Configure Data Export Job/i })).toBeDefined();
      expect(screen.getByText(/Data Entities to Include/i)).toBeDefined();
    });
  });
});
