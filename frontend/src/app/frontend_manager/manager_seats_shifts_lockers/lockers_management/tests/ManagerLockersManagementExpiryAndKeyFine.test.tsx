import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ManagerLockersManagementLostKeyModal } from '../components/manager_lockers_management_views/ManagerLockersManagementLostKeyModal';
import { ManagerLockersManagementAssignModal } from '../components/manager_lockers_management_views/ManagerLockersManagementAssignModal';
import type { ManagerLockersManagementSampleLocker as Locker } from '../mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures';

describe('Lockers Management - Plan Expiry and Lost Key Fine Direct Flow', () => {
  const mockOccupiedLocker: Locker = {
    id: '10',
    lockerId: 'B04',
    status: 'Occupied',
    assignedTo: 'Maria Vargas',
    studentId: 'LIB-055',
    assignedSince: '2024-09-15',
    keyNumber: 'KEY-B04',
    expiryDate: '2026-10-15', // Past date -> plan expired
    seatNo: 'S-05',
  };

  const mockFreeLocker: Locker = {
    id: '2',
    lockerId: 'A02',
    status: 'Free',
    assignedTo: '—',
    studentId: '—',
    assignedSince: '—',
    keyNumber: 'KEY-A02',
  };

  it('renders lost key modal with key number, deposit, and fine deduction', () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <ManagerLockersManagementLostKeyModal
        isOpen={true}
        onClose={handleClose}
        locker={mockOccupiedLocker}
        onConfirmLostKey={handleConfirm}
      />
    );

    // Verify dialog header and details
    expect(screen.getByText(/Report Lost Key & Impose Fine/i)).toBeInTheDocument();
    expect(screen.getAllByText(/KEY-B04/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Maria Vargas/i).length).toBeGreaterThanOrEqual(1);

    // Default fine should be 150
    const fineInput = screen.getByTestId('manager-lost-key-fine-input') as HTMLInputElement;
    expect(fineInput.value).toBe('150');

    // Confirm submission
    const confirmBtn = screen.getByTestId('manager-confirm-lost-key-fine-btn');
    fireEvent.click(confirmBtn);

    expect(handleConfirm).toHaveBeenCalledWith('B04', 150, true, true);
  });

  it('allows customizing fine amount and toggles vacate checkbox', () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <ManagerLockersManagementLostKeyModal
        isOpen={true}
        onClose={handleClose}
        locker={mockOccupiedLocker}
        onConfirmLostKey={handleConfirm}
      />
    );

    const fineInput = screen.getByTestId('manager-lost-key-fine-input');
    fireEvent.change(fineInput, { target: { value: '250' } });

    const vacateCheckbox = screen.getByTestId('manager-lost-key-vacate-checkbox');
    fireEvent.click(vacateCheckbox); // uncheck vacateNow

    const confirmBtn = screen.getByTestId('manager-confirm-lost-key-fine-btn');
    fireEvent.click(confirmBtn);

    expect(handleConfirm).toHaveBeenCalledWith('B04', 250, true, false);
  });

  it('captures key tag and links plan expiry date when allotting a free locker', () => {
    const handleAssign = vi.fn();
    const handleClose = vi.fn();
    const dialogRef = { current: null };

    render(
      <ManagerLockersManagementAssignModal
        locker={mockFreeLocker}
        dialogRef={dialogRef}
        onClose={handleClose}
        onAssign={handleAssign}
      />
    );

    expect(screen.getByText(/Allot Locker #A02/i)).toBeInTheDocument();

    // Verify key tag input is populated
    const keyInput = screen.getByTestId('manager-assign-key-number-input') as HTMLInputElement;
    expect(keyInput.value).toBe('KEY-A02');

    // Select student
    const studentSearchInput = screen.getByPlaceholderText(/Search student by name/i);
    fireEvent.focus(studentSearchInput);
    fireEvent.change(studentSearchInput, { target: { value: 'Aarav' } });

    const studentOption = screen.getByText(/Aarav Sharma/i);
    fireEvent.click(studentOption);

    // Verify submit button is enabled and triggers callback with key number and expiry
    const submitBtn = screen.getByRole('button', { name: /Confirm Allotment/i });
    fireEvent.click(submitBtn);

    expect(handleAssign).toHaveBeenCalledWith(
      'Aarav Sharma',
      'LIB-101',
      'KEY-A02',
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/)
    );
  });
});
