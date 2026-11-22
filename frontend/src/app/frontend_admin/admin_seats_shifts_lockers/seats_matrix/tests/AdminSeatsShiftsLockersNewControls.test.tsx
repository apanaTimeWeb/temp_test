import { AdminLockersMatrixSettingsModal } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixSettingsModal';
import AdminSeatsMatrixBulkGenerateModal from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/components/AdminSeatsMatrixBulkGenerateModal';
import { AdminShiftsManagementEditModal } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/components/AdminShiftsManagementEditModal';
import { AdminShiftsManagementImportModal } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/components/AdminShiftsManagementImportModal';
import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';
import { fireEvent,render,screen } from '@testing-library/react';
import { describe,expect,it,vi } from 'vitest';

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

describe('Admin Seats, Shifts & Lockers - New Controls Regression Suite', () => {
  describe('Bulk Generate Seats Modal', () => {
    it('renders modal and generates seats in range', () => {
      const onGenerate = vi.fn();
      const onClose = vi.fn();

      render(
        <AdminSeatsMatrixBulkGenerateModal
          isOpen={true}
          onClose={onClose}
          onGenerate={onGenerate}
          defaultBranchName="Downtown Central"
          existingSeatIds={['1', '2']}
        />
      );

      expect(screen.getByText('Bulk Generate Study Desks & Cabins')).toBeTruthy();
      expect(screen.getByText('Quick Presets')).toBeTruthy();

      const generateBtn = screen.getByRole('button', { name: /Generate 50 Seats/i });
      fireEvent.click(generateBtn);

      expect(onGenerate).toHaveBeenCalled();
      const generatedSeats = onGenerate.mock.calls[0][0];
      expect(generatedSeats.length).toBe(50);
      expect(generatedSeats[0].id).toBe('1');
      expect(generatedSeats[49].id).toBe('50');
    });

    it('returns null when isOpen is false', () => {
      const { container } = render(
        <AdminSeatsMatrixBulkGenerateModal
          isOpen={false}
          onClose={vi.fn()}
          onGenerate={vi.fn()}
          existingSeatIds={[]}
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Edit Shift Modal', () => {
    it('renders edit form with prefilled shift data and saves updates', () => {
      const onSaveShift = vi.fn();
      const onClose = vi.fn();

      render(
        <AdminShiftsManagementEditModal
          isOpen={true}
          onClose={onClose}
          shift={mockShift}
          onSaveShift={onSaveShift}
        />
      );

      expect(screen.getByText('Edit Study Shift & Pricing')).toBeTruthy();
      const nameInput = screen.getByDisplayValue('Morning Shift') as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: 'Early Morning Special' } });

      const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
      fireEvent.click(saveBtn);

      expect(onSaveShift).toHaveBeenCalled();
      expect(onSaveShift.mock.calls[0][0].name).toBe('Early Morning Special');
    });
  });

  describe('Import Shifts Modal', () => {
    it('renders import modal and offers sample template download', () => {
      const onImportShifts = vi.fn();
      const onClose = vi.fn();

      render(
        <AdminShiftsManagementImportModal
          isOpen={true}
          onClose={onClose}
          onImportShifts={onImportShifts}
        />
      );

      expect(screen.getByText('Bulk Import Shift Schedules (CSV)')).toBeTruthy();
      expect(screen.getByRole('button', { name: /Download Template/i })).toBeTruthy();
      expect(screen.getByText(/Click or drag & drop Shift CSV file here/i)).toBeTruthy();

      fireEvent.click(screen.getByTitle('Close modal'));
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Locker Rent & Deposit Settings Modal', () => {
    it('renders pricing form and saves updated rent and security deposit policy', () => {
      const onSavePolicy = vi.fn();
      const onClose = vi.fn();

      render(
        <AdminLockersMatrixSettingsModal
          isOpen={true}
          onClose={onClose}
          currentPolicy={{
            monthlyRent: 200,
            securityDeposit: 500,
            lostKeyFee: 150,
            lateFeePerDay: 20,
            branchName: 'All Branches',
          }}
          onSavePolicy={onSavePolicy}
        />
      );

      expect(screen.getByText('Locker Rent & Caution Deposit Settings')).toBeTruthy();
      expect(screen.getByDisplayValue('200')).toBeTruthy();
      expect(screen.getByDisplayValue('500')).toBeTruthy();

      const saveBtn = screen.getByRole('button', { name: /Save Policy Settings/i });
      fireEvent.click(saveBtn);

      expect(onSavePolicy).toHaveBeenCalled();
      expect(onSavePolicy.mock.calls[0][0].monthlyRent).toBe(200);
      expect(onSavePolicy.mock.calls[0][0].securityDeposit).toBe(500);
    });
  });
});
