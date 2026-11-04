import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminStaffAttendanceHarness } from '@/app/frontend_admin/admin_staff/staff_attendance/tests/harness/AdminStaffAttendanceHarness';
import { AdminStaffAttendancePage } from '@/app/frontend_admin/admin_staff/staff_attendance/components/AdminStaffAttendancePage';

describe('AdminStaffAttendanceRegressionSuite', () => {
  it('renders page header, KPI cards, and default attendance table', () => {
    render(
      <AdminStaffAttendanceHarness>
        <AdminStaffAttendancePage />
      </AdminStaffAttendanceHarness>
    );

    expect(screen.getByText('Staff Attendance & Duty Shifts')).toBeDefined();
    expect(screen.getByText('Total Staff')).toBeDefined();
    expect(screen.getByText('Present On Duty')).toBeDefined();
    expect(screen.getByText('Attendance Rate')).toBeDefined();

    // Vikramaditya Sharma is present by default
    expect(screen.getByText('Vikramaditya Sharma')).toBeDefined();
    expect(screen.getAllByText('Branch Manager').length).toBeGreaterThan(0);
  });

  it('switches between Daily Attendance Logs and Shift Duty Roster tabs', () => {
    render(
      <AdminStaffAttendanceHarness>
        <AdminStaffAttendancePage />
      </AdminStaffAttendanceHarness>
    );

    const rosterTabBtn = screen.getByRole('button', { name: 'Shift Duty Roster' });
    fireEvent.click(rosterTabBtn);

    // Should display shift definitions
    expect(screen.getByText('Morning Shift')).toBeDefined();
    expect(screen.getByText('Evening Shift')).toBeDefined();
    expect(screen.getByText('Night Shift')).toBeDefined();
  });

  it('filters attendance records when searching by name', () => {
    render(
      <AdminStaffAttendanceHarness>
        <AdminStaffAttendancePage />
      </AdminStaffAttendanceHarness>
    );

    const searchInput = screen.getByPlaceholderText('Search by staff name, ID, or role...');
    fireEvent.change(searchInput, { target: { value: 'Pooja' } });

    expect(screen.getByText('Pooja Verma')).toBeDefined();
    expect(screen.queryByText('Vikramaditya Sharma')).toBeNull();
  });

  it('opens and closes the regularize punch dialog', () => {
    render(
      <AdminStaffAttendanceHarness>
        <AdminStaffAttendancePage />
      </AdminStaffAttendanceHarness>
    );

    const regularizeButtons = screen.getAllByRole('button', { name: 'Regularize Punch' });
    fireEvent.click(regularizeButtons[0]);

    expect(screen.getByText('Regularize Staff Punch / Leave')).toBeDefined();
    expect(screen.getByText('Reason for Regularization')).toBeDefined();

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);

    expect(screen.queryByText('Regularize Staff Punch / Leave')).toBeNull();
  });
});
