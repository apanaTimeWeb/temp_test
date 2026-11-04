import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminStaffPayrollHarness } from '@/app/frontend_admin/admin_staff/staff_payroll/tests/harness/AdminStaffPayrollHarness';
import { AdminStaffPayrollPage } from '@/app/frontend_admin/admin_staff/staff_payroll/components/AdminStaffPayrollPage';

describe('AdminStaffPayrollRegressionSuite', () => {
  it('renders page header, KPI summary cards, and default salary table', () => {
    render(
      <AdminStaffPayrollHarness>
        <AdminStaffPayrollPage />
      </AdminStaffPayrollHarness>
    );

    expect(screen.getByText('Staff Payroll & Salaries')).toBeDefined();
    expect(screen.getByText('Total Payroll')).toBeDefined();
    expect(screen.getAllByText('Disbursed').length).toBeGreaterThan(0);
    expect(screen.getByText('Pending')).toBeDefined();

    // Staff names in table
    expect(screen.getByText('Vikramaditya Sharma')).toBeDefined();
    expect(screen.getByText('Pooja Verma')).toBeDefined();
  });

  it('filters payroll records when searching by name', () => {
    render(
      <AdminStaffPayrollHarness>
        <AdminStaffPayrollPage />
      </AdminStaffPayrollHarness>
    );

    const searchInput = screen.getByPlaceholderText('Search by staff name, ID, or role...');
    fireEvent.change(searchInput, { target: { value: 'Pooja' } });

    expect(screen.getByText('Pooja Verma')).toBeDefined();
    expect(screen.queryByText('Vikramaditya Sharma')).toBeNull();
  });

  it('opens and closes the double-verification disbursal modal', () => {
    render(
      <AdminStaffPayrollHarness>
        <AdminStaffPayrollPage />
      </AdminStaffPayrollHarness>
    );

    // Click on active Disburse button (Pooja Verma is PENDING)
    const disburseButtons = screen.getAllByRole('button', { name: 'Disburse Salary' });
    const activeDisburseBtn = disburseButtons.find((btn) => !btn.hasAttribute('disabled'))!;
    fireEvent.click(activeDisburseBtn);

    expect(screen.getByText('Confirm Staff Salary Disbursal')).toBeDefined();
    expect(screen.getByText(/Double-verification check/i)).toBeDefined();
    expect(screen.getByText('Authorize & Disburse')).toBeDefined();

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);

    expect(screen.queryByText('Confirm Staff Salary Disbursal')).toBeNull();
  });

  it('opens and renders the printable monthly employee pay slip dialog', () => {
    render(
      <AdminStaffPayrollHarness>
        <AdminStaffPayrollPage />
      </AdminStaffPayrollHarness>
    );

    const slipButtons = screen.getAllByRole('button', { name: 'View Salary Slip' });
    fireEvent.click(slipButtons[0]);

    expect(screen.getByText('Monthly Employee Pay Slip')).toBeDefined();
    expect(screen.getByText('Library Administrative Services — Central Payroll')).toBeDefined();
    expect(screen.getByText('Print Pay Slip')).toBeDefined();

    const closeBtn = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Monthly Employee Pay Slip')).toBeNull();
  });
});
