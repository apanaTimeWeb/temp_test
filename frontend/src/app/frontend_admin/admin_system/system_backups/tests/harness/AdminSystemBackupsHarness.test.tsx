import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminSystemBackupsHarness } from '@/app/frontend_admin/admin_system/system_backups/tests/harness/AdminSystemBackupsHarness';
const AdminSystemBackupsScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;

describe('admin_system_backups local scenario harness', () => {
  it.each(AdminSystemBackupsScenarios)('renders the %s state rather than only changing a scenario label', (scenario) => {
    render(<AdminSystemBackupsHarness scenario={scenario}>Feature content</AdminSystemBackupsHarness>);
    expect(screen.getByTestId('admin_system_backups-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    if (scenario === 'ACTIVE') {
      expect(screen.getByText('Feature content')).toBeTruthy();
      expect(screen.queryByRole('alert')).toBeNull();
      return;
    }

    expect(screen.queryByText('Feature content')).toBeNull();
    if (scenario === 'EMPTY') {
      expect(screen.getByRole('status').textContent).toContain('No records available');
      return;
    }
    if (scenario === 'SERVER_500') {
      expect(screen.getByRole('alert').textContent).toContain('HTTP 500');
      return;
    }
    if (scenario === 'TIMEOUT') {
      expect(screen.getByRole('alert').textContent).toContain('timeout');
      return;
    }
    expect(screen.getByRole('alert').textContent).toContain('HTTP 401');
  });
});
