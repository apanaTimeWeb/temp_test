import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminSeatsManagementHarness } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/tests/harness/AdminSeatsManagementHarness';
import { AdminSeatsManagementScenarios } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/tests/harness/bootstrap';

describe('admin_seats_seat_management local scenario harness', () => {
  it.each(AdminSeatsManagementScenarios)('renders the %s state rather than only changing a scenario label', (scenario) => {
    render(<AdminSeatsManagementHarness scenario={scenario}>Feature content</AdminSeatsManagementHarness>);
    expect(screen.getByTestId('admin_seats_management-harness').getAttribute('data-scenario')).toBe(
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
