import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminSystemSmartIdHarness } from '@/app/frontend_admin/admin_system/system_smart_id/tests/harness/AdminSystemSmartIdHarness';
import { AdminSystemSmartIdScenarios } from '@/app/frontend_admin/admin_system/system_smart_id/tests/harness/bootstrap';

describe('admin_system_smart_id local scenario harness', () => {
  it.each(AdminSystemSmartIdScenarios)('renders the %s state rather than only changing a scenario label', (scenario) => {
    render(<AdminSystemSmartIdHarness scenario={scenario}>Feature content</AdminSystemSmartIdHarness>);
    expect(screen.getByTestId('admin_system_smart_id-harness').getAttribute('data-scenario')).toBe(
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
