// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/tests/superadmin_data_restore_operations.integration.test.tsx
/**
 * @file superadmin_data_restore_operations.integration.test.tsx
 * @description Integration tests for Restore Operations, Tenant Isolation, and Sandbox Drills.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
      ).toBeInTheDocument();
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
      ).toBeInTheDocument();
      expect(screen.getByText(/Trigger Disaster Drill/i)).toBeInTheDocument();
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
      ).toBeInTheDocument();
      expect(screen.getByText('SNP-2026-11-20-001')).toBeInTheDocument();
    });
  });
});
