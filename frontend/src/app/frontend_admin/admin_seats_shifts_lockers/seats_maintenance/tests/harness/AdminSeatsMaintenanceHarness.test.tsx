import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminSeatsMaintenanceHarness } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_maintenance/tests/harness/AdminSeatsMaintenanceHarness';
import { AdminSeatsMaintenanceScenarios } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_maintenance/tests/harness/bootstrap';

describe('admin_seats_maintenance local scenario harness', () => {
  it.each(AdminSeatsMaintenanceScenarios)('renders the %s state rather than only changing a scenario label', (scenario) => {
    render(<AdminSeatsMaintenanceHarness scenario={scenario}>Feature content</AdminSeatsMaintenanceHarness>);
    expect(screen.getByTestId('admin_seats_maintenance-harness').getAttribute('data-scenario')).toBe(
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
