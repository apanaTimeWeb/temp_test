import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminSeatsMatrixHarness } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/tests/harness/AdminSeatsMatrixHarness';
import { AdminSeatsMatrixScenarios } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/tests/harness/bootstrap';

describe('admin_seat_matrix_main local scenario harness', () => {
  it.each(AdminSeatsMatrixScenarios)('exposes the %s scenario without assuming a backend DTO', (scenario) => {
    render(<AdminSeatsMatrixHarness scenario={scenario}>Feature content</AdminSeatsMatrixHarness>);
    expect(screen.getByTestId('admin_seats_matrix-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    expect(screen.getByText('Feature content')).toBeTruthy();
  });
});
