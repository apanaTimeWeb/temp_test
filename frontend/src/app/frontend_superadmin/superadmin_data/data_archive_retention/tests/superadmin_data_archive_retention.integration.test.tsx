// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/tests/superadmin_data_archive_retention.integration.test.tsx
/**
 * @file superadmin_data_archive_retention.integration.test.tsx
 * @description Integration tests for Data Retention Policies (Feature 8)
 * and Cold Storage Archive Catalog (Feature 7).
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SuperadminDataArchiveRetentionHarness } from './harness/SuperadminDataArchiveRetentionHarness';
import { SuperadminDataArchiveRetentionMain } from '../components/SuperadminDataArchiveRetentionMain';

describe('SuperadminDataArchiveRetention Integration Tests', () => {
  it('renders Data Retention & Auto-Purge Policies table (Feature 8)', async () => {
    render(
      <SuperadminDataArchiveRetentionHarness>
        <SuperadminDataArchiveRetentionMain />
      </SuperadminDataArchiveRetentionHarness>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Data Retention & Auto-Purge Policies/i })
      ).toBeInTheDocument();
      expect(screen.getAllByText('CLOSED_PATRONS').length).toBeGreaterThan(0);
    });
  });

  it('renders Cold Storage Data Archive Catalog (Feature 7)', async () => {
    render(
      <SuperadminDataArchiveRetentionHarness>
        <SuperadminDataArchiveRetentionMain />
      </SuperadminDataArchiveRetentionHarness>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Cold Storage Data Archive Catalog/i })
      ).toBeInTheDocument();
      expect(screen.getByText('PAT-ARCH-2022-0941')).toBeInTheDocument();
      expect(screen.getByText(/Legal Hold Active/i)).toBeInTheDocument();
    });
  });
});
