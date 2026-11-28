import { AdminShiftsManagementEditModal } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/components/AdminShiftsManagementEditModal';
import { AdminShiftsManagementImportModal } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/components/AdminShiftsManagementImportModal';
import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockShift: AdminShiftsShift = {
  id: 'shift-test-1',
  name: 'Morning Shift',
  startTime: '06:00',
  endTime: '14:00',
  monthlyPrice: 800,
  capacity: 24,
  occupancy: 10,
  active: true,
  branchName: 'Downtown Central',
};

describe('Admin Shifts Management Modals', () => {
  it('renders edit form with prefilled shift data and saves updates', () => {
    const onSaveShift = vi.fn();
    const onClose = vi.fn();

    render(
      <AdminShiftsManagementEditModal
        isOpen={true}
        onClose={onClose}
        shift={mockShift}
        onSaveShift={onSaveShift}
      />,
    );

    expect(screen.getByText('Edit Study Shift & Pricing')).toBeTruthy();
    const nameInput = screen.getByDisplayValue('Morning Shift') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Early Morning Special' } });

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);

    expect(onSaveShift).toHaveBeenCalled();
    expect(onSaveShift.mock.calls[0][0].name).toBe('Early Morning Special');
  });

  it('renders import modal and offers sample template download', () => {
    const onImportShifts = vi.fn();
    const onClose = vi.fn();

    render(
      <AdminShiftsManagementImportModal
        isOpen={true}
        onClose={onClose}
        onImportShifts={onImportShifts}
      />,
    );

    expect(screen.getByText('Bulk Import Shift Schedules (CSV)')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Download Template/i })).toBeTruthy();
    expect(screen.getByText(/Click or drag & drop Shift CSV file here/i)).toBeTruthy();

    fireEvent.click(screen.getByTitle('Close modal'));
    expect(onClose).toHaveBeenCalled();
  });
});
