// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/tests/superadmin_data_restore_operations.integration.test.tsx
/**
 * @file superadmin_data_restore_operations.integration.test.tsx
 * @description Integration tests for Restore Operations, Tenant Isolation, and Sandbox Drills.
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SuperadminDataRestoreOperationsHarness } from './harness/SuperadminDataRestoreOperationsHarness';
import { SuperadminDataRestoreOperationsMain } from '../components/SuperadminDataRestoreOperationsMain';

describe('SuperadminDataRestoreOperations Integration Tests', () => {
  it('renders Multi-Tenant Isolation Assurance banner with zero-bleed law', async () => {
    render(
      <SuperadminDataRestoreOperationsHarness>
        <SuperadminDataRestoreOperationsMain />
      </SuperadminDataRestoreOperationsHarness>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Multi-Tenant Isolation Assurance \(Zero-Bleed Law\)/i)
      ).toBeDefined();
    });
  });

  it('renders Sandbox Restore Testing & Automated Disaster Recovery Verification Card', async () => {
    render(
      <SuperadminDataRestoreOperationsHarness>
        <SuperadminDataRestoreOperationsMain />
      </SuperadminDataRestoreOperationsHarness>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Automated Restore Verification & Sandbox Drills/i)
      ).toBeDefined();
      expect(screen.getByText(/Trigger Disaster Drill/i)).toBeDefined();
    });
  });

  it('renders Snapshot catalog table with snapshot records', async () => {
    render(
      <SuperadminDataRestoreOperationsHarness>
        <SuperadminDataRestoreOperationsMain />
      </SuperadminDataRestoreOperationsHarness>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Backup Snapshot History Catalog/i)
      ).toBeDefined();
      expect(screen.getByText('SNP-2026-11-20-001')).toBeDefined();
    });
  });

  it('opens double-verification restore modal when Restore is clicked', async () => {
    render(
      <SuperadminDataRestoreOperationsHarness>
        <SuperadminDataRestoreOperationsMain />
      </SuperadminDataRestoreOperationsHarness>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Restore').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getAllByText('Restore')[0]);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Authorize Point-in-Time Restore/i })).toBeDefined();
      expect(screen.getByText(/CONFIRM-RESTORE/i)).toBeDefined();
    });
  });
});
