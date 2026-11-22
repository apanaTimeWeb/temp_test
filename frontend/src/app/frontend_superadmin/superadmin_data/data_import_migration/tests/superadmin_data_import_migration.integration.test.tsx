// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/tests/superadmin_data_import_migration.integration.test.tsx
/**
 * @file superadmin_data_import_migration.integration.test.tsx
 * @description Integration tests for Import Management (Feature 9),
 * Validation (Feature 10), and History & Rollback (Feature 11).
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SuperadminDataImportMigrationHarness } from './harness/SuperadminDataImportMigrationHarness';
import { SuperadminDataImportMigrationMain } from '../components/SuperadminDataImportMigrationMain';

describe('SuperadminDataImportMigration Integration Tests', () => {
  it('renders Migration Ingestion Wizard (Feature 9)', async () => {
    render(
      <SuperadminDataImportMigrationHarness>
        <SuperadminDataImportMigrationMain />
      </SuperadminDataImportMigrationHarness>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Library Migration Ingestion Wizard/i })
      ).toBeDefined();
      expect(screen.getByText(/Run Pre-flight Dry Run/i)).toBeDefined();
      expect(screen.getByText(/Destination Library Tenant/i)).toBeDefined();
    });
  });

  it('renders Migration Batches & Rollback History table (Feature 11)', async () => {
    render(
      <SuperadminDataImportMigrationHarness>
        <SuperadminDataImportMigrationMain />
      </SuperadminDataImportMigrationHarness>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Migration Batches & Rollback History/i })
      ).toBeDefined();
      expect(screen.getByText('MIG-2026-11-20-001')).toBeDefined();
      expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
    });
  });
});
